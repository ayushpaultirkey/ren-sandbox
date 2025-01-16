import { IGraph } from "./graph.js";
import { IObject } from "./object.js";
import { IPropertyManager } from "./property/manager.js";

class IGraphSet extends IObject {

    /** @type {{ className: string, displayName: string }} */
    static meta = {
        className: "IObject.GraphSet",
        displayName: "Graph Set",
        description: "A collection of graphs"
    }

    /** @type {Map<string, IGraph>} */
    #graphs = new Map();

    /** @type {IPropertyManager} */
    #propertyManager = null;

    constructor({ uuid = crypto.randomUUID(), outer = null, name = null } = {}) {

        super({ uuid, outer, name });

        this.#propertyManager = new IPropertyManager({
            outer: this,
            properties: {}
        });

    }

    get graphs() {
        return this.#graphs;
    }
    get propertyManager() {
        return this.#propertyManager;
    }

    main({ properties = {}, graphs = {} } = {}) {
        try {

            this.#propertyManager.main(properties);
    
            for(const uuid in graphs) {
                const graph = graphs[uuid];
                this.addGraph(uuid, graph);
            }
            
            return true;

        }
        catch(error) {
            console.error(error);
        }
    }

    /**
        * 
        * @param {*} graphUUID 
        * @returns {IGraph}
    */
    getGraph(graphUUID) {
        try {
            if(!this.#graphs.has(graphUUID)) {
                throw new Error(`IGraphSet: Graph "${graphUUID}" does not exist`);
            }
            return this.#graphs.get(graphUUID);
        }
        catch(error) {
            console.error(error);
        }
    }

    addGraph(graphUUID, graphData = { name: null, nodes: {}, links: [], properties: {} }) {
        try {

            const uuid = graphUUID || crypto.randomUUID();

            if(!graphData) {
                throw new Error(`IGraphSet: Graph data is required`);
            }
            if(this.#graphs.has(uuid)) {
                throw new Error(`IGraphSet: Graph "${uuid}" already exists`);
            }

            const graph = new IGraph({ uuid: uuid, outer: this, name: graphData.name });
            graph.main({
                nodes: graphData.nodes,
                links: graphData.links,
                properties: graphData.properties,
            });
            this.#graphs.set(uuid, graph);

            return graph;
            
        }
        catch(error) {
            console.error(error);
        }
    }
    removeGraph(graphUUID) {
        return this.#graphs.delete(graphUUID);
    }


    /**
        * 
        * @returns {Object}
    */
    export() {

        const graphs = this.#graphs;
        const data = {};
        
        for(const [uuid, graph] of graphs) {

            const exportData = graph.export();
            if(!exportData) continue;

            data[uuid] = exportData;

        }

        return data;

    }

}

export { IGraphSet };