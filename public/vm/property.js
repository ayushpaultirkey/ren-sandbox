import { IObject } from "./object.js";

class IProperty extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.IProperty",
        displayName: "Data"
    }

    #type = null;

    constructor({ uuid = crypto.randomUUID(), outer = null, type = null, value = null, custom = {} } = {}) {
        
        super({ uuid, outer });

        this.#type = type;
        this.value = value;
        
        this.custom = custom || {};
        this.custom.name = custom.name || this.name;

    }

    get type() {
        return this.#type;
    }

    export() {
        return {
            type: this.#type,
            value: this.value,
            custom: this.custom
        }
    }

}


export { IProperty };