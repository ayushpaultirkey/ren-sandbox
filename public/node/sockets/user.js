import { ISocket } from "../socket.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "../types/default.js";

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

export { ObjectSocket };