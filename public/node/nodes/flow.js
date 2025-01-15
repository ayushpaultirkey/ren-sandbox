import { IValue } from "../property.js";
import { INode, NODES_REGISTRY } from "../node.js"
import { IObject } from "../object.js";
import { ISocket } from "../socket.js"
import { ExecutionSocket, ObjectSocket, StringSocket, FloatSocket, WildcardSocket } from "./../pins/exec.js";
import { PRIMITIVE_TYPES } from "../type/types.js";

class GraphNode extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "INode.Event.Graph",
        displayName: "Graph",
        canCache: true
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "in0": new ExecutionSocket({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT }),
            "args0": new ObjectSocket({ uuid: "args0", name: "args", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.output = {
            "out0": new ExecutionSocket({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT }),
            "args0": new ObjectSocket({ uuid: "args0", name: "args", outer: this, type: ISocket.TYPES.OUTPUT })
        };
        this.value = {
            "value0": new IValue({
                uuid: "value0",
                name: "Value",
                value: "graph.ren",
                type: PRIMITIVE_TYPES.STRING
            })
        }
    }

    execute() {
        
    }

}

class WildcardToFloat extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "INode.Cast.WildcardToFloat",
        displayName: "Wildcard To Float",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "wildcard0": new WildcardSocket({
                uuid: "wildcard0",
                name: "wildcard",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "float0": new FloatSocket({
                uuid: "float0",
                name: "float",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
    }

    execute() {
        try {
            let data = this.input.wildcard0.getValue();
            if(isNaN(data)) {
                data = null
            }
            else {
                data = parseFloat(data);
            }
            this.output.float0.setValue(data);
        }
        catch {
            this.output.float0.setValue(null);
        }
    }

}
class WildcardToString extends INode {
    
    /** @type {INode.meta} */
    static meta = {
        className: "INode.Cast.WildcardToString",
        displayName: "Wildcard To String",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "wildcard0": new WildcardSocket({
                uuid: "wildcard0",
                name: "wildcard",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "string0": new StringSocket({
                uuid: "string0",
                name: "string",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
    }

    execute() {
        try {
            const data = this.input.wildcard0.getValue();
            this.output.string0.setValue(data.toString());
        }
        catch {
            this.output.string0.setValue(null);
        }
    }

}
class FloatToString extends INode {

    /** @type {INode.meta} */
    static meta = {
        className: "INode.Cast.FloatToString",
        displayName: "Float to String",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "float0": new FloatSocket({
                uuid: "float0",
                name: "float",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "string0": new StringSocket({
                uuid: "string0",
                name: "string",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
    }

    execute() {
        let data = this.input.float0.getValue();
        if(isNaN(data)) {
            data = null;
        }
        else {
            data = data.toString();
        }
        this.output.string0.setValue(data);
    }

}





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
            "object0": new ObjectSocket({
                uuid: "object0",
                name: "object",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "wildcard0": new WildcardSocket({
                uuid: "wildcard0",
                name: "value",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "key0": new IValue({
                uuid: "key0",
                name: "name",
                value: "key 1",
                type: PRIMITIVE_TYPES.STRING
            })
        };
    }

    execute() {
        const data = this.input.object0.getValue();
        const key = this.value.key0.getValue();
        if(!data || !key || !data[key]) {
            this.output.wildcard0.setValue(null);
        }
        else {
            this.output.wildcard0.setValue(data[key]);
        }
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
            "wildcard0": new WildcardSocket({
                uuid: "wildcard0",
                name: "value",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "object0": new ObjectSocket({
                uuid: "object0",
                name: "object",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "data0": new IValue({
                uuid: "data0",
                name: "Key",
                value: "key 1",
                type: PRIMITIVE_TYPES.STRING
            })
        };
    }

    execute() {

        const data = this.input.wildcard0.getValue();
        const key = this.value.data0.getValue();
        if(!key) {
            this.output.object0.setValue(null);
        }
        else {
            this.output.object0.setValue({ [key]: data });
        }

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
            "out0": new ExecutionSocket({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT }),
            "args0": new ObjectSocket({ uuid: "args0", name: "args", outer: this, type: ISocket.TYPES.OUTPUT })
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
            "in0": new ExecutionSocket({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT }),
            "value1": new StringSocket({ uuid: "value1", name: "value", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.output = {
            "out0": new ExecutionSocket({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT })
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
            "in0": new ExecutionSocket({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT }),
            "args0": new ObjectSocket({ uuid: "args0", name: "args", outer: this, type: ISocket.TYPES.INPUT })
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
        displayName: "Float",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.output = {
            "value0": new FloatSocket({
                uuid: "value0",
                name: "float",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "data0": new IValue({
                uuid: "data0",
                name: "Value",
                value: 0,
                type: PRIMITIVE_TYPES.FLOAT
            })
        }
    }

    execute() {

        let value = this.value.data0.getValue();
        if(!isNaN(value)) {
            value = parseFloat(value);
        }
        else {
            value = null;
        }
        this.output.value0.setValue(value);
        
    }

}

class MathN extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.MathN",
        displayName: "Add",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.input = {
            "value1": new FloatSocket({
                uuid: "value1",
                name: "a",
                outer: this,
                type: ISocket.TYPES.INPUT
            }),
            "value2": new FloatSocket({
                uuid: "value2",
                name: "b",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.output = {
            "value3": new FloatSocket({
                uuid: "value3",
                name: "result",
                outer: this,
                type: ISocket.TYPES.OUTPUT,
                maxLinks: 1
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
    "INode.Event.Graph": GraphNode,
    "INode.Event.MakeObject": MakeObject,
    "INode.Event.BreakObject": BreakObject,
    "INode.Cast.FloatToString": FloatToString,
    "INode.Cast.WildcardToString": WildcardToString,
    "INode.Cast.WildcardToFloat": WildcardToFloat,
    "INode.Cast.WildcardToFloat": WildcardToFloat,
});

export { Begin, Log, End, Value, MathN, MakeObject, BreakObject };