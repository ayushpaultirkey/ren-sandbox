import H12 from "@library/h12.js";
import { mdiClose, mdiPlus } from "@mdi/js";
import { Icon } from "@script/app/control/icon.js";
import { UIPropertyManager } from "../property/manager.js";

class GraphSetManager extends H12 {
    constructor() {
        super();
    }
    main() {

        this.set("{graphs}", "");
        this.load();

    }
    render() {
        return <>
            <div>

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

    #igraphset = null;
    load() {

        const workspace = this.relay["workspace"];
        if(!workspace) {
            console.error("Invalid workspace");
            return;
        };

        workspace.dispatcher.on("graphSetLoaded", (igraphset) => {

            this.refreshGraphSet(igraphset);

        });
        
    }

    refreshGraphSet(igraphset) {

        if(this.#igraphset) {
            this.#igraphset.destroy();
        };

        this.#igraphset = igraphset;
        this.#igraphset.dispatcher.on("graphAdded", (graph) => this.#refreshGraphs());
        this.#igraphset.dispatcher.on("graphRemoved", (graph) => this.#refreshGraphs());

        const { propertyManager } = this.child;
        propertyManager.refresh(igraphset.propertyManager);

        this.#refreshGraphs();
        
    }

    #openGraph(uuid) {
        // if(this.#workspace) {
        //     this.#workspace.dispatcher.emit("openGraph", uuid);
        // }
    }

    #refreshGraphs(igraphset) {
        
        const { graphs: uiGraphs } = this.key;
        uiGraphs("");

        const graphs = this.#igraphset.graphs;
        for(const [uuid, graph] of graphs) {
            uiGraphs(<>
                <div class="primary-input bg-opacity-50 flex flex-row items-center pr-1" onclick={ () => this.#openGraph(uuid) }>
                    <label class="w-full text-xs font-semibold">{ graph.custom.name }</label>
                    <button class="primary-btn" onclick={ (e) => {
                        e.stopPropagation();
                        this.#removeGraph(uuid);
                    } } aria-label="Remove Graph">
                        <Icon args width="12px" height="12px" path={ mdiClose }></Icon>
                    </button>
                </div>
            </>, "x++");
        };

    }

    #addGraph() {
        
        const { graphName } = this.element;
        if(!graphName || !graphName.value) {
            alert("Please enter a name for the graph");
            return;
        };

        this.#igraphset.addGraph(null, {
            nodes: {},
            links: [],
            properties: {},
            custom: {
                name: graphName.value || "no name"
            },
            inputs: {},
            outputs: {}
        });
        graphName.value = "";
        console.warn("Graph added");

    }

    #removeGraph(uuid) {

        this.#igraphset.removeGraph(uuid);
        console.warn("Graph removed");

    }

}

export { GraphSetManager };