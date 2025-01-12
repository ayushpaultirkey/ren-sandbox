class IObject {

    #uuid = null;
    #outer = null;
    #name = null;

    /** @type {{ className: string, displayName: string }} */
    static meta = {
        className: "IObject.IObject",
        displayName: "Object"
    };

    constructor({ uuid = crypto.randomUUID(), outer = null, name = null } = {}) {
        this.#uuid = uuid;
        this.#outer = outer;
        this.#name = name;
    }

    getUUID() {
        return this.#uuid;
    }
    getOuter() {
        return this.#outer;
    }
    getName() {
        return this.#name;
    }
    
    /**
     * 
     * @returns {IObject.meta}
    */
    getMeta() {
        return this.constructor.meta;
    }

    /**
     * 
     * @returns {IObject.meta}
    */
    static getMeta() {
        return this.meta;
    }
    
}

export { IObject };