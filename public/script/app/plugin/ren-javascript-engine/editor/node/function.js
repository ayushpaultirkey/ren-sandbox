import { INode, NODES_REGISTRY } from "@vm/node.js";
import { ObjectSocket } from "@vm/sockets/user.js";
import { ExecutionSocket } from "@vm/sockets/derived.js";


class Begin extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "Javascript.Function.Begin",
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
        
        /** @type {import("@vm/graph.js").IGraph} */
        const graph = this.outer;
        const args = graph.inputs.getProperty("args0").value || {};

        this.getOutput("args0").setValue(args);
        this.executeLinkedNode("out0", 0);
        
    }

}


class Return extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Function.Return",
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

        const value = this.getInput("args0").getValue();

        /** @type {import("@vm/graph.js").IGraph} */
        const graph = this.outer;
        graph.outputs.setProperty("args0", value || {});

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