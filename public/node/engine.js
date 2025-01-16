import { IObject } from "./object.js";
import { IGraph } from "./graph.js";
import { INode } from "./node.js";
import { Begin, Log, End } from "./nodes/flow.js";
import { IGraphSet } from "./graphset.js";

class IEngine extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.IEngine",
        displayName: "Engine"
    }

    /** @type {Map<string, IGraphSet>} */
    #graphSets = new Map();

    constructor({ uuid = crypto.randomUUID() } = {}) {

        super({ uuid });
        this.graphs = {};

    }

    addGraph(graphClass, graphUUID) {

        const uuid = graphUUID || crypto.randomUUID();

        if(!graphClass) return null;
        if(this.getGraphByUUID(uuid)) return null;
        
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
        
        graph.executeNode(nodeUUID);

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

    get graphSets() {
        return this.#graphSets;
    }
    
    addGraphSet(graphSetUUID, graphSetData = { name: null, properties: {}, graphs: {} }) {
        try {

            const uuid = graphSetUUID || crypto.randomUUID();
            if(this.#graphSets.has(uuid)) {
                console.error(`Graph set "${uuid}" already exists`);
                return null;
            }

            const graphSet = new IGraphSet({ uuid: uuid, outer: this, name: graphSetData.name });
            const success = graphSet.main({
                properties: graphSetData.properties,
                graphs: graphSetData.graphs
            });
            if(!success) {
                throw new Error(`Graph set "${uuid}" could not be created`);
            };

            this.#graphSets.set(uuid, graphSet);

            return graphSet;

        }
        catch(error) {
            console.error(error);
        }
    }
    /**
        * 
        * @param {*} graphSetUUID 
        * @returns {IGraphSet}
    */
    getGraphSet(graphSetUUID) {
        return this.#graphSets.get(graphSetUUID);
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

let engine = new IEngine();
engine.addGraphSet("main0", {
    properties: {
        age: { type: "INT", value: 23 }
    },
    graphs: {
        init0: {
            name: "init function",
            properties: {
                name: { type: "STRING", value: "some name" }
            },
            nodes: {
                begin0: {
                    class: "INode.Event.Begin",
                    properties: {}
                },
                log0: {
                    class: "INode.Event.Log",
                    properties: {}
                }
            },
            links: [
                { sourceNode: "begin0", sourceSocket: "out0", targetNode: "log0", targetSocket: "in0" }
            ]
        }
    }
});
debugger;

export { IEngine };