import { INode, NODES_REGISTRY } from "@vm/node.js";
import { PRIMITIVE_TYPES } from "@vm/types/default.js";

import { ObjectSocket } from "@vm/sockets/user.js";
import { FloatSocket, StringSocket, WildcardSocket } from "@vm/sockets/primitive.js";
import { EventSocket, ExecutionSocket } from "@vm/sockets/derived.js";
import { ISocket } from "@vm/socket.js";

class CallbackDelay extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Timer.CallbackDelay",
        displayName: "Callback Delay",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("event0", "event", EventSocket);
        this.addOutput("out0", "out", ExecutionSocket);
        this.propertyManager.addProperty("time", PRIMITIVE_TYPES.FLOAT, 5, { name: "time" });
        super.main(args);
    }

    execute() {

        const timeProperty = this.propertyManager.getProperty("time");
        const time = timeProperty.value || 5;

        setTimeout(() => {
            this.executeLinkedNode("event0", 0);
        }, time * 1000);

        this.executeLinkedNode("out0", 0);

    }

}
class Delay extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Timer.Delay",
        displayName: "Delay",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "in", ExecutionSocket);
        this.addOutput("out0", "out", ExecutionSocket);
        this.propertyManager.addProperty("time", PRIMITIVE_TYPES.FLOAT, 5, { name: "time" });
        super.main(args);
    }

    execute() {

        const timeProperty = this.propertyManager.getProperty("time");
        const time = timeProperty.value || 5;

        setTimeout(() => {
            this.executeLinkedNode("out0", 0);
        }, time * 1000);

    }

};

const nodes = [
    CallbackDelay,
    Delay
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };