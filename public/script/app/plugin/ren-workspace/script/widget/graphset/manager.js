import H12 from "@library/h12.js";
import { mdiClose, mdiPlus } from "@mdi/js";
import { Icon } from "@script/app/control/icon.js";
import { UIPropertyManager } from "../../engine/property/manager.js";
import { copyHighlight } from "@script/app/library/utility.js";

class GraphSetManager extends H12 {

    /** @type {import("../../engine.js").UIEngine} */
    #workspace = null;
    
    /** @type {import("@vm/graphset.js").IGraphSet} */
    #igraphset = null;

    #refreshGraphHandler = null;
    #refreshGraphSetHandler = null;

    constructor() {
        super();
        this.#refreshGraphHandler = this.#refreshGraph.bind(this);
        this.#refreshGraphSetHandler = this.#refreshGraphSet.bind(this);
    }
    main() {

        this.set("{graphs}", "");
        this.load();

    }
    render() {
        return <>
            <div class="select-none">

                <div class="property">
                    <label>Graphs:</label>
                    <div>
                        <div class="flex flex-row space-x-1">
                            <input class="primary-input w-full" placeholder="Name" id="graphName" />
                            <button class="primary-btn" aria-label="Add Graph" onclick={ this.#addGraph }>
                                <Icon args path={ mdiPlus }></Icon>
                            </button>
                        </div>
                        <div class="space-y-1">
                            {graphs}
                        </div>
                    </div>
                </div>

                <div class="seperator"></div>

                <div class="property">
                    <label>Graphs Set Properties:</label>
                    <div>
                        <manager args alias={ UIPropertyManager } id="propertyManager"></manager>
                    </div>
                </div>

            </div>
        </>
    }

    load() {

        const workspace = this.relay["workspace"];
        if(!workspace) {
            console.error("Invalid workspace");
            return;
        };

        this.#workspace = workspace;
        this.#workspace.dispatcher.on("graphSetLoaded", this.#refreshGraphSetHandler);
        
    }

    #refreshGraphSet(igraphset) {

        if(this.#igraphset) {
            this.#igraphset.destroy();
        };

        this.#igraphset = igraphset;
        this.#igraphset.dispatcher.on("graphAdded", this.#refreshGraphHandler);
        this.#igraphset.dispatcher.on("graphRemoved", this.#refreshGraphHandler);

        const { propertyManager } = this.child;
        propertyManager.refresh(igraphset.propertyManager);

        this.#refreshGraph();
        
    }

    #refreshGraph() {
        
        const { graphs: uiGraphs } = this.key;
        uiGraphs("");

        const graphs = this.#igraphset.graphs;
        for(const [uuid, graph] of graphs) {
            uiGraphs(<>
                <div class="primary-input bg-opacity-50 flex flex-row items-center pr-1" onclick={ () => this.#openGraph(uuid) } ondblclick={ (e) => { e.stopPropagation(); e.preventDefault(); navigator.clipboard.writeText(uuid); copyHighlight(e.target); } }>
                    <label class="w-full text-xs font-semibold">{ graph.custom.name }</label>
                    <button class="primary-btn" onclick={ (e) => { e.stopPropagation(); this.#removeGraph(uuid); } } aria-label="Remove Graph">
                        <Icon args width="12px" height="12px" path={ mdiClose }></Icon>
                    </button>
                </div>
            </>, "x++");
        };

    }

    #openGraph(uuid) {
        if(this.#workspace) {
            this.#workspace.dispatcher.emit("openGraph", uuid);
        };
    }

    #addGraph() {
        
        const { graphName } = this.element;
        if(!graphName || !graphName.value) {
            alert("Please enter a name for the graph");
            return;
        };

        const name = graphName.value || "untitled";
        const uuid = name;

        this.#igraphset.addGraph(uuid, {
            custom: {
                name: name
            },
        });

        graphName.value = "";
        console.warn("Graph added");

    }

    #removeGraph(uuid) {

        this.#igraphset.removeGraph(uuid);
        console.warn("Graph removed");

    }

    destroy() {
        if(!this.#igraphset) {
            this.#igraphset.dispatcher.off("graphAdded", this.#refreshGraphHandler);
            this.#igraphset.dispatcher.off("graphRemoved", this.#refreshGraphHandler);
        };
        if(!this.#workspace) {
            this.#workspace.dispatcher.off("graphSetLoaded", this.#refreshGraphSetHandler);
        };
        super.destroy();
    }

}

export { GraphSetManager };