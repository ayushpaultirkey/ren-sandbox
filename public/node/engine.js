import { IObject } from "./object.js";
import { IGraph } from "./graph.js";
import { Begin, End, Log } from "./nodes/flow.js";

const node_classes = {
    "Begin": Begin,
    "Log": Log,
    "End": End
}

class IEngine extends IObject {
    constructor({ uuid = crypto.randomUUID(), name = "IEngine" } = {}) {
        super({ uuid, name });
        this.graphs = {};
    }
    addGraph(graphClass, graphUUID) {

        const uuid = graphUUID || crypto.randomUUID();

        if(!graphClass) return null;
        if(this.graphs[uuid]) return null;

        const graph = new graphClass({ uuid: uuid, outer: this });
        this.graphs[uuid] = graph;

        return graph;

    }
    getGraphByUUID(graphUUID) {

        return this.graphs[graphUUID];

    }
    executeGraph(graphUUID, nodeUUID) {

        const graph = this.getGraphByUUID(graphUUID);
        if(!graph) return null;

        graph.execute(nodeUUID);

    }
    import(graphs = []) {
        graphs.forEach(data => {

            if(!data.graphUUID) return null;

            const nodes = data.nodes;
            const links = data.links;
    
            const graph = this.addGraph(IGraph, data.graphUUID);
            if(!graph) return null;
    
            for(const nodeUUID in nodes) {
                const nodeClass = node_classes[nodes[nodeUUID].class];
                graph.addNode(nodeClass, nodeUUID);
            }
    
            for(const link of links) {
                const sourceNode = graph.getNodeByUUID(link.sourceNodeUUID);
                const targetNode = graph.getNodeByUUID(link.targetNodeUUID);
                graph.linkNodes(sourceNode, link.sourcePinUUID, targetNode, link.targetPinUUID);
            }
    
            if(data.entryNodeUUID) {
                this.executeGraph(data.graphUUID, data.entryNodeUUID);
            };

        });
    }
}

// const test = [
//     {
//         graphUUID: 'ef2f2150-b9e4-47ce-aba1-19e15fc89864',
//         entryNodeUUID: 'Begin',
//         nodes: {
//             Begin: { class: 'Begin' },
//             Log: { class: 'Log' },
//             End: { class: 'End' }
//         },
//         links: [
//             {
//                 sourceNodeUUID: 'Begin',
//                 sourcePinUUID: 'out0',
//                 targetNodeUUID: 'Log',
//                 targetPinUUID: 'in0',
//                 value: null
//             },
//             {
//                 sourceNodeUUID: 'Log',
//                 sourcePinUUID: 'out0',
//                 targetNodeUUID: 'End',
//                 targetPinUUID: 'in0',
//                 value: null
//             }
//         ]
//     }
// ]


// const engine = new IEngine({ uuid: "engine1" });
// engine.import(test);

// console.log(engine.graphs);

export { IEngine };