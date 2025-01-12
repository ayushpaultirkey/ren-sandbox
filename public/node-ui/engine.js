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

        this.data = [{"graphUUID":"ffe3bcbe-9acd-4d87-8243-c63c2a08105b","entryNodeUUID":"ab1ee8b6-11c5-476a-8abc-746da2af7a27","nodes":{"ab1ee8b6-11c5-476a-8abc-746da2af7a27":{"class":"INode.Event.Begin","x":22,"y":232},"7f3d3789-0760-41eb-87c9-09a51e91e041":{"class":"INode.Event.Log","x":159,"y":328},"8bcdd38b-65e2-4b17-a39c-005615764d83":{"class":"INode.Event.End","x":270,"y":151}},"links":[{"sourceNodeUUID":"ab1ee8b6-11c5-476a-8abc-746da2af7a27","sourceSocketUUID":"out0","targetNodeUUID":"7f3d3789-0760-41eb-87c9-09a51e91e041","targetSocketUUID":"in0","value":null},{"sourceNodeUUID":"7f3d3789-0760-41eb-87c9-09a51e91e041","sourceSocketUUID":"out0","targetNodeUUID":"8bcdd38b-65e2-4b17-a39c-005615764d83","targetSocketUUID":"in0","value":null}]}];

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
                        <button onclick={ this.zoomIn } class="bg-blue-300 p-1 px-4 font-bold rounded-md">+</button>
                        <button onclick={ this.zoomOut } class="bg-blue-300 p-1 px-4 font-bold rounded-md">-</button>
                        <button onclick={ this.recenter } class="bg-blue-300 p-1 px-4 font-bold rounded-md">R</button>
                    </div>
                    <div class="space-x-1">
                        {nodelist}
                    </div>
                </div>
                <div id="viewport" class="viewport w-[500px] h-[500px] relative overflow-hidden">
                    {graphs}
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
                uiGraph.addUINode(nodeClass, nodeUUID, nodes[nodeUUID].x, nodes[nodeUUID].y);
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