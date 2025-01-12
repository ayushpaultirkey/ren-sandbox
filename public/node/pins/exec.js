import { ISocket } from "../socket";

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

export { ExecPin }