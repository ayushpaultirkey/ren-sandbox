import H12 from "@library/h12.js";
import { Category } from "./nodelist.js";
import { UIPropertyManager } from "./property/manager.js";
import { getWorkplace } from "@script/library/workplace.js";


class GraphProperty extends H12 {

    /** @type {import("@script/editor/project/workspace.js").Workspace} */
    #workspace = null;

    constructor() {
        super();
    }

    main(args) {
        
    }

    render() {
        return <>
            <div>
                <div class="navigator-panel p-2">
                    <label>Graphs Properties:</label>
                    <property args alias={ UIPropertyManager } id="graphProperties"></property>
                </div>
                {
                    /* <div class="navigator-panel p-2">
                        <label>Input:</label>
                        <property args alias={ UIPropertyManager } id="inputProperties"></property>
                    </div>
                    <div class="navigator-panel p-2">
                        <label>Output:</label>
                        <property args alias={ UIPropertyManager } id="outputProperties"></property>
                    </div> */
                }
            </div>
        </>;
    }

    refresh(igraph) {
        
        if(!igraph) {
            console.error("No graph provided");
            return;
        };
        this.child.graphProperties.refresh(igraph.propertyManager);
        //this.child.inputProperties.refresh(igraph.inputs);
        //this.child.outputProperties.refresh(igraph.outputs);
        
    }

    destroy() {
        super.destroy();
    }

}

export { GraphProperty };