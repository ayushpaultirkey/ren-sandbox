import { INode, NODES_REGISTRY } from "../node.js"
import { ISocket } from "../socket.js"
import { ExecPin } from "./../pins/exec.js";


class Begin extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.Begin",
        displayName: "Begin"
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {};
        this.output = {
            "out0": new ExecPin({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT })
        };
        this.isEntry = true;
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
        displayName: "Log"
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "in0": new ExecPin({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.output = {
            "out0": new ExecPin({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT })
        };
    }
    execute() {
        console.log("log");
        this.executeLinkedNode("out0", 0);
    }
}

class End extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.End",
        displayName: "Return"
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "in0": new ExecPin({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.output = {};
    }
    execute() {
        console.log("end");
    }
}


NODES_REGISTRY.registerMany({
    "INode.Event.Begin": Begin,
    "INode.Event.Log": Log,
    "INode.Event.End": End
});

export { Begin, Log, End }