import { IObject } from "./object.js";

class IValue extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.IValue",
        displayName: "Data"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, type = null, value = null, name = null } = {}) {
        super({ uuid, outer, name });
        this.type = type;
        this.value = value;
    }

    static DATA_TYPE = {
        STRING: "STRING",
        NUMBER: "NUMBER",
        BOOLEAN: "BOOLEAN"
    }

    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
    }

}


export { IValue };