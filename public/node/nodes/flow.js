import { INode } from "../node.js"
import { IPin } from "../pin.js"


class Begin extends INode {
    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.in = {};
        this.out = {
            "out0": new IPin({ uuid: "out0" , outer: this, type: IPin.TYPE.OUTPUT })
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
        super({ uuid, outer });
        this.in = {
            "in0": new IPin({ uuid: "in0", outer: this, type: IPin.TYPE.INPUT })
        };
        this.out = {
            "out0": new IPin({ uuid: "out0", outer: this, type: IPin.TYPE.OUTPUT })
        };
    }
    execute() {

        console.log("log");
        this.executeLinkedNode("out0", 0);

    }
}

class End extends INode {
    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.in = {
            "in0": new IPin({ uuid: "in0", outer: this, type: IPin.TYPE.INPUT })
        };
        this.out = {};
    }
    execute() {
        
        console.log("end");

    }
}



export { Begin, Log, End }