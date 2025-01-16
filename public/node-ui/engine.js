import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { IEngine } from "../node/engine.js";
import { IGraphSet } from "../node/graphset.js";

class UIEngine extends H12 {

    /** @type {IEngine} */
    #iengine = null;

    /** @type {IGraphSet} */
    #igraphSet = null;

    constructor() {
        super();
    }
    main() {

        this.addIEngine();
        this.addIGraphSet();

    }
    render() {

        return <>
            <div class="w-full h-full flex flex-col overflow-hidden">
                <div class="text-xs border-4 space-y-2 border-red-500">
                    <div class="space-x-1">
                        <button onclick={ this.debug } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Debug</button>
                        <button onclick={ this.addIGraph } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Add Graph</button>
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
                            </div>
                        </div>
                        <div class="border-t-2 border-zinc-700">
                            {graphs}
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
                            {nodes}
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
            this.#iengine = new IEngine();
            const _graphSetRefresh = () => {
                const { engineUUID, engineName, engineSet } = this.key;
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
            this.#igraphSet = this.#iengine.addGraphSet(graphSetUUID, graphSetData);
            const _graphRefresh = () => {
                const { setUUID, setName, setGraph, setProps } = this.key;
                setUUID(this.#igraphSet.uuid);
                setName(this.#igraphSet.name || "no name");
                setGraph(this.#igraphSet.graphs.size);
                setProps(this.#igraphSet.propertyManager.properties.size);
            }
            _graphRefresh();
            this.#igraphSet.dispatcher.on("graphAdded", _graphRefresh);
            this.#igraphSet.dispatcher.on("graphRemoved", _graphRefresh);
            console.warn("Graph Set added");
        }
        catch(error) {
            console.error(error || "Error adding graph set");
        }
    }

    addIGraph() {
        try {
            if(!this.#igraphSet) {
                throw new Error(`Graph set not found`);
            }
            this.#igraphSet.addGraph();
            console.warn("Graph added");
        }
        catch(error) {
            console.error(error || "Error adding graph");
        }
    }

    debug() {
        console.log(this.#igraphSet);
    }
    destroy() {
        this.#iengine?.destroy();
        this.#igraphSet?.destroy();
        super.destroy();
    }

}

export { UIEngine };