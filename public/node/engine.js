import { IObject } from "./object.js";
import { IGraphSet } from "./graphset.js";
import { Begin } from "./nodes/flow.js"

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
    }

    get graphSets() {
        return this.#graphSets;
    }
    
    addGraphSet(graphSetUUID, graphSetData = { name: null, properties: {}, graphs: {} }) {
        try {

            const uuid = graphSetUUID || crypto.randomUUID();
            if(this.#graphSets.has(uuid)) {
                throw new Error(`Graph set "${uuid}" already exists`);
            }

            const graphSet = new IGraphSet({
                uuid: uuid,
                outer: this,
                name: graphSetData.name
            });
            const success = graphSet.main({
                properties: graphSetData.properties || {},
                graphs: graphSetData.graphs || {}
            });
            if(!success) {
                throw new Error(`Graph set "${uuid}" could not be created`);
            };

            this.#graphSets.set(uuid, graphSet);

            this.dispatcher.emit("graphSetAdded", graphSet);

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

    clearGraphSets() {
        this.#graphSets.clear();
    }

    destroy() {
        super.destroy();
    }

}


// let engine = new IEngine();
// engine.addGraphSet("main0", {
//     properties: {
//         age: { type: "INT", value: 23 }
//     },
//     graphs: {
//         init0: {
//             name: "init function",
//             properties: {
//                 name: { type: "STRING", value: "some name" }
//             },
//             nodes: {
//                 begin0: {
//                     class: "INode.Event.Begin",
//                     values: {}
//                 },
//                 log0: {
//                     class: "INode.Event.Log",
//                     values: {}
//                 }
//             },
//             links: [
//                 { sourceNode: "begin0", sourceSocket: "out0", targetNode: "log0", targetSocket: "in0" }
//             ]
//         }
//     }
// });

export { IEngine };