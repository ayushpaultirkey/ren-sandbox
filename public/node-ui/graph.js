import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { IGraph } from "../node/graph.js";
import { INode } from "../node/node.js";
import { UINode } from "./node.js";
import { Link } from "./link.js";


class UIGraph extends H12 {

    constructor() {
        
        super();
        this.igraph = null;

        this.activePin = null;
        this.activeHoverPin = null;
        this.helperLinks = {};

    }

    main(args = {}) {

        this.igraph = args.iobject;

        this.registerSVG();
        this.registerActivePin();
        this.registerHelperLine();
        this.registerActiveHoverPin();

        this.set("{nodes}", "");
        this.addNode(INode, null, 20, 20);
        this.addNode(INode, null, 140, 40);
        this.addNode(INode, null, 280, 80);

    }

    render() {

        return <>
            <div class="w-full h-full overflow-hidden relative border-2 border-yellow-400">
                { this.createSVG("backGraph") }
                <div class="w-full h-full relative border-2 border-red-400">
                    {nodes}
                </div>
                { this.createSVG("topGraph") }
            </div>
        </>;

    }

    addNode(nodeClass, nodeUUID, x = 20, y = 20) {

        const node = this.igraph.addNode(nodeClass, nodeUUID);
        if(!node) return;
        
        const { nodes } = this.key;
        nodes(<><node args x={ x } y={ y } alias={ UINode } iobject={ node }></node></>, "x++");

    }

    registerSVG() {

        const { root: parent } = this;
        const { topGraph, backGraph } = this.element;
    
        window.addEventListener("resize", (event) => {
            this.resizeSVG([ backGraph, topGraph ], parent);
        });

    }
    resizeSVG(graphs = [], parent) {
        
        const rect = parent.getClientRects()[0];
        if(!rect || !rect.width || !rect.height) return;

        const w = rect.width;
        const h = rect.height;
        
        graphs.forEach(graph => {
            graph.setAttributeNS(null, "viewBox", `0 0 ${w} ${h}`);
            graph.setAttributeNS(null, "width", w);
            graph.setAttributeNS(null, "height", h);
        });
        
    }
    createSVG(id) {
        return <>
            <svg width="512" height="512" id={ id } class="absolute select-none pointer-events-none border-2 border-zinc-500 top-0 left-0"></svg>
        </>
    }

    
    linkNodes(nodeA, pinA, nodeB, pinB) {
        return this.igraph.linkNodes(nodeA, pinA, nodeB, pinB);
    }

    registerHelperLine() {
        dispatcher.bind("createHelperLine", (e, pin) => {

            const pinID = pin.id;

            const line = <><line svg x1={ 0 } y1={ 0 } x2={ 0 } y2={ 0 } style="stroke:rgb(59,130,246);stroke-width:2;" class="path"></line></>;

            const { topGraph } = this.element;
            topGraph.append(line);
            this.helperLinks[pinID] = line;

        });
        dispatcher.bind("updateHelperLine", (e, { pin, event }) => {

            const pinID = pin.id;
            const pinRoot = pin.root;

            const { x: parentX, y: parentY } = this.root.getBoundingClientRect();
            const { x, y, width, height } = pinRoot.getBoundingClientRect();

            const x1 = x - parentX + width / 2;
            const y1 = y - parentY + height / 2;

            const line = this.helperLinks[pinID];
            if(line) {

                line.setAttributeNS(null, "x1", x1);
                line.setAttributeNS(null, "y1", y1);
                line.setAttributeNS(null, "x2", event.clientX - parentX);
                line.setAttributeNS(null, "y2", event.clientY - parentY);

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

                const success = this.linkNodes(opin.getNode(), opin.getUUID(), ipin.getNode(), ipin.getUUID());
                if(!success) {
                    console.error("Cannot connect", ipin);
                    return;
                }

                console.log("connected");
            
                const link = new Link({ source: opin, target: ipin, graph: this });
                const line = link.create();

                this.helperLinks[link.uuid] = line;

                this.element.backGraph.append(line);

            }

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



}

export { UIGraph };