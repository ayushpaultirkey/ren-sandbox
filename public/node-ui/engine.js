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

        this.iengine = new IEngine();

        this.addGraph(IGraph);

        console.dir(this, { depth: null });

    }

    render() {

        return <>
            <div class="w-full h-full">
                <button onclick={ this.export }>Export</button>
                <div class="w-[600px] h-96 border-4 border-blue-400 bg-blue-100">
                    {graphs}
                </div>
            </div>
        </>

    }

    addGraph(graphClass, graphUUID) {

        const graph = this.iengine.addGraph(graphClass, graphUUID);
        if(!graph) return null;

        const { graphs } = this.key;
        graphs(<><graph args alias={ UIGraph } iobject={ graph }></graph></>);

    }

    export() {
        const graphs = this.iengine.export();
        console.log(graphs);
        console.log(JSON.stringify(graphs)); 
    }


}

export { UIEngine };