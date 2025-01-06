import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { IEngine } from "../node/engine.js";
import { IGraph } from "../node/graph.js";
import { INode } from "../node/node.js";
import { UIGraph } from "./graph.js";

class UIEngine extends H12 {

    constructor() {
        super();
        this.iengine = null;
    }

    main() {

        this.iengine = new IEngine();

        this.createNodeList();

        console.dir(this, { depth: null });
        const data = [{"graphUUID":"a99f0a53-d373-4882-aa12-65e2b5f047ee","entryNodeUUID":"4726d941-1d2f-4d34-8790-c48c163d7fd7","nodes":{"4726d941-1d2f-4d34-8790-c48c163d7fd7":{"class":"Event|Begin","x":32.60000228881836,"y":87.76250457763672},"e4696c94-3a2f-4e2b-9690-3442869a17d9":{"class":"Event|Log","x":212.40000915527344,"y":89.56249237060547},"be9219f9-8764-484a-86bc-7962343a0d5b":{"class":"Event|End","x":374.8000183105469,"y":109.99999237060547},"7c8e434e-46b3-4552-be42-63f03d40bb84":{"class":"Event|Log","x":25.200000762939453,"y":148.20000457763672}},"links":[{"sourceNodeUUID":"4726d941-1d2f-4d34-8790-c48c163d7fd7","sourcePinUUID":"out0","targetNodeUUID":"e4696c94-3a2f-4e2b-9690-3442869a17d9","targetPinUUID":"in0","value":null},{"sourceNodeUUID":"e4696c94-3a2f-4e2b-9690-3442869a17d9","sourcePinUUID":"out0","targetNodeUUID":"be9219f9-8764-484a-86bc-7962343a0d5b","targetPinUUID":"in0","value":null},{"sourceNodeUUID":"7c8e434e-46b3-4552-be42-63f03d40bb84","sourcePinUUID":"out0","targetNodeUUID":"e4696c94-3a2f-4e2b-9690-3442869a17d9","targetPinUUID":"in0","value":null}]}];
        
        this.import(data);
        
    }

    render() {

        return <>
            <div class="w-full h-full">
                <div class="border-2 border-red-400 text-xs p-2">
                    <div class="space-x-1">
                        <button onclick={ this.export } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Export</button>
                        <button onclick={ this.execute } class="bg-blue-300 p-1 px-4 font-bold rounded-md">Execute</button>
                    </div>
                    <b>Nodes:</b>
                    <div class="space-x-1">
                        {nodelist}
                    </div>
                </div>
                <div class="w-[600px] h-96 border-4 border-blue-400 bg-blue-100">
                    {graphs}
                </div>
            </div>
        </>

    }

    createNodeList() {

        const { nodelist } = this.key;
        const nodes = IEngine.NODES;

        for(const node in nodes) {

            const nodeClass = IEngine.NODES[node];
            nodelist(<>
                <button onclick={ () => { this.child.graph.addUINode(nodeClass, null, 10, 10); } } class="bg-red-300 p-1 px-4 font-bold rounded-md">{ node }</button>
            </>, "x++");

        }

    }

    addUIGraph(graphClass, graphUUID) {

        const graph = this.iengine.addGraph(graphClass, graphUUID);
        if(!graph) return null;

        const { graphs } = this.key;
        graphs(<><graph id="graph" args alias={ UIGraph } iobject={ graph }></graph></>);

        return this.child.graph;

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
    
            const uiGraph = this.addUIGraph(IGraph, data.graphUUID);
            if(!uiGraph) return null;

            for(const nodeUUID in nodes) {
                const nodeClass = IEngine.NODES[nodes[nodeUUID].class];
                uiGraph.addUINode(nodeClass, nodeUUID, nodes[nodeUUID].x, nodes[nodeUUID].y);
            }

            for(const link of links) {

                const sourceNode = uiGraph.getUINode(link.sourceNodeUUID);
                const targetNode = uiGraph.getUINode(link.targetNodeUUID);
                
                const sourcePin = sourceNode.getUIPin(link.sourcePinUUID);
                const targetPin = targetNode.getUIPin(link.targetPinUUID);

                uiGraph.linkUINodes(sourceNode, sourcePin, targetNode, targetPin);

            }

        });

        console.warn("imported");

    }


}

export { UIEngine };