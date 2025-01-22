import H12 from "@library/h12.js";
import { Category } from "./nodelist.js";
import { UIPropertyManager } from "./property/manager.js";
import { getWorkplace } from "@app/library/workplace.js";
import { Icon } from "../../../../control/icon.js";
import { mdiAbacus } from "@mdi/js";


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
            <div class="property-container border-l border-zinc-700">
                <div class="property">
                    <label class="mb-2">Graphs Properties:</label>
                    <div>
                        <property args alias={ UIPropertyManager } id="graphProperties"></property>
                    </div>
                </div>
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