import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/h12/dispatcher";
import { GBeginNode, GEndNode, GNode, GTaskNode } from "./node";

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

class Link {
    constructor(inPin, outPin) {
        this.id = crypto.randomUUID();
        this.inPin = inPin;
        this.outPin = outPin;
        this.line = null
    }
    bind() {

        const { inPin, outPin } = this;

        console.log(inPin)

        const o = inPin.root.getBoundingClientRect();
        const x1 = o.left + (o.width / 2);
        const y1 = o.top + (o.height / 2);

        const i = outPin.root.getBoundingClientRect();
        const x2 = i.left + (i.width / 2);
        const y2 = i.top + (i.height / 2);

        inPin.parent.root.addEventListener("mousedown", this.onMouseDown.bind(this));
        outPin.parent.root.addEventListener("mousedown", this.onMouseDown.bind(this));

        this.line = createLine(x2, y2, x1, y1);

        return this.line;

    }
    remove() {
        this.line.remove();
    }
    onMouseDown(event) {

        const id = this.id;
        const { inPin, outPin } = this;

        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", onDragStop);

        function onDragMove(e) {
            
            console.log(outPin.id, inPin.id)
            
            const o = outPin.root.getBoundingClientRect();
            const x1 = o.left + (o.width / 2);
            const y1 = o.top + (o.height / 2);

            const i = inPin.root.getBoundingClientRect();
            const x2 = i.left + (i.width / 2);
            const y2 = i.top + (i.height / 2);
        
            dispatcher.call("socketUpdate", { id: id, x1: x1, y1: y1, x2: x2, y2: y2 });
    
        }

        function onDragStop() {
            window.removeEventListener("mousemove", onDragMove);
            window.removeEventListener("mouseup", onDragStop);
        }

    }
}



class Graph extends H12 {
    constructor() {
        super();
        this.tempLines = {};
        this.activeLines = {};
        this.links = {};
        this.activeSocket = null;
    }
    removeLine(link) {
        link.lines.forEach(line => {
            line.remove();
        });
        link.lines = [];
        //this.activeLines[link].line.remove();
        //delete this.activeLines[link];
    }
    main() {
        
        const wi = window.innerWidth;
        const hi = window.innerHeight;

        var topGraphElem = createSVG(wi, hi);
        this.element.topGraph.append(topGraphElem);

        var backGraphElem = createSVG(wi, hi);
        this.element.backGraph.append(backGraphElem);

        updateGraphs(this.root, [ topGraphElem, backGraphElem ]);

        dispatcher.bind("pinDisconnect", (e, pin) => {
            
            // for(const link in pin.links) {
            //     const opin = pin.links[link];
            //     if(opin) {
            //         opin.disconnect();
            //         this.removeLine(link);
            //     }
            // };

            pin.links.forEach(link => {
                if(link) {
                    link.disconnect();
                    this.removeLine(link);
                }
            })

            pin.disconnect();

        });
        dispatcher.bind("socketDragStart", (e, pin) => {
            this.activeSocket = pin;
            console.warn(pin);
        });
        dispatcher.bind("socketDragEnd", (e, ipin) => {
            const opin = this.activeSocket; 
            if(opin) {

                if(!ipin.canConnect(opin) || !opin.canConnect(ipin)) {
                    this.activeSocket = null;
                    console.error("Cannot connect", ipin);
                    return;
                }

                if(!ipin.connect(opin) || !opin.connect(ipin)) {
                    this.activeSocket = null;
                    console.error("Connection failed");
                    return;
                }

                const p = new Link(ipin, opin);
                backGraphElem.append(p.bind())

                this.links[p.id] = p;

                ipin.addLine(p);
                opin.addLine(p);

                // this.activeSocket.parent.connectThisOutToIn(socket.parent);
                this.activeSocket = null;
                //this.activeLines[opin.pid] = { in: ipin.pid, line: line };

                // this.activeLines[socket.id] = g;
                // console.log(socket, this.activeSocket, this.activeLines);

                console.log(this.activeLines)

            }
        });
        dispatcher.bind("socketUpdate", (e, {id,x1,y1,x2,y2}) => {
            const line = this.links[id];
            if(line) {
                line.line.setAttributeNS(null, "x1", x1);
                line.line.setAttributeNS(null, "y1", y1);
                line.line.setAttributeNS(null, "x2", x2);
                line.line.setAttributeNS(null, "y2", y2);
            }
        });


        dispatcher.bind("createTempLine", (e, {id,x1,y1,x2,y2}) => {

            var line = createLine(x1, y1, x2, y2)
            topGraphElem.append(line);
            this.tempLines[id] = line;

        });
        dispatcher.bind("updateTempLine", (e, {id,x1,y1,x2,y2}) => {
            const line = this.tempLines[id];
            if(line) {
                line.setAttributeNS(null, "x1", x1);
                line.setAttributeNS(null, "y1", y1);
                line.setAttributeNS(null, "x2", x2);
                line.setAttributeNS(null, "y2", y2);
            }
        });
        dispatcher.bind("removeTempLine", (e, id) => {
            this.tempLines[id].remove();
            delete this.tempLines[id];
        });
        dispatcher.bind("socketDropFrom", (e, pin) => {
            console.log(pin)
        });

    }
    render() {
        return <>
            <div class="w-full h-full bg-zinc-200">
                <div id="backGraph"></div>
                <div>
                    <node args x="40" y="50" alias={ GBeginNode } value="0"></node>
                    <node args x="80" y="125" alias={ GTaskNode } value="1"></node>
                    <node args x="220" y="125" alias={ GTaskNode } value="2"></node>
                    <node args x="120" y="200" alias={ GEndNode } value="3"></node>
                </div>
                <div id="topGraph"></div>
            </div>
        </>
    }
}









export default Graph;