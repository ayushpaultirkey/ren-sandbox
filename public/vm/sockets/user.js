import { ISocket } from "../socket.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "../types/default.js";

class ObjectSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.Object",
        displayName: "Object",
        displayColor: "#14b8a6"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "object", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = USER_DEFINED_TYPES.OBJECT;
        this.validSubTypes = new Set([ USER_DEFINED_TYPES.OBJECT ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

}

class GraphSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.Graph",
        displayName: "Graph",
        displayColor: "#00a5f4"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "graph", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = USER_DEFINED_TYPES.GRAPH;
        this.validSubTypes = new Set([ USER_DEFINED_TYPES.GRAPH ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

}


class GraphSetSocket extends ISocket {

    /** @type {IObject.meta} */
    static meta = {
        className: "ISocket.GraphSet",
        displayName: "GraphSet",
        displayColor: "#4f39f6"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "graphset", type = null, isRuntime = false }) {

        super({ uuid, outer, name, type, isRuntime });

        this.subType = USER_DEFINED_TYPES.GRAPH_SET;
        this.validSubTypes = new Set([ USER_DEFINED_TYPES.GRAPH_SET ]);

        this.maxLinks = (type == ISocket.TYPES.OUTPUT) ? 100 : 1;

    }

}

export { ObjectSocket, GraphSocket, GraphSetSocket };