import { INode, NODES_REGISTRY } from "@vm/node.js";
import { PRIMITIVE_TYPES } from "@vm/types/default.js";

import { ObjectSocket } from "@vm/sockets/user.js";
import { FloatSocket, StringSocket, WildcardSocket } from "@vm/sockets/primitive.js";
import { EventSocket, ExecutionSocket } from "@vm/sockets/derived.js";
import { ISocket } from "@vm/socket.js";

class MathAdd extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Math.Add",
        displayName: "Add",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "a", FloatSocket);
        this.addInput("in1", "b", FloatSocket);
        this.addOutput("out0", "result", FloatSocket);
        super.main(args);
    }

    execute() {        

        const a1 = this.getInput("a1").getValue();
        const a2 = this.getInput("a2").getValue();

        const result = a1 + a2;

        this.getOutput("out0").setValue(result);

    }

}

class MathSubtract extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Math.Subtract",
        displayName: "Subtract",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "a", FloatSocket);
        this.addInput("in1", "b", FloatSocket);
        this.addOutput("out0", "result", FloatSocket);
        super.main(args);
    }

    execute() {        

        const a1 = this.getInput("a1").getValue();
        const a2 = this.getInput("a2").getValue();

        const result = a1 - a2;

        this.getOutput("out0").setValue(result);

    }

}

class MathMultiply extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Math.Multiply",
        displayName: "Multiply",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "a", FloatSocket);
        this.addInput("in1", "b", FloatSocket);
        this.addOutput("out0", "result", FloatSocket);
        super.main(args);
    }

    execute() {        

        const a1 = this.getInput("a1").getValue();
        const a2 = this.getInput("a2").getValue();

        const result = a1 * a2;

        this.getOutput("out0").setValue(result);

    }

}


class MathDivide extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Math.Divide",
        displayName: "Divide",
        canCache: false
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "a", FloatSocket);
        this.addInput("in1", "b", FloatSocket);
        this.addOutput("out0", "result", FloatSocket);
        super.main(args);
    }

    execute() {        

        const a1 = this.getInput("a1").getValue();
        const a2 = this.getInput("a2").getValue();

        const result = a1 / a2;

        this.getOutput("out0").setValue(result);

    }

}

const nodes = [
    MathAdd,
    MathSubtract,
    MathMultiply,
    MathDivide
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };