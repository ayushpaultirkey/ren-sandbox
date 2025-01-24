import { ISocket } from "../socket.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "../types/default.js";

class WildcardSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.WildcardSocket",
        displayName: "Float",
        displayColor: "#607d8b",
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "wildcard", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = PRIMITIVE_TYPES.WILDCARD;
        this.validSubTypes = new Set([
            PRIMITIVE_TYPES.WILDCARD,
            PRIMITIVE_TYPES.BOOLEAN,
            PRIMITIVE_TYPES.STRING,
            PRIMITIVE_TYPES.INTEGER,
            PRIMITIVE_TYPES.FLOAT,
            USER_DEFINED_TYPES.OBJECT,
            USER_DEFINED_TYPES.GRAPH_SET
        ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

}

class IntegerSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.IntegerSocket",
        displayName: "Integer",
        displayColor: "#00a73e"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "integer", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = PRIMITIVE_TYPES.INTEGER;
        this.validSubTypes = new Set([
            PRIMITIVE_TYPES.INTEGER,
            PRIMITIVE_TYPES.FLOAT
        ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

    setValue(value) {
        const validValue = (isNaN(value)) ? null : parseInt(value);
        super.setValue(validValue);
    }

}

class FloatSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.FloatSocket",
        displayName: "Float",
        displayColor: "#059669"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "float", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = PRIMITIVE_TYPES.FLOAT;
        this.validSubTypes = new Set([
            PRIMITIVE_TYPES.INTEGER,
            PRIMITIVE_TYPES.FLOAT
        ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

    setValue(value) {
        const validValue = (isNaN(value)) ? null : parseFloat(value);
        super.setValue(validValue);
    }

}

class StringSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.StringSocket",
        displayName: "String",
        displayColor: "#d946ef"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "string", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = PRIMITIVE_TYPES.STRING;
        this.validSubTypes = new Set([
            PRIMITIVE_TYPES.STRING,
            PRIMITIVE_TYPES.WILDCARD
        ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

    setValue(value) {
        const validValue = (value) ? value.toString() : null;
        super.setValue(validValue);
    }

}

export { FloatSocket, IntegerSocket, StringSocket, WildcardSocket };