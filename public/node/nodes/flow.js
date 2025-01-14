import { IValue } from "../property.js";
import { INode, NODES_REGISTRY } from "../node.js"
import { IObject } from "../object.js";
import { ISocket } from "../socket.js"
import { ExecPin, FloatPin } from "./../pins/exec.js";

class BreakObject extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "INode.Event.BreakObject",
        displayName: "Break Object",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "object0": new FloatPin({
                uuid: "object0",
                name: "object",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "value0": new FloatPin({
                uuid: "value0",
                name: "value",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "key0": new IValue({
                uuid: "key0",
                name: "name",
                value: "key 1"
            })
        };
    }

    execute() {
        
    }

}

class MakeObject extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "INode.Event.MakeObject",
        displayName: "Make Object",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "value0": new FloatPin({
                uuid: "value0",
                name: "value",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "object0": new FloatPin({
                uuid: "object0",
                name: "object",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "data0": new IValue({
                uuid: "data0",
                name: "name",
                value: "key 1"
            })
        };
    }

    execute() {
        
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
        this.input = {};
        this.output = {
            "out0": new ExecPin({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT }),
            "args0": new FloatPin({ uuid: "args0", name: "args", outer: this, type: ISocket.TYPES.OUTPUT })
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
        displayName: "Log",
        canCache: true
    }
    
    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "in0": new ExecPin({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT }),
            "value1": new FloatPin({ uuid: "value1", name: "value", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.output = {
            "out0": new ExecPin({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT })
        };
    }

    execute() {        

        let val = this.input.value1.getValue();

        console.log("log", val);
        this.executeLinkedNode("out0", 0);
    }

}

class End extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.End",
        displayName: "Return",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "in0": new ExecPin({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT }),
            "value1": new FloatPin({ uuid: "value1", name: "value", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.output = {};
    }

    execute() {
        console.log("end");
    }

}


class Value extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.Value",
        displayName: "Value",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.output = {
            "value0": new FloatPin({
                uuid: "value0",
                name: "value",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "data0": new IValue({
                uuid: "data0",
                name: "Value",
                value: 0
            })
        }
    }

    execute() {
        const value = this.value.data0.getValue();
        this.output.value0.setValue((value * 1) || 0);
    }

}

class MathN extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.MathN",
        displayName: "Math",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "value1": new FloatPin({
                uuid: "value1",
                name: "a",
                outer: this,
                type: ISocket.TYPES.INPUT
            }),
            "value2": new FloatPin({
                uuid: "value2",
                name: "b",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "value3": new FloatPin({
                uuid: "value3",
                name: "c",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
    }

    execute() {
        let a = this.input.value1.getValue();
        let b = this.input.value2.getValue();
        let val = a + b;
        this.output.value3.setValue(val);
    }

}

NODES_REGISTRY.registerMany({
    "INode.Event.Begin": Begin,
    "INode.Event.Log": Log,
    "INode.Event.End": End,
    "INode.Event.Value": Value,
    "INode.Event.MathN": MathN,
    "INode.Event.MakeObject": MakeObject,
    "INode.Event.BreakObject": BreakObject
});

export { Begin, Log, End, Value, MathN, MakeObject, BreakObject };