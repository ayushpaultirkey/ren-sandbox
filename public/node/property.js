import { IObject } from "./object.js";

class IProperty extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.IProperty",
        displayName: "Data"
    }

    #type = null;
    #value = null;
    #custom = null;

    constructor({ uuid = crypto.randomUUID(), outer = null, name = null, type = null, value = null, custom = null } = {}) {
        super({ uuid, outer, name });
        this.#type = type;
        this.#value = value;
        this.#custom = custom;
    }

    get value() {
        return this.#value;
    }
    set value(data) {
        this.#value = data;
    }
    get type() {
        return this.#type;
    }
    get custom() {
        return this.#custom;
    }

    export() {
        return {
            name: this.name,
            type: this.#type,
            value: this.#value,
            custom: this.#custom
        }
    }

}


export { IProperty };