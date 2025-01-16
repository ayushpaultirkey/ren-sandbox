import { IProperty } from "../property.js";
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
        this.inputs = {
            "in0": new ExecutionSocket({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT }),
            "args0": new ObjectSocket({ uuid: "args0", name: "args", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.outputs = {
            "out0": new ExecutionSocket({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT }),
            "args0": new ObjectSocket({ uuid: "args0", name: "args", outer: this, type: ISocket.TYPES.OUTPUT })
        };
        this.value = {
            "value0": new IProperty({
                uuid: "value0",
                name: "Value",
                outer: this,
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
        this.inputs = {
            "wildcard0": new WildcardSocket({
                uuid: "wildcard0",
                name: "wildcard",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.outputs = {
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
            let data = this.inputs.wildcard0.getValue();
            if(isNaN(data)) {
                data = null
            }
            else {
                data = parseFloat(data);
            }
            this.outputs.float0.setValue(data);
        }
        catch {
            this.outputs.float0.setValue(null);
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
        this.inputs = {
            "wildcard0": new WildcardSocket({
                uuid: "wildcard0",
                name: "wildcard",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.outputs = {
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
            const data = this.inputs.wildcard0.getValue();
            this.outputs.string0.setValue(data.toString());
        }
        catch {
            this.outputs.string0.setValue(null);
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
        this.inputs = {
            "float0": new FloatSocket({
                uuid: "float0",
                name: "float",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.outputs = {
            "string0": new StringSocket({
                uuid: "string0",
                name: "string",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
    }

    execute() {
        let data = this.inputs.float0.getValue();
        if(isNaN(data)) {
            data = null;
        }
        else {
            data = data.toString();
        }
        this.outputs.string0.setValue(data);
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
        this.inputs = {
            "object0": new ObjectSocket({
                uuid: "object0",
                name: "object",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.outputs = {
            "wildcard0": new WildcardSocket({
                uuid: "wildcard0",
                name: "value",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "key0": new IProperty({
                uuid: "key0",
                name: "name",
                outer: this,
                value: "key 1",
                type: PRIMITIVE_TYPES.STRING
            })
        };
    }

    execute() {
        const data = this.inputs.object0.getValue();
        const key = this.value.key0.getValue();
        if(!data || !key || !data[key]) {
            this.outputs.wildcard0.setValue(null);
        }
        else {
            this.outputs.wildcard0.setValue(data[key]);
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
        this.inputs = {
            "wildcard0": new WildcardSocket({
                uuid: "wildcard0",
                name: "value",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        };
        this.outputs = {
            "object0": new ObjectSocket({
                uuid: "object0",
                name: "object",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "data0": new IProperty({
                uuid: "data0",
                name: "Key",
                outer: this,
                value: "key 1",
                type: PRIMITIVE_TYPES.STRING
            })
        };
    }

    execute() {

        const data = this.inputs.wildcard0.getValue();
        const key = this.value.data0.getValue();
        if(!key) {
            this.outputs.object0.setValue(null);
        }
        else {
            this.outputs.object0.setValue({ [key]: data });
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
        this.inputs = {};
        this.outputs = {
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
        this.inputs = {
            "in0": new ExecutionSocket({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT }),
            "value1": new StringSocket({ uuid: "value1", name: "value", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.outputs = {
            "out0": new ExecutionSocket({ uuid: "out0", name: "out", outer: this, type: ISocket.TYPES.OUTPUT })
        };
    }

    execute() {        

        let val = this.inputs.value1.getValue();

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
        this.inputs = {
            "in0": new ExecutionSocket({ uuid: "in0", name: "in", outer: this, type: ISocket.TYPES.INPUT }),
            "args0": new ObjectSocket({ uuid: "args0", name: "args", outer: this, type: ISocket.TYPES.INPUT })
        };
        this.outputs = {};
    }

    execute() {
        console.log("end");
    }

}

class GetValue extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.GetValue",
        displayName: "Get Value",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.inputs = {
            "target0": new WildcardSocket({
                uuid: "target0",
                name: "target",
                outer: this,
                type: ISocket.TYPES.INPUT
            })
        }
        this.outputs = {
            "value0": new WildcardSocket({
                uuid: "value0",
                name: "wildcard",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        }
        this.value = {
            "name0": new IProperty({
                uuid: "name0",
                name: "Key",
                outer: this,
                value: "",
                type: PRIMITIVE_TYPES.STRING,
                custom: {
                    dropdown: true,
                    dropdownOptions: () => {
                        const graph = this.inputs.target0.getValue() || this.getOuter();
                        return Object.keys(graph.getVariables());
                    }
                }
            })
        }
    }

    execute() {

        // this.getOuter() should be called twice, once for the graph and once for the node
        const target0 = this.inputs.target0.getValue() || this.getOuter();
        const name0 = this.value.name0.getValue();

        console.log(target0, name0);
        if(target0 && name0) {

            const graph = target0;
            const variable = graph.getVariable(name0);

            if(variable) {
                const value = variable.getValue();
                this.outputs.value0.setValue(value);
            }
            else {
                this.outputs.value0.setValue(null);
            }

        }
        else {
            this.outputs.value0.setValue(null);
        }

    }

}

class Value extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Event.Value",
        displayName: "Make Float",
        canCache: false
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
        this.outputs = {
            "value0": new FloatSocket({
                uuid: "value0",
                name: "float",
                outer: this,
                type: ISocket.TYPES.OUTPUT
            })
        };
        this.value = {
            "data0": new IProperty({
                uuid: "data0",
                name: "Value",
                outer: this,
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
        this.outputs.value0.setValue(value);
        
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
        this.inputs = {
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
        this.outputs = {
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
        let a = this.inputs.value1.getValue();
        let b = this.inputs.value2.getValue();
        let val = a + b;
        this.outputs.value3.setValue(val);
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
    "INode.Event.GetValue": GetValue
});

export { Begin, Log, End, Value, MathN, MakeObject, BreakObject };