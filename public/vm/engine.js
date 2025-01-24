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

export { IEngine };