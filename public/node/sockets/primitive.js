import { ISocket } from "../socket.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "../types/default.js";

class WildcardSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.WildcardSocket",
        displayName: "Float",
        displayColor: "#e5e7eb",
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "float", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = PRIMITIVE_TYPES.WILDCARD;
        this.validSubTypes = new Set([
            PRIMITIVE_TYPES.WILDCARD,
            PRIMITIVE_TYPES.BOOLEAN,
            PRIMITIVE_TYPES.STRING,
            PRIMITIVE_TYPES.INT,
            PRIMITIVE_TYPES.FLOAT,
            USER_DEFINED_TYPES.OBJECT
        ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

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
            PRIMITIVE_TYPES.INT,
            PRIMITIVE_TYPES.FLOAT
        ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

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
            PRIMITIVE_TYPES.STRING
        ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

}

export { FloatSocket, StringSocket, WildcardSocket };