import H12 from "@library/h12.js";
import { Category } from "./nodelist.js";
import { UIPropertyManager } from "./property/manager.js";
import { getWorkplace } from "@script/library/workplace.js";


class Navigator extends H12 {

    /** @type {import("@vm/graphset").IGraphSet} */
    #igraphset = null;

    /** @type {import("@script/editor/project/workspace.js").Workspace} */
    #workspace = null;

    constructor() {
        super();
    }

    main(args) {

        this.#workspace = getWorkplace(this);

    }

    render() {

        return <>
            <div class="flex flex-row h-full">
                <div>
                    <button class="w-full border-2 border-zinc-900" onclick={ () => this.changeTab("tabNode") }>nodes</button>
                    <button class="w-full border-2 border-zinc-900" onclick={ () => this.changeTab("tabProperties") }>properties</button>
                    <button class="w-full border-2 border-zinc-900">stats</button>
                    <button class="w-full border-2 border-zinc-900">run</button>
                    <button class="w-full border-2 border-zinc-900" onclick={ () => this.parent.debug() }>debug</button>
                    <button class="w-full border-2 border-zinc-900" onclick={ () => this.parent.export() }>export</button>
                    <button class="w-full border-2 border-zinc-900" onclick={ () => this.parent.save() }>save</button>
                </div>
                <div id="tabs" class="navigator-container">
                    <div id="tabProperties" class="navigator-tab">

                        <div class="navigator-panel">
                            <label>Graphs Set</label>
                        </div>

                        <div class="seperator"></div>

                        <div class="navigator-panel">
                            <label>Graphs:</label>
                            <div class="flex flex-row">
                                <input class="primary-input w-full border-r-0 rounded-r-none" placeholder="Name" id="graphName" />
                                <button class="primary-btn rounded-l-none" onclick={ this.#addGraph }>Add</button>
                            </div>
                            <div class="space-y-1">
                                {graphs}
                            </div>
                        </div>

                        <div class="seperator"></div>

                        <div class="navigator-panel">
                            <label>Graphs Set Properties:</label>
                            <Property args alias={ UIPropertyManager } id="graphsetProperties"></Property>
                        </div>
                        
                    </div>
                    <div id="tabNode" class="flex-col hidden">
                        <label class="text-sm font-semibold border-b-2 border-zinc-500">Nodes:</label>
                        <Category args id="category" auto="true"></Category>
                    </div>
                </div>
            </div>
        </>;

    }

    changeTab(element) {

        const { tabs } = this.element;
        tabs.childNodes.forEach(tab => {
            tab.classList.add("hidden");
        });

        const target = this.element[element];
        if(target) {
            target.classList.remove("hidden");
        };

    }

    refreshGraphSet(igraphset) {

        if(this.#igraphset) {
            this.#igraphset.destroy();
        };

        this.#igraphset = igraphset;
        this.#igraphset.dispatcher.on("graphAdded", (graph) => this.#refreshGraphs());
        this.#igraphset.dispatcher.on("graphRemoved", (graph) => this.#refreshGraphs());

        this.child.graphsetProperties.refresh(this.#igraphset.propertyManager);

        this.#refreshGraphs();
        
    }

    #refreshGraphs() {
        
        const { graphs: uiGraphs } = this.key;
        uiGraphs("");

        const graphs = this.#igraphset.graphs;
        for(const [uuid, graph] of graphs) {
            uiGraphs(<>
                <div class="flex flex-row items-center bg-zinc-600 rounded-sm font-semibold select-none">
                    <label class="w-full text-xs p-1 pl-2" onclick={ () => this.#openGraph(uuid) }>{ graph.custom.name }</label>
                    <button class="primary-btn m-1" onclick={ () => this.#removeGraph(uuid) }>&times;</button>
                </div>
            </>, "x++");
        };

    }

    #openGraph(uuid) {
        if(this.#workspace) {
            this.#workspace.dispatcher.emit("openGraph", uuid);
        }
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

    destroy() {
        if(this.#workspace) {
            this.#workspace.dispatcher.clear("openGraph");
        };
        if(this.#igraphset) {
            this.#igraphset.dispatcher.clear("graphAdded");
            this.#igraphset.dispatcher.clear("graphRemoved");
        };
        super.destroy();
    }

}

export { Navigator };