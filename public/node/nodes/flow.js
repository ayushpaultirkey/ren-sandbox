import { INode } from "../node.js"
import { IPin } from "../pin.js"

class Begin extends INode {
    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.in = {};
        this.out = {
            "out0": new IPin({ outer: this, type: IPin.TYPE.OUTPUT })
        };
    }
    execute() {
        
        console.log("begin");

        const out0 = this.getOutputPin("out0");
        if(out0 && out0.isLinked(0)) {
            out0.getLink(0).getOuter().execute();
        }

    }
}
class Task extends INode {
    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.in = {
            "in0": new IPin({ outer: this, type: IPin.TYPE.INPUT })
        };
        this.out = {
            "out0": new IPin({ outer: this, type: IPin.TYPE.OUTPUT })
        };
    }
    execute() {

        console.log("task");

        const out0 = this.getOutputPin("out0");
        if(out0 && out0.isLinked(0)) {
            out0.getLink(0).getOuter().execute();
        }

    }
}
class End extends INode {
    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.in = {
            "in0": new IPin({ outer: this, type: IPin.TYPE.INPUT })
        };
        this.out = {};
    }
    execute() {
        console.log("end");
    }
}


export { Begin, Task, End }