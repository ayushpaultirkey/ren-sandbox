import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { IEngine } from "../node/engine.js";
import { IGraph } from "../node/graph.js";
import { INode, NODES_REGISTRY } from "../node/node.js";
import { UIGraph } from "./graph.js";
import VIEWPORT from "./viewport.js";
import { Category } from "./menu.js";

class UIEngine extends H12 {

    constructor() {
        super();
        this.iengine = null;
        this.menuCreated = false;
        this.menu = {};
    }

    main() {

        this.createIEngine();
        //this.createUIGraph(IGraph, null);
        this.createNodeList();

        this.data = [{"graphUUID":"ffe3bcbe-9acd-4d87-8243-c63c2a08105b","entryNodeUUID":"ab1ee8b6-11c5-476a-8abc-746da2af7a27","nodes":{"ab1ee8b6-11c5-476a-8abc-746da2af7a27":{"class":"INode.Event.Begin","x":14,"y":32,"value":{}},"7f3d3789-0760-41eb-87c9-09a51e91e041":{"class":"INode.Event.Log","x":375,"y":32,"value":{}},"8bcdd38b-65e2-4b17-a39c-005615764d83":{"class":"INode.Event.End","x":537,"y":32,"value":{}},"92e8d87b-6664-455c-a57a-3e6b58c16aca":{"class":"INode.Event.Value","x":14,"y":140,"value":{"data0":"34"}},"772d78b9-1258-42ff-8b39-1b83c86728c6":{"class":"INode.Event.MakeObject","x":122,"y":140,"value":{"data0":"age"}},"c2972b81-fe5d-4d35-938d-e9fe9f63aa62":{"class":"INode.Event.BreakObject","x":122,"y":222,"value":{"key0":"age"}},"af267afc-45eb-417d-b4b1-43d97af959d5":{"class":"INode.Cast.WildcardToString","x":498,"y":222,"value":{}},"1f836934-961e-468f-8886-a7a20aae0125":{"class":"INode.Event.MathN","x":384,"y":222,"value":{}},"39ddf1b4-52d8-4abb-9b0c-c5871cdc8067":{"class":"INode.Cast.WildcardToFloat","x":240,"y":222,"value":{}},"407b420f-3543-4b02-8852-1d7e537936ab":{"class":"INode.Event.Value","x":241,"y":279,"value":{"data0":"5"}}},"links":[{"sourceNodeUUID":"ab1ee8b6-11c5-476a-8abc-746da2af7a27","sourceSocketUUID":"out0","targetNodeUUID":"7f3d3789-0760-41eb-87c9-09a51e91e041","targetSocketUUID":"in0"},{"sourceNodeUUID":"7f3d3789-0760-41eb-87c9-09a51e91e041","sourceSocketUUID":"out0","targetNodeUUID":"8bcdd38b-65e2-4b17-a39c-005615764d83","targetSocketUUID":"in0"},{"sourceNodeUUID":"92e8d87b-6664-455c-a57a-3e6b58c16aca","sourceSocketUUID":"value0","targetNodeUUID":"772d78b9-1258-42ff-8b39-1b83c86728c6","targetSocketUUID":"wildcard0"},{"sourceNodeUUID":"772d78b9-1258-42ff-8b39-1b83c86728c6","sourceSocketUUID":"object0","targetNodeUUID":"c2972b81-fe5d-4d35-938d-e9fe9f63aa62","targetSocketUUID":"object0"},{"sourceNodeUUID":"c2972b81-fe5d-4d35-938d-e9fe9f63aa62","sourceSocketUUID":"wildcard0","targetNodeUUID":"39ddf1b4-52d8-4abb-9b0c-c5871cdc8067","targetSocketUUID":"wildcard0"},{"sourceNodeUUID":"af267afc-45eb-417d-b4b1-43d97af959d5","sourceSocketUUID":"string0","targetNodeUUID":"7f3d3789-0760-41eb-87c9-09a51e91e041","targetSocketUUID":"value1"},{"sourceNodeUUID":"1f836934-961e-468f-8886-a7a20aae0125","sourceSocketUUID":"value3","targetNodeUUID":"af267afc-45eb-417d-b4b1-43d97af959d5","targetSocketUUID":"wildcard0"},{"sourceNodeUUID":"39ddf1b4-52d8-4abb-9b0c-c5871cdc8067","sourceSocketUUID":"float0","targetNodeUUID":"1f836934-961e-468f-8886-a7a20aae0125","targetSocketUUID":"value1"},{"sourceNodeUUID":"407b420f-3543-4b02-8852-1d7e537936ab","sourceSocketUUID":"value0","targetNodeUUID":"1f836934-961e-468f-8886-a7a20aae0125","targetSocketUUID":"value2"}],"position":{"x":0,"y":0,"zoom":1}}];

        this.import(this.data);
        
    }

    recenter() {
        this.child.graph.recenter();
    }

    render() {

        return <>
            <div class="w-full h-full flex flex-col overflow-hidden">
                <div class="text-xs border-4 space-y-2 border-red-500">
                    <div class="space-x-1">
                        <button onclick={ this.export } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Export</button>
                        <button onclick={ this.execute } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Execute</button>
                        <button onclick={ this.debug } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Debug</button>
                        <button onclick={ this.recenter } class="bg-blue-300 p-1 px-4 font-bold rounded-md">R</button>
                    </div>
                </div>
                <div class="flex flex-row w-full h-full">
                    <div id="viewport" class="viewport w-full relative overflow-hidden">
                        {graphs}
                    </div>
                    <div class="text-xs p-2 border-l-2 border-zinc-700 w-64 min-w-64 space-y-2 bg-zinc-800 overflow-auto">
                        <div class="text-zinc-400">
                            <category args autocreate={ true } alias={ Category }></category>
                        </div>
                    </div>
                </div>
            </div>
        </>

    }

    getViewport() {
        return this.element.viewport;
    }

    createIEngine() {
        this.iengine = new IEngine();
    }
    
    createUIGraph(graphClass, graphUUID, graphPosition) {

        const graph = this.iengine.addGraph(graphClass, graphUUID);
        if(!graph) return null;


        const { graphs } = this.key;
        graphs(<><graph id="graph" args alias={ UIGraph } iobject={ graph } ui={ graphPosition }></graph></>);

        return this.child.graph;

    }


    createNodeList() {
        dispatcher.bind("onNodeAdd", (e, node) => {
            this.child.graph.addUINode(node, null, 10, 10);
        });
    }

    debug() {
        console.log(this.iengine);
    }
    export() {
        const graphs = this.iengine.export();
        console.log(graphs);
        console.log(JSON.stringify(graphs)); 
    }
    execute() {
        const { graph } = this.child;
        const uuid = graph.getIGraphUUID();
        const node = graph.getIGraphEntryNode();
        if(!uuid || !node) {
            console.error("Invalid graph");
            return;
        }
        this.iengine.executeGraph(uuid, node.getUUID());
    }
    import(graphs = []) {
        graphs.forEach(data => {
            
            if(!data.graphUUID) return null;

            const nodes = data.nodes;
            const links = data.links;
            const uiGraph = this.createUIGraph(IGraph, data.graphUUID, data.position);

            if(!uiGraph) return null;
            for(const nodeUUID in nodes) {
                const nodeClass = NODES_REGISTRY.get(nodes[nodeUUID].class);
                const nodeValue = nodes[nodeUUID].value;
                uiGraph.addUINode(nodeClass, nodeUUID, nodeValue, nodes[nodeUUID].x, nodes[nodeUUID].y);
            }

            queueMicrotask(() => {
                for(const link of links) {
                    const sourceNode = uiGraph.getUINode(link.sourceNodeUUID);
                    const targetNode = uiGraph.getUINode(link.targetNodeUUID);
                    const sourceSocket = sourceNode.getUISocket(link.sourceSocketUUID);
                    const targetSocket = targetNode.getUISocket(link.targetSocketUUID);
                    uiGraph.linkUINodes(sourceNode, sourceSocket, targetNode, targetSocket);
                }
            });

        });
        console.warn("imported");
    }


}

export { UIEngine };