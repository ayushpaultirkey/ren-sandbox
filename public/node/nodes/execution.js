import { INode, NODES_REGISTRY } from "../node.js";
import { PRIMITIVE_TYPES } from "../types/default.js";

import { ObjectSocket } from "../sockets/user.js";
import { FloatSocket, StringSocket, WildcardSocket } from "../sockets/primitive.js";
import { ExecutionSocket } from "../sockets/derived.js";
import { ISocket } from "../socket.js";


class Begin extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "INode.Event.Begin",
        displayName: "Begin",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.isEntry = true;
    }
    main(args) {
        this.addOutput("out0", "out", ExecutionSocket);
        this.addOutput("args0", "args", ObjectSocket);
        super.main(args);
    }

    execute() {
        console.log("begin");
        this.executeLinkedNode("out0", 0);
    }

}

class Log extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.Log",
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

        let value = this.getInput("value1").getValue();

        console.log("log", value);
        this.executeLinkedNode("out0", 0);

    }

}

class Return extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.Return",
        displayName: "Return",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }
    main(args) {
        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("args0", "args", ObjectSocket);
        super.main(args);
    }
    execute() {
        console.log("end");
    }

}

NODES_REGISTRY.registerMany({
    "INode.Event.Begin": Begin,
    "INode.Event.Log": Log,
    "INode.Event.Return": Return,
});