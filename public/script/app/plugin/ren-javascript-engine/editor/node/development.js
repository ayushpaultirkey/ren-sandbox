import { INode, NODES_REGISTRY } from "@vm/node.js";
import { PRIMITIVE_TYPES } from "@vm/types/default.js";

import { ObjectSocket } from "@vm/sockets/user.js";
import { FloatSocket, StringSocket, WildcardSocket } from "@vm/sockets/primitive.js";
import { EventSocket, ExecutionSocket } from "@vm/sockets/derived.js";
import { ISocket } from "@vm/socket.js";

class Log extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Development.Log",
        displayName: "Log",
        canCache: true
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("value1", "value", StringSocket);
        this.addOutput("out0", "out", ExecutionSocket);
        super.main(args);
    }

    execute() {        

        const value = this.getInput("value1").getValue();
        console.log(value);

        this.executeLinkedNode("out0", 0);

    }

}

class Alert extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Development.Alert",
        displayName: "Alert",
        canCache: true
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("value1", "value", StringSocket);
        this.addOutput("out0", "out", ExecutionSocket);
        super.main(args);
    }
    
    execute() {        

        const value = this.getInput("value1").getValue();
        alert(value);

        this.executeLinkedNode("out0", 0);

    }

}

const nodes = [
    Log,
    Alert,
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };