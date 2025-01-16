import { ISocket } from "../socket.js";
import { DERIVED_TYPES } from "../types/default.js";

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

export { ExecutionSocket };