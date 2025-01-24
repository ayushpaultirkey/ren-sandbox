import { Icon } from "@script/app/control/icon.js";
import { PropertyTab } from "../../layout/property.js";
import { Category } from "../nodelist.js";
import { mdiPlus } from "@mdi/js";
import { GraphSetManager } from "../graphset/manager.js";

class NodeListTab extends PropertyTab {
    constructor() {
        super();
        this.title = "Node Lists";
    }
    template() {
        return <>
            <Category args id="category" auto="true"></Category>
        </>;
    }
}

class GraphSetTab extends PropertyTab {
    constructor() {
        super();
        this.title = "Graph Set";
    }
    template() {
        return <>
            <GraphSet args alias={ GraphSetManager }></GraphSet>
        </>;
    }
}

export { NodeListTab, GraphSetTab };