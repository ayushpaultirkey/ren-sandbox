import { PropertyTab } from "../../layout/property.js";

import { Category } from "../node/list.js";
import { GraphSetManager } from "../graphset/manager.js";
import { GraphManager } from "../graph/manager.js";

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

class GraphTab extends PropertyTab {
    constructor() {
        super();
        this.title = "Graph";
    }
    template() {
        return <>
            <GraphSet args alias={ GraphManager }></GraphSet>
        </>;
    }
}

export { NodeListTab, GraphSetTab, GraphTab };