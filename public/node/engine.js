import { IObject } from "./object.js";

class IEngine extends IObject {
    constructor({ uuid, name }) {
        super({ uuid, name });
        this.graphs = {};
    }
    addGraph(graphClass, graphUUID) {

        const uuid = graphUUID || crypto.randomUUID();

        if(!graphClass) return null;
        if(this.graphs[uuid]) return null;

        const graph = new graphClass({ uuid: uuid , outer: this });
        this.graphs[uuid] = graph;

        return graph;

    }
    getGraphByUUID(graphUUID) {

        return this.graphs[graphUUID];

    }
    executeGraph(graphUUID) {

        const graph = this.getGraphByUUID(graphUUID);
        if(!graph) return null;

        graph.execute();

    }
}



export { IEngine };