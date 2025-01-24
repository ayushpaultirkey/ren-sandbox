import H12 from "@library/h12.js";
import { UIPropertyManager } from "../../engine/property/manager.js";


class GraphManager extends H12 {

    /** @type {import("../../engine.js").UIEngine} */
    #workspace = null;
    
    #refreshGraphHandler = null;

    constructor() {
        super();
        this.#refreshGraphHandler = this.#refreshGraph.bind(this);
    }

    main(args) {

        const workspace = this.relay["workspace"];
        if(!workspace) {
            console.error("Invalid workspace");
            return;
        };
        
        this.#workspace = workspace;
        this.#workspace.dispatcher.on("graphOpened", this.#refreshGraphHandler);
        
    }

    #refreshGraph(igraph) {

        const { graphProperties } = this.child;
        graphProperties.refresh(igraph.propertyManager);

    }


    render() {
        return <>
            <div>

                <div class="property">
                    <label>Graphs Properties:</label>
                    <div>
                        <property args alias={ UIPropertyManager } id="graphProperties"></property>
                    </div>
                </div>
                
            </div>
        </>;
    }

    destroy() {

        if(this.#workspace) {
            this.#workspace.dispatcher.off("graphOpened", this.#refreshGraphHandler);
        };
        super.destroy();

    }

}

export { GraphManager };