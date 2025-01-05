import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { IEngine } from "../node/engine.js";
import { IGraph } from "../node/graph.js";
import { UIGraph } from "./graph.js";

class UIEngine extends H12 {
    constructor() {
        super();
        this.iengine = null;
    }
    main() {

        this.addGraph(IGraph);
        console.dir(this, { depth: null });

    }
    render() {

        this.iengine = new IEngine();
        
        return <>
            <div class="w-full h-full">
                {graph}
            </div>
        </>

    }
    addGraph(graphClass, graphUUID) {

        const { graph } = this.key;

        const newGraph = this.iengine.addGraph(graphClass, graphUUID);
        if(!newGraph) return null;

        graph(<><graph args alias={ UIGraph } uuid={ newGraph.getUUID() } outer={ this.iengine }></graph></>);

    }
}

export { UIEngine };