import { INode, NODES_REGISTRY } from "@vm/node.js";
import { PRIMITIVE_TYPES } from "@vm/types/default.js";

import { ObjectSocket } from "@vm/sockets/user.js";
import { FloatSocket, StringSocket, WildcardSocket } from "@vm/sockets/primitive.js";
import { EventSocket, ExecutionSocket } from "@vm/sockets/derived.js";
import { ISocket } from "@vm/socket.js";


class Callback extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "Javascript.Event.Callback",
        displayName: "Callback",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }
    
    main(args) {
        this.addOutput("event0", "event", EventSocket);
        this.addOutput("out0", "out", ExecutionSocket);
        this.addOutput("args0", "args?", ObjectSocket);
        super.main(args);
    }

    execute() {
        console.log("dispatcher");
        this.executeLinkedNode("out0", 0);
    }

}

const nodes = [
    Callback,
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };