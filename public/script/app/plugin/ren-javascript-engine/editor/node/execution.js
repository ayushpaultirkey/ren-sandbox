import { INode, NODES_REGISTRY } from "@vm/node.js";
import { PRIMITIVE_TYPES } from "@vm/types/default.js";

import { ObjectSocket } from "@vm/sockets/user.js";
import { FloatSocket, StringSocket, WildcardSocket } from "@vm/sockets/primitive.js";
import { EventSocket, ExecutionSocket } from "@vm/sockets/derived.js";
import { ISocket } from "@vm/socket.js";


class Callback extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "INode.Event.Callback",
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
        this.addOutput("args0", "args?", ObjectSocket);
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

        const value = this.getInput("value1").getValue();
        console.log(value);

        this.executeLinkedNode("out0", 0);

    }

}

class Alert extends INode {
    
    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.Alert",
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
        this.addInput("args0", "args?", ObjectSocket);
        super.main(args);
    }

    execute() {
        console.log("end");
    }

}

class CallbackDelay extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.CallbackDelay",
        displayName: "Callback Delay",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("in0", "in", ExecutionSocket);
        this.addInput("event0", "event", EventSocket);
        this.propertyManager.addProperty("time", PRIMITIVE_TYPES.FLOAT, 5, { name: "time" });
        super.main(args);
    }

    execute() {

        const timeProperty = this.propertyManager.getProperty("time");
        const time = timeProperty.value || 5;

        setTimeout(() => {
            this.executeLinkedNode("event0", 0);
        }, time * 1000);

    }

}
class Delay extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.Delay",
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

const nodes = {
    "INode.Event.Begin": Begin,
    "INode.Event.Log": Log,
    "INode.Event.Alert": Alert,
    "INode.Event.Return": Return,
    "INode.Event.Callback": Callback,
    "INode.Event.CallbackDelay": CallbackDelay,
    "INode.Event.Delay": Delay
};

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };