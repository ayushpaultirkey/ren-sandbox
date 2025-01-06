import { IObject } from "./object.js";
import { IGraph } from "./graph.js";
import { Begin, End, Log } from "./nodes/flow.js";

class IEngine extends IObject {

    constructor({ uuid = crypto.randomUUID(), name = "IEngine", classId = "NDE|IEngine"} = {}) {
        super({ uuid, name, classId });
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
    export() {

        const graphs = [];
        
        for(const graphUUID in this.graphs) {
            const graph = this.graphs[graphUUID];
            const data = graph.export();
            if(!data) continue;
            graphs.push(data);
        }

        return graphs;

    }
    import(graphs = []) {
        graphs.forEach(data => {

            if(!data.graphUUID) return null;

            const nodes = data.nodes;
            const links = data.links;
    
            const graph = this.addGraph(IGraph, data.graphUUID);
            if(!graph) return null;
    
            for(const nodeUUID in nodes) {
                const nodeClass = IEngine.NODES[nodes[nodeUUID].class];
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

    static NODES = {
        "Event|Begin": Begin,
        "Event|Log": Log,
        "Event|End": End,
    };

}

export { IEngine };