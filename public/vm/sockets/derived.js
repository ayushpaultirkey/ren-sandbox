import { ISocket } from "../socket.js";
import { DERIVED_TYPES } from "../types/default.js";

class ExecutionSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.ExecutionSocket",
        displayName: "Exec",
        displayColor: "#bdbdbd"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "exec", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = DERIVED_TYPES.FUNCTION;
        this.validSubTypes = new Set([ DERIVED_TYPES.FUNCTION ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 1 : 100;

    }

}
class EventSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.EventSocket",
        displayName: "Event",
        displayColor: "#f43f5e"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "event", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = DERIVED_TYPES.EVENT;
        this.validSubTypes = new Set([ DERIVED_TYPES.EVENT ]);
        this.maxLinks = 1;

    }

}

export { ExecutionSocket, EventSocket };