import H12 from "@library/h12.js";
import { dispatcher } from "../editor/dispatcher.js";

import { IEngine } from "../node/engine.js";
import { IGraphSet } from "../node/graphset.js";
import { UIGraph } from "./graph.js";
import { Category } from "./category.js";
import { UIPropertyManager } from "./property/manager.js";
import VIEWPORT from "../editor/viewport.js";
import { UIGraphDetail } from "./graph/detail.js";


class UIEngine extends H12 {

    /** @type {IEngine} */
    #iengine = null;

    /** @type {IGraphSet} */
    #igraphset = null;

    constructor() {
        super();
    }
    main() {

        this.addEngine();

        const data = {"49be664a-083d-4611-9a81-46985591a0ee":{"graphs":{"eaecc936-1a9b-4b31-96b2-55410ed88ece":{"entry":"8401b511-f43a-426d-aa86-37e8cd595eb6","nodes":{"8401b511-f43a-426d-aa86-37e8cd595eb6":{"class":"INode.Event.Begin","properties":{},"custom":{"x":10,"y":20}},"e0bd2acd-36c0-4c1c-8242-c48c5211fb7e":{"class":"INode.Event.Log","properties":{},"custom":{"x":230,"y":20}},"bded529f-85e2-46be-b0ce-5a3f6760730d":{"class":"INode.Value.MakeFloat","properties":{"value0":{"name":"value","type":"FLOAT","value":123,"custom":{}}},"custom":{"x":10,"y":90}}},"links":[{"sourceNode":"8401b511-f43a-426d-aa86-37e8cd595eb6","sourceSocket":"out0","targetNode":"e0bd2acd-36c0-4c1c-8242-c48c5211fb7e","targetSocket":"in0"}],"properties":{"graph 1 age":{"name":"graph 1 age","type":"FLOAT","value":11,"custom":{}}},"custom":{"x":25,"y":54,"z":0.8999999999999999,"name":"why_main_function"}},"168eec37-e924-41d1-9468-1ce568072468":{"entry":"21e5c322-7cd2-448f-b6d5-955d82f7d9c4","nodes":{"21e5c322-7cd2-448f-b6d5-955d82f7d9c4":{"class":"INode.Event.Begin","properties":{},"custom":{"x":10,"y":120}},"eefb1fe4-63fa-42f5-9163-cafe355bc0ee":{"class":"INode.Event.Return","properties":{},"custom":{"x":160,"y":120}}},"links":[{"sourceNode":"21e5c322-7cd2-448f-b6d5-955d82f7d9c4","sourceSocket":"out0","targetNode":"eefb1fe4-63fa-42f5-9163-cafe355bc0ee","targetSocket":"in0"}],"properties":{},"custom":{"x":38,"y":42,"z":0.8499999999999999,"name":"bru_why_this"}}},"properties":{"age":{"name":"age","type":"FLOAT","value":23454,"custom":{}}},"name":null}};
        const key = "49be664a-083d-4611-9a81-46985591a0ee"
        this.addGraphSet(key, data[key]);

        // const data = {"0a9a062e-961f-4be7-9fbc-36fcadfac034":{"graphs":{},"properties":{"78ad2c61-c331-4442-8279-0a9712447f07":{"name":"zdg","type":"FLOAT","value":null,"custom":{}}},"custom":{"name":"Graph Set"}}};
        // const key = "0a9a062e-961f-4be7-9fbc-36fcadfac034";
        // this.addGraphSet(key, data[key]);

        const { graph: uiGraph } = this.key;
        uiGraph("No graph selected");

    }
    render() {

        return <>
            <div class="w-full h-full flex flex-col overflow-hidden">
                <div class="text-xs border-4 space-y-2 border-red-500">
                    <div class="space-x-1">
                        <button onclick={ this.export } class="bg-blue-300 p-1 px-4 font-semibold rounded-md">Export</button>
                        <button onclick={ this.debug } class="bg-blue-300 p-1 px-4 font-semibold rounded-md">Debug</button>
                        <button onclick={ this.addGraph } class="bg-blue-300 p-1 px-4 font-semibold rounded-md">Add Graph</button>
                    </div>
                    <div class="border-2 border-blue-500 space-y-1">
                        <select id="exec_graphSet" class="bg-red-300 p-1 px-4 font-semibold rounded-md"></select>
                        <select id="exec_graph" class="bg-red-300 p-1 px-4 font-semibold rounded-md"></select>
                        <br/>
                        <button onclick={ this.execute } class="bg-red-300 p-1 px-4 font-semibold rounded-md">Execute</button>
                        <button onclick={ this.refresh } class="bg-red-300 p-1 px-4 font-semibold rounded-md">Refresh</button>
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
                            <propertyManager args id="graphSetProperties" title="Graph Set Properties" alias={ UIPropertyManager }></propertyManager>
                        </div>
                        <div class="border-t-2 border-zinc-700">
                            <propertyManager args id="graphProperties" title="Graph Properties" alias={ UIPropertyManager }></propertyManager>
                        </div>
                    </div>
                    <div id="viewport" class="viewport w-full relative overflow-hidden">
                        {graph}
                    </div>
                    <div class="text-xs p-2 border-l-2 border-zinc-700 w-64 min-w-64 space-y-2 bg-zinc-800 overflow-auto">
                        <div>
                            <graphDetail args id="graphDetail" alias={ UIGraphDetail }></graphDetail>
                        </div>
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

    addEngine() {
        try {
            const { engineUUID, engineName, engineSet } = this.key;

            this.#iengine = new IEngine();
            const _refreshEngine = () => {
                engineUUID(this.#iengine.uuid);
                engineName(this.#iengine.name || "no name");
                engineSet(this.#iengine.graphSets.size);
            };
            _refreshEngine();

            this.#iengine.dispatcher.on("graphSetAdded", _refreshEngine);
            this.#iengine.dispatcher.on("graphSetRemoved", _refreshEngine);

            console.warn("IEngine added");
        }
        catch(error) {
            console.error(error || "Error adding IEngine");
        }
    }

    addGraphSet(graphSetUUID, graphSetData = { properties: {}, graphs: {} }) {
        try {
            const { graphs: uiGraphs, setUUID, setName, setGraph, setProps } = this.key;
            
            this.#igraphset = this.#iengine.addGraphSet(graphSetUUID, graphSetData);
            const _refreshGraphSet = (graph) => {

                setUUID(this.#igraphset.uuid);
                setName(this.#igraphset.custom.name || "no name");
                setGraph(this.#igraphset.graphs.size);
                setProps(this.#igraphset.propertyManager.properties.size);
                
                if(!graph) {
                    uiGraphs("");
                    const graphs = this.#igraphset.graphs;
                    for(const [uuid, graph] of graphs) {
                        uiGraphs(<>
                            <button onclick={ () => { this.openGraph(uuid) } }>{ graph.custom.name || "no name" }</button>
                        </>, "x++");
                    };
                }
                else {
                    uiGraphs(<>
                        <button onclick={ () => { this.openGraph(graph.uuid) } }>{ graph.custom.name || "no name" }</button>
                    </>, "x++");
                }

            }
            _refreshGraphSet();

            this.child.graphSetProperties.ipropertyManager = this.#igraphset.propertyManager;

            this.#igraphset.dispatcher.on("graphAdded", _refreshGraphSet);
            this.#igraphset.dispatcher.on("graphRemoved", _refreshGraphSet);
            this.#igraphset.dispatcher.on("graphCustomUpdated", _refreshGraphSet);

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

            this.child.graphProperties.ipropertyManager = graph.propertyManager;
            this.child.graphDetail.igraph = graph;

            const _refreshGraph = () => {
                this.set("{graphUUID}", graph.uuid);
                this.set("{graphNodes}", graph.nodes.size);
                this.set("{graphProps}", graph.propertyManager.properties.size);
            }
            graph.dispatcher.on("nodeAdded", _refreshGraph);
            _refreshGraph();

        }
        catch(error) {
            console.error(error || "Error adding graph");
        }
    }

    export() {

        const data = this.#igraphset.export();
        console.log(data);
        console.log(JSON.stringify(data))

    }
    debug() {
        console.log(this.#igraphset);
    }
    destroy() {
        this.#iengine?.destroy();
        this.#igraphset?.destroy();
        super.destroy();
    }

    execute() {

        const { exec_graphSet, exec_graph } = this.element;

        const graphSet = this.#iengine.getGraphSet(exec_graphSet.value);
        const graph = graphSet.graphs.get(exec_graph.value);
        const node = graph.getEntryNode();

        graph.executeNode(node.uuid);

    }
    refresh() {
        const { exec_graphSet, exec_graph } = this.element;

        const clearChild = (element) => {
            while(element.firstChild) {
                element.removeChild(element.lastChild);
            }
        }
        
        clearChild(exec_graphSet);
        clearChild(exec_graph);

        const graphSets = this.#iengine.graphSets;
        for(const [uuid, graphSet] of graphSets) {
            exec_graphSet.appendChild(<>
                <option value={ uuid }>{ graphSet.custom.name }</option>
            </>);
        }

        const graphs = this.#igraphset.graphs;
        for(const [uuid, graph] of graphs) {
            exec_graph.appendChild(<>
                <option value={ uuid }>{ graph.custom.name }</option>
            </>);
        }


    }

}

export { UIEngine };