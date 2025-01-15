import { ISocket } from "../socket.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES, DERIVED_TYPES } from "../type/types.js";

class ExecutionSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.ExecutionSocket",
        displayName: "Exec",
        displayColor: "#94a3b8"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "exec", type = null }) {

        super({ uuid, outer, name, type });

        this.subType = DERIVED_TYPES.FUNCTION;
        this.validSubTypes = new Set([ DERIVED_TYPES.FUNCTION ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 1 : 100;

    }

}

class WildcardSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.WildcardSocket",
        displayName: "Float",
        displayColor: "#e5e7eb"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "float", type = null }) {

        super({ uuid, outer, name, type });

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

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "float", type = null }) {

        super({ uuid, outer, name, type });

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

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "string", type = null }) {

        super({ uuid, outer, name, type });

        this.subType = PRIMITIVE_TYPES.STRING;
        this.validSubTypes = new Set([
            PRIMITIVE_TYPES.STRING
        ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

}

class ObjectSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.Object",
        displayName: "Object",
        displayColor: "#14b8a6"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "object", type = null, value = null }) {

        super({ uuid, outer, name, type, value });

        this.subType = USER_DEFINED_TYPES.OBJECT;
        this.validSubTypes = new Set([ USER_DEFINED_TYPES.OBJECT ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

}

export { ExecutionSocket, ObjectSocket, FloatSocket, StringSocket, WildcardSocket };