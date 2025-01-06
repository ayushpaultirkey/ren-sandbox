import { INode } from "../node.js"
import { IPin } from "../pin.js"
import { ExecPin } from "./../pins/exec.js";


class Begin extends INode {
    constructor({ uuid, outer }) {
        super({ uuid, outer, name: "Begin", classId: "Event|Begin" });
        this.in = {};
        this.out = {
            "out0": new ExecPin({ uuid: "out0", name: "out", outer: this, type: IPin.TYPES.OUTPUT })
        };
        this.isEntry = true;
    }
    execute() {
        console.log("begin");
        this.executeLinkedNode("out0", 0);
    }
}

class Log extends INode {
    constructor({ uuid, outer }) {
        super({ uuid, outer, name: "Log", classId: "Event|Log" });
        this.in = {
            "in0": new ExecPin({ uuid: "in0", name: "in", outer: this, type: IPin.TYPES.INPUT })
        };
        this.out = {
            "out0": new ExecPin({ uuid: "out0", name: "out", outer: this, type: IPin.TYPES.OUTPUT })
        };
    }
    execute() {
        console.log("log");
        this.executeLinkedNode("out0", 0);
    }
}

class End extends INode {
    constructor({ uuid, outer }) {
        super({ uuid, outer, name: "Return", classId: "Event|End" });
        this.in = {
            "in0": new ExecPin({ uuid: "in0", name: "in", outer: this, type: IPin.TYPES.INPUT })
        };
        this.out = {};
    }
    execute() {
        console.log("end");
    }
}



export { Begin, Log, End }