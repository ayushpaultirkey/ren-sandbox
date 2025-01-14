import { ISocket } from "../socket.js";

class ExecPin extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.ExecPin",
        displayName: "Exec"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "exec", type = null, value = null }) {

        super({ uuid, outer, name, type, value });

        this.subType = ISocket.SUB_TYPES.EXEC;
        this.validSubTypes = new Set([ ISocket.SUB_TYPES.EXEC ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 1 : 100;

    }

}

class FloatPin extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.FloatPin",
        displayName: "Float"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "exec", type = null, value = null }) {

        super({ uuid, outer, name, type, value });

        this.subType = FloatPin.SUB_TYPES.FLOAT;
        this.validSubTypes = new Set([ FloatPin.SUB_TYPES.FLOAT ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

    static SUB_TYPES = {
        FLOAT: "FLOAT"
    }

}

export { ExecPin, FloatPin }