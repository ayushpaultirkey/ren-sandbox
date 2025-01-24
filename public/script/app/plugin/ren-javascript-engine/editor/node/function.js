import { INode, NODES_REGISTRY } from "@vm/node.js";
import { ObjectSocket } from "@vm/sockets/user.js";
import { ExecutionSocket } from "@vm/sockets/derived.js";


class Begin extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "INode.Function.Begin",
        displayName: "Begin",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.isEntry = true;
    }
    
    main(args) {
        this.addOutput("out0", "out", ExecutionSocket);
        this.addOutput("args0", "args?", ObjectSocket);
        super.main(args);
    }

    execute() {
        console.log("begin");
        this.executeLinkedNode("out0", 0);
    }

}


class Return extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Function.Return",
        displayName: "Return",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("args0", "args?", ObjectSocket);
        super.main(args);
    }

    execute() {
        console.log("end");
    }

}


const nodes = [
    Begin,
    Return,
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };