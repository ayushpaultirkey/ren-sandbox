import H12 from "@library/h12.js";
import { dispatcher } from "./dispatcher.js";

import { IEngine } from "../node/engine.js";
import { IGraphSet } from "../node/graphset.js";
import { UIGraph } from "./graph.js";
import { Category } from "./category.js";
import VIEWPORT from "./viewport.js";


class UIEngine extends H12 {

    /** @type {IEngine} */
    #iengine = null;

    /** @type {IGraphSet} */
    #igraphset = null;

    constructor() {
        super();
    }
    main() {

        this.addIEngine();
        this.addIGraphSet();

        const { graph: uiGraph } = this.key;
        uiGraph("No graph selected");

    }
    render() {

        return <>
            <div class="w-full h-full flex flex-col overflow-hidden">
                <div class="text-xs border-4 space-y-2 border-red-500">
                    <div class="space-x-1">
                        <button onclick={ this.debug } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Debug</button>
                        <button onclick={ this.addGraph } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Add Graph</button>
                    </div>
                </div>
                <div class="flex flex-row w-full h-full">
                    <div class="p-2 border-r-2 border-zinc-700 w-64 min-w-64 space-y-2 bg-zinc-800 flex flex-col overflow-hidden text-zinc-400">
                        <div class="text-xs">
                            <div class="flex flex-col text-[10px]">
                                <label class="text-xs font-bold underline">Engine:</label>
                                <label><b>UUID:</b> {engineUUID}</label>
                                <label><b>Name:</b> {engineName}</label>
                                <label><b>Graph Sets:</b> {engineSet}</label>
                                <label class="text-xs font-bold mt-1 underline">Graph Set:</label>
                                <label><b>UUID:</b> {setUUID}</label>
                                <label><b>Name:</b> {setName}</label>
                                <label><b>Graphs:</b> {setGraph}</label>
                                <label><b>Properties:</b> {setProps}</label>
                                <label class="text-xs font-bold mt-1 underline">Graph:</label>
                                <label><b>UUID:</b> {graphUUID}</label>
                                <label><b>Nodes:</b> {graphNodes}</label>
                                <label><b>Properties:</b> {graphProps}</label>
                            </div>
                        </div>
                        <div class="border-t-2 border-zinc-700 flex flex-col">
                            <div>
                                <label>Graphs:</label>
                            </div>
                            <div class="text-[10px] flex flex-col">
                                {graphs}
                            </div>
                        </div>
                        <div class="border-t-2 border-zinc-700">
                            {properties}
                        </div>
                    </div>
                    <div id="viewport" class="viewport w-full relative overflow-hidden">
                        {graph}
                    </div>
                    <div class="text-xs p-2 border-l-2 border-zinc-700 w-64 min-w-64 space-y-2 bg-zinc-800 overflow-auto">
                        <div class="text-zinc-400">
                            <Category args auto={ true }></Category>
                        </div>
                    </div>
                </div>
            </div>
        </>

    }

    getViewport() {
        return this.element.viewport;
    }

    addIEngine() {
        try {
            const { engineUUID, engineName, engineSet } = this.key;

            this.#iengine = new IEngine();
            const _graphSetRefresh = () => {
                engineUUID(this.#iengine.uuid);
                engineName(this.#iengine.name || "no name");
                engineSet(this.#iengine.graphSets.size);
            };
            _graphSetRefresh();

            this.#iengine.dispatcher.on("graphSetAdded", _graphSetRefresh);
            this.#iengine.dispatcher.on("graphSetRemoved", _graphSetRefresh);

            console.warn("IEngine added");
        }
        catch(error) {
            console.error(error || "Error adding IEngine");
        }
    }

    addIGraphSet(graphSetUUID, graphSetData = { name: null, properties: {}, graphs: {} }) {
        try {
            const { graphs: uiGraphs, setUUID, setName, setGraph, setProps } = this.key;
            
            this.#igraphset = this.#iengine.addGraphSet(graphSetUUID, graphSetData);
            const _setRefresh = (graph) => {

                setUUID(this.#igraphset.uuid);
                setName(this.#igraphset.name || "no name");
                setGraph(this.#igraphset.graphs.size);
                setProps(this.#igraphset.propertyManager.properties.size);
                
                if(!graph) {
                    uiGraphs("");
                    const graphs = this.#igraphset.graphs;
                    for(const [uuid] of graphs) {
                        uiGraphs(<>
                            <button onclick={ () => { this.openGraph(uuid) } }>{ uuid }</button>
                        </>, "x++");
                    };
                }
                else {
                    uiGraphs(<>
                        <button onclick={ () => { this.openGraph(graph.uuid) } }>{ graph.uuid }</button>
                    </>, "x++");
                }

            }
            _setRefresh();

            this.#igraphset.dispatcher.on("graphAdded", _setRefresh);
            this.#igraphset.dispatcher.on("graphRemoved", _setRefresh);

            console.warn("Graph Set added");
        }
        catch(error) {
            console.error(error || "Error adding graph set");
        }
    }

    addGraph() {
        try {
            if(!this.#igraphset) {
                throw new Error("Graph set not found");
            }
            this.#igraphset.addGraph();
            console.warn("Graph added");
        }
        catch(error) {
            console.error(error || "Error adding graph");
        }
    }
    openGraph(graphUUID) {
        try {

            const { graph: uiGraph } = this.key;
            
            uiGraph("");
            VIEWPORT.zoom = 1;
            
            if(this.child.graph) {
                this.child.graph.destroy();
            }


            const graph = this.#igraphset.getGraph(graphUUID);
            if(!graph) {
                throw new Error(`Graph ${graphUUID} not found`);
            }

            uiGraph(<>
                <graph args alias={ UIGraph } iobject={ graph } id="graph"></graph>
            </>);

            this.set("{graphUUID}", graph.uuid);
            this.set("{graphNodes}", graph.nodes.size);
            this.set("{graphProps}", graph.propertyManager.properties.size);

            console.log(this.child);

        }
        catch(error) {
            console.error(error || "Error adding graph");
        }
    }

    debug() {
        console.log(this.#igraphset);
    }
    destroy() {
        this.#iengine?.destroy();
        this.#igraphset?.destroy();
        super.destroy();
    }

}

export { UIEngine };