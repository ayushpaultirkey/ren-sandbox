import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { IEngine } from "../node/engine.js";
import { IGraph } from "../node/graph.js";
import { INode, NODES_REGISTRY } from "../node/node.js";
import { UIGraph } from "./graph.js";
import VIEWPORT from "./viewport.js";

class UIEngine extends H12 {

    constructor() {
        super();
        this.iengine = null;
    }

    main() {

        this.createIEngine();
        //this.createUIGraph(IGraph, null);
        this.createNodeList();

        this.data = [{"graphUUID":"ffe3bcbe-9acd-4d87-8243-c63c2a08105b","entryNodeUUID":"ab1ee8b6-11c5-476a-8abc-746da2af7a27","nodes":{"ab1ee8b6-11c5-476a-8abc-746da2af7a27":{"class":"INode.Event.Begin","x":43.20000076293945,"y":83.19999694824219,"value":{}},"7f3d3789-0760-41eb-87c9-09a51e91e041":{"class":"INode.Event.Log","x":283.20001220703125,"y":83.19999694824219,"value":{}},"8bcdd38b-65e2-4b17-a39c-005615764d83":{"class":"INode.Event.End","x":433.20001220703125,"y":83.19999694824219,"value":{}},"21eb6820-3eee-4c56-a87e-43f25238d9af":{"class":"INode.Event.MathN","x":163.1999969482422,"y":183.1999969482422,"value":{}},"c4433099-26b7-44a7-b38a-4d1bdcf52bea":{"class":"INode.Event.Value","x":43.20000076293945,"y":233.20001220703125,"value":{"data0":2}},"92e8d87b-6664-455c-a57a-3e6b58c16aca":{"class":"INode.Event.Value","x":43.20000076293945,"y":153.1999969482422,"value":{"data0":"60"}},"2f5ca3b9-8736-4745-a0f2-0344fff4bcb1":{"class":"INode.Event.MathN","x":281.6000061035156,"y":211.60000610351562,"value":{}},"881aff4d-fa5a-48ec-b51b-19e735708c2d":{"class":"INode.Event.Value","x":161.60000610351562,"y":281.6000061035156,"value":{"data0":0}}},"links":[{"sourceNodeUUID":"ab1ee8b6-11c5-476a-8abc-746da2af7a27","sourceSocketUUID":"out0","targetNodeUUID":"7f3d3789-0760-41eb-87c9-09a51e91e041","targetSocketUUID":"in0"},{"sourceNodeUUID":"7f3d3789-0760-41eb-87c9-09a51e91e041","sourceSocketUUID":"out0","targetNodeUUID":"8bcdd38b-65e2-4b17-a39c-005615764d83","targetSocketUUID":"in0"},{"sourceNodeUUID":"21eb6820-3eee-4c56-a87e-43f25238d9af","sourceSocketUUID":"value3","targetNodeUUID":"2f5ca3b9-8736-4745-a0f2-0344fff4bcb1","targetSocketUUID":"value1"},{"sourceNodeUUID":"c4433099-26b7-44a7-b38a-4d1bdcf52bea","sourceSocketUUID":"value0","targetNodeUUID":"21eb6820-3eee-4c56-a87e-43f25238d9af","targetSocketUUID":"value2"},{"sourceNodeUUID":"c4433099-26b7-44a7-b38a-4d1bdcf52bea","sourceSocketUUID":"value0","targetNodeUUID":"2f5ca3b9-8736-4745-a0f2-0344fff4bcb1","targetSocketUUID":"value2"},{"sourceNodeUUID":"92e8d87b-6664-455c-a57a-3e6b58c16aca","sourceSocketUUID":"value0","targetNodeUUID":"21eb6820-3eee-4c56-a87e-43f25238d9af","targetSocketUUID":"value1"},{"sourceNodeUUID":"2f5ca3b9-8736-4745-a0f2-0344fff4bcb1","sourceSocketUUID":"value3","targetNodeUUID":"7f3d3789-0760-41eb-87c9-09a51e91e041","targetSocketUUID":"value1"}]}];

        this.import(this.data);
        
    }

    zoomIn() {
        this.child.graph.zoomIn();
    }
    zoomOut() {
        this.child.graph.zoomOut();
    }
    recenter() {
        this.child.graph.recenter();
    }

    render() {

        return <>
            <div>
                <div class="text-xs border-4 space-y-2 border-red-500">
                    <div class="space-x-1">
                        <button onclick={ this.export } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Export</button>
                        <button onclick={ this.execute } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Execute</button>
                        <button onclick={ this.debug } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Debug</button>
                        <button onclick={ this.zoomIn } class="bg-blue-300 p-1 px-4 font-bold rounded-md">+</button>
                        <button onclick={ this.zoomOut } class="bg-blue-300 p-1 px-4 font-bold rounded-md">-</button>
                        <button onclick={ this.recenter } class="bg-blue-300 p-1 px-4 font-bold rounded-md">R</button>
                    </div>
                    <div class="space-x-1">
                        {nodelist}
                    </div>
                </div>
                <div id="viewport" class="viewport w-[650px] h-[500px] relative overflow-hidden">
                    {graphs}
                </div>
                <div class="text-xs p-2 border-4 space-y-2 border-red-500">
                    <div class="space-x-2">
                       <b>Properties:</b>
                        <button class="bg-violet-300 p-1 px-4 font-bold rounded-md">Add</button>
                    </div>
                    <div class="flex space-x-2">
                        <label>Name:</label>
                        <input type="text" class="bg-zinc-300" />
                    </div>
                </div>
            </div>
        </>

    }


    createIEngine() {
        this.iengine = new IEngine();
    }
    
    createUIGraph(graphClass, graphUUID) {

        const graph = this.iengine.addGraph(graphClass, graphUUID);
        if(!graph) return null;

        const { graphs } = this.key;
        graphs(<><graph id="graph" args alias={ UIGraph } iobject={ graph }></graph></>);

        return this.child.graph;

    }


    createNodeList() {

        const { nodelist } = this.key;
        const nodes = NODES_REGISTRY.getAll();

        for(const node in nodes) {
            const nodeClass = nodes[node];
            const displayName = nodeClass.meta.displayName;
            nodelist(<>
                <button onclick={ () => { this.child.graph.addUINode(nodeClass, null, 10, 10); } } class="bg-red-300 p-1 px-4 font-bold rounded-md">{ displayName }</button>
            </>, "x++");
        }

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
            const uiGraph = this.createUIGraph(IGraph, data.graphUUID);

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