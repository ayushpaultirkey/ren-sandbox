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
    getValue() {
        return this.value;
    }
    
    setValue(value) {
        this.value = value;
    }

    getType() {
        return this.type;
    }

}


export { IValue };