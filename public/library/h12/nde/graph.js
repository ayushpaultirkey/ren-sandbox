import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/h12/dispatcher";

import { Node } from "./node";
import Link from "./link";




function createSVG(w, h) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    element.setAttributeNS(null, "viewBox", "0 0 " + w + " " + h);
    element.setAttributeNS(null, "width", w);
    element.setAttributeNS(null, "height", h);
    element.setAttributeNS(null, "style", "position: absolute; user-select: none; pointer-events: none;");
    return element;
}
function updateGraphs(parent, graphs = []) {

    window.addEventListener("resize", (ev) => {

        const { width, height } = parent.getClientRects()[0];
        const w = width;
        const h = height;

        graphs.forEach(graph => {
            graph.setAttributeNS(null, "viewBox", "0 0 " + w + " " + h);
            graph.setAttributeNS(null, "width", w);
            graph.setAttributeNS(null, "height", h);
        });

    });

}
function createLine(x1, y1, x2, y2) {
    var g = document.createElementNS("http://www.w3.org/2000/svg", "line");
    g.setAttributeNS(null, "x1", x1);
    g.setAttributeNS(null, "y1", y1);
    g.setAttributeNS(null, "x2", x2);
    g.setAttributeNS(null, "y2", y2);
    g.setAttributeNS(null, "style", "stroke:rgb(59,130,246);stroke-width:2");
    g.setAttributeNS(null, "class", "path");
    return g;
}











class Graph extends H12 {
    constructor() {
        super();
        this.uid = crypto.randomUUID();
        
        this.helperLinks = {};

        this.activePin = null;
        this.activeHoverPin = null;

        this.topGraph;
        this.backGraph;

    }
    registerSVG() {
        const wi = window.innerWidth;
        const hi = window.innerHeight;

        this.topGraph = createSVG(wi, hi);
        this.element.topGraph.append(this.topGraph);

        this.backGraph = createSVG(wi, hi);
        this.element.backGraph.append(this.backGraph);

        updateGraphs(this.root, [ this.topGraph, this.backGraph ]);
    }
    registerHelperLine() {
        dispatcher.bind("createHelperLine", (e, pin) => {

            const pinID = pin.id;
            const pinRoot = pin.root;

            const { x, y, width, height } = pinRoot.getBoundingClientRect();
            const x1 = x + (width / 2);
            const y1 = y + (height / 2);

            const line = createLine(x1, y1, x1, y1);

            this.topGraph.append(line);
            this.helperLinks[pinID] = line;

        });
        dispatcher.bind("updateHelperLine", (e, { pin, event }) => {

            const pinID = pin.id;
            const pinRoot = pin.root;

            const line = this.helperLinks[pinID];
            if(line) {

                const { x, y, width, height } = pinRoot.getBoundingClientRect();
                const x1 = x + (width / 2);
                const y1 = y + (height / 2);

                line.setAttributeNS(null, "x1", x1);
                line.setAttributeNS(null, "y1", y1);
                line.setAttributeNS(null, "x2", event.clientX);
                line.setAttributeNS(null, "y2", event.clientY);

            }
        });
        dispatcher.bind("removeHelperLine", (e, pin) => {

            const pinID = pin.id;

            this.helperLinks[pinID].remove();
            delete this.helperLinks[pinID];

        });
    }
    registerActivePin() {
        dispatcher.bind("createActivePin", (e, pin) => {
            this.activePin = pin;
            console.log(this.activePin);
        });
        dispatcher.bind("removeActivePin", (e, pin) => {

            const opin = this.activePin;
            const ipin = this.activeHoverPin;

            this.activePin = null;
            this.activeHoverPin = null;

            if(ipin && opin) {
                
                if(!ipin.canConnect(opin) || !opin.canConnect(ipin)) {
                    console.error("Cannot connect", ipin);
                    return;
                }

                const link = new Link(ipin, opin);
                link.create();

                this.backGraph.append(link.getLine());

                console.log("connected");

            }

            console.log(this.activePin);

        });
    }
    registerActiveHoverPin() {
        dispatcher.bind("createActiveHoverPin", (e, pin) => {
            if(this.activePin) {
                this.activeHoverPin = pin;
                console.log(this.activeHoverPin);
            }
        });
        dispatcher.bind("removeActiveHoverPin", (e, pin) => {
            if(this.activePin) {
                this.activeHoverPin = null;
                console.log(this.activeHoverPin);
            }
        });
    }
    main() {

        this.registerSVG();
        this.registerHelperLine();
        this.registerActivePin();
        this.registerActiveHoverPin();

        

    }
    render() {
        return <>
            <div class="w-full h-full overflow-auto scroll relative">
                <div id="backGraph"></div>
                <div>
                    <node args x="20" y="20" alias={ Node } title="begin" value="0"></node>
                    <node args x="120" y="80" alias={ Node } title="task" value="1"></node>
                    <node args x="220" y="140" alias={ Node } title="task" value="2"></node>
                    <node args x="320" y="200" alias={ Node } title="task" value="4"></node>
                    <node args x="420" y="260" alias={ Node } title="end" value="3"></node>
                </div>
                <div id="topGraph"></div>
            </div>
        </>;
    }
}

export { Graph }