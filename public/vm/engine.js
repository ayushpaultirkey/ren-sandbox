import { IObject } from "./object.js";
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
    }

    get graphSets() {
        return this.#graphSets;
    }
    
    addGraphSet(uuid, data = { properties: {}, graphs: {}, custom: {} }) {
        try {

            const newUUID = uuid || crypto.randomUUID();
            if(this.#graphSets.has(newUUID)) {
                throw new Error(`Graph set "${newUUID}" already exists`);
            }

            const graphSet = new IGraphSet({
                uuid: newUUID,
                outer: this,
            });
            const success = graphSet.main({
                properties: data.properties || {},
                graphs: data.graphs || {}
            });
            if(!success) {
                throw new Error(`Graph set "${newUUID}" could not be created`);
            };

            this.#graphSets.set(newUUID, graphSet);

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