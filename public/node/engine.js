import { IObject } from "./object.js";
import { IGraph } from "./graph.js";
import { INode } from "./node.js";
import { Begin, Log, End } from "./nodes/flow.js";

class IEngine extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.IEngine",
        displayName: "Engine"
    }

    constructor({ uuid = crypto.randomUUID() } = {}) {

        super({ uuid });
        this.graphs = {};

    }

    /**
     * 
     * @param {IGraph} graphClass 
     * @param {string} graphUUID 
     * @returns {IGraph}
    */
    addGraph(graphClass, graphUUID) {

        const uuid = graphUUID || crypto.randomUUID();

        if(!graphClass) return null;
        if(this.getGraphByUUID(uuid)) return null;
        
        const graph = new graphClass({ uuid: uuid, outer: this });
        this.graphs[uuid] = graph;

        return graph;

    }

    /**
     * 
     * @param {string} graphUUID 
     * @returns {IGraph}
    */
    getGraphByUUID(graphUUID) {

        return this.graphs[graphUUID];

    }

    /**
     * 
     * @param {string} graphUUID 
     * @param {string} nodeUUID 
     * @returns 
    */
    executeGraph(graphUUID, nodeUUID) {

        const graph = this.getGraphByUUID(graphUUID);
        if(!graph) return null;
        
        graph.executeNode(nodeUUID);

    }
    /**
     * 
     * @returns {Object}
    */
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

    /**
     * 
     * @param {[Object]} graphs 
    */
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
                //const sourceNode = graph.getNodeByUUID(link.sourceNodeUUID);
                //const targetNode = graph.getNodeByUUID(link.targetNodeUUID);
                //graph.linkNodes(sourceNode, link.sourceSocketUUID, targetNode, link.targetSocketUUID);
                graph.linkNodesByUUID(link.sourceNodeUUID, link.sourceSocketUUID, link.targetNodeUUID, link.targetSocketUUID);
            }
    
            if(data.entryNodeUUID) {
                this.executeGraph(data.graphUUID, data.entryNodeUUID);
            };

        });
    }
    
}

// const engine = new IEngine();

// engine.addGraph(IGraph, "main");

// const graph = engine.getGraphByUUID("main");

// graph.addNode(Begin, "begin");
// graph.addNode(Log, "log");
// graph.addNode(End, "end");

// graph.linkNodesSocketsByUUID("begin", "out0", "log", "in0");
// graph.linkNodesSocketsByUUID("log", "out0", "end", "in0");

// engine.executeGraph("main", "begin");

export { IEngine };