import { Dispatcher } from "./dispatcher.js";

class IObject {

    /** @type {string} */
    #uuid = null;
    get uuid() {
        return this.#uuid;
    }

    /** @type {IObject} */
    #outer = null;
    get outer() {
        return this.#outer;
    }

    /** @type {string} */
    #name = null;
    get name() {
        return this.#name;
    }

    /** @type {Object} */
    #signature = null;
    get signature() {
        return this.#signature;
    }
    set signature(value) {
        if(!this.#signature) {
            this.#signature = value;
        }
        else {
            console.error("Cannot set signature once set");
        };
    }

    /** @type {Dispatcher} */
    #dispatcher = new Dispatcher();
    get dispatcher() {
        return this.#dispatcher;
    }

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
    destroy() {
        this.#dispatcher.clearAll();
    }

    /**
        * @returns {{ className: string, displayName: string }}
    */
    get meta() {
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