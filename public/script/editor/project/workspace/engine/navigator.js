import H12 from "@library/h12.js";
import { Category } from "./nodelist.js";
import { UIPropertyManager } from "./property/manager.js";
import { getWorkplace } from "@script/library/workplace.js";
import { mdiAbacus, mdiBug, mdiCardBulletedOutline, mdiContentSave, mdiPackageUp, mdiPlay, mdiPlus } from "@mdi/js";
import { Icon } from "../../../../../editor/control/icon.js";

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
                <div class="side-menu">

                    <button onclick={ () => this.changeTab("tabNode") } title="Node List">
                        <Icon args width="24px" height="24px" path={ mdiCardBulletedOutline }></Icon>
                    </button>
                    <button onclick={ () => this.changeTab("tabProperties") } title="Properties">
                        <Icon args width="24px" height="24px" path={ mdiAbacus }></Icon>
                    </button>
                    <button title="Run">
                        <Icon args width="24px" height="24px" path={ mdiPlay }></Icon>
                    </button>
                    <button nclick={ () => this.parent.debug() } title="Debug">
                        <Icon args width="24px" height="24px" path={ mdiBug }></Icon>
                    </button>
                    <button onclick={ () => this.parent.export() } title="Export">
                        <Icon args width="24px" height="24px" path={ mdiPackageUp }></Icon>
                    </button>
                    <button onclick={ () => this.parent.save() } title="Save">
                        <Icon args width="24px" height="24px" path={ mdiContentSave }></Icon>
                    </button>

                </div>
                <div id="tabs" class="property-container border-r border-zinc-700">
                    <div id="tabProperties" class="property-tab">

                        <div class="property text-2xl">
                            <label class="!text-sm !font-normal">Graphs Set</label>
                        </div>

                        <div class="seperator"></div>

                        <div class="property">
                            <label>Graphs:</label>
                            <div>
                                <div class="flex flex-row space-x-1">
                                    <input class="primary-input w-full" placeholder="Name" id="graphName" />
                                    <button class="primary-btn" onclick={ this.#addGraph }>
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
                                <Property args alias={ UIPropertyManager } id="graphsetProperties"></Property>
                            </div>
                        </div>
                        
                    </div>
                    <div id="tabNode" class="property-tab hidden">

                        <div class="property text-2xl">
                            <label class="!text-sm !font-normal">Nodes:</label>
                        </div>

                        <div class="seperator"></div>

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