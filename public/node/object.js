class IObject {

    /** @type {string} */
    #uuid = null;

    /** @type {IObject} */
    #outer = null;

    /** @type {string} */
    #name = null;
    
    /** @type {{ className: string, displayName: string }} */
    static meta = {
        className: "IObject.IObject",
        displayName: "Object",
        description: "Object"
    };

    constructor({ uuid = crypto.randomUUID(), outer = null, name = null } = {}) {
        this.#uuid = uuid;
        this.#outer = outer;
        this.#name = name;
    }

    main() {}

    get uuid() {
        return this.#uuid;
    }
    get name() {
        return this.#name;
    }
    get outer() {
        return this.#outer;
    }

    /**
        * @returns {IObject.meta}
    */
    getMeta() {
        return this.constructor.meta;
    }

    /**
        * @returns {IObject.meta}
    */
    static getMeta() {
        return this.meta;
    }
    
}

export { IObject };