import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { IGraph } from "../node/graph.js";
import { INode } from "../node/node.js";
import { UINode } from "./node.js";


class UIGraph extends H12 {
    constructor() {
        super();
        this.igraph = null;
    }
    main() {

        this.registerSVG();
        this.set("{nodes}", "");
        this.addNode(INode, "B1", 20, 20);
        this.addNode(INode, "B2", 140, 40);
        this.addNode(INode, "B3", 280, 80);

    }
    render() {

        this.igraph = new IGraph({ uuid: this.args.uuid, outer: this.args.outer });

        return <>
            <div class="w-full h-full overflow-auto scroll relative">
                <div>
                    {nodes}
                </div>
            </div>
        </>;

    }

    addNode(nodeClass, nodeUUID, x = 20, y = 20) {

        const node = this.igraph.addNode(nodeClass, nodeUUID);
        if(!node) return;

        this.set("{nodes}++", <><node args x={ x } y={ y } alias={ UINode } uuid={ node.getUUID() } outer={ this.igraph }></node></>);

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
            <svg width="512" height="256" id={ id } class="absolute select-none pointer-events-none"></svg>
        </>
    }
}

export { UIGraph };