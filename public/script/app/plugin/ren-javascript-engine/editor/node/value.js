import { INode, NODES_REGISTRY } from "@vm/node.js";
import { FloatSocket, IntegerSocket, StringSocket, WildcardSocket } from "@vm/sockets/primitive.js";
import { ObjectSocket } from "@vm/sockets/user";
import { PRIMITIVE_TYPES } from "@vm/types/default.js";

class MakeFloat extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Make.Float",
        displayName: "Make Float",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addOutput("value0", "value", FloatSocket);
        this.propertyManager.addProperty("value0", PRIMITIVE_TYPES.FLOAT, 0, { name: "value" });
        super.main(args);
    }

    execute() {
        let value = this.propertyManager.getProperty("value").value;
        value = !isNaN(value) ? parseFloat(value) : null;
        this.getOutput("value0").setValue(value);
    }

}

class MakeInteger extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Make.Integer",
        displayName: "Make Integer",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addOutput("value0", "value", IntegerSocket);
        this.propertyManager.addProperty("value0", PRIMITIVE_TYPES.INTEGER, 0, { name: "value" });
        super.main(args);
    }

    execute() {

        let value;
        value = this.propertyManager.getProperty("value0").value;
        value = !isNaN(value) ? parseInt(value) : null;

        this.getOutput("value0").setValue(value);
        
    }

}

class MakeString extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Make.String",
        displayName: "Make String",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addOutput("value0", "value", StringSocket);
        this.propertyManager.addProperty("value0", PRIMITIVE_TYPES.STRING, "", { name: "value" });
        super.main(args);
    }

    execute() {
        const property = this.propertyManager.getProperty("value0");
        this.getOutput("value0").setValue(property.value);
    }
    
}

class MakeObject extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Make.Object",
        displayName: "Make Object",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addInput("value0", "value", WildcardSocket);
        this.addOutput("object0", "object", ObjectSocket);

        this.propertyManager.addProperty("name0", PRIMITIVE_TYPES.STRING, "", { name: "name" });

        super.main(args);

    }

    execute() {

        const value = this.getInput("value0").getValue();

        const property = this.propertyManager.getProperty("name0");
        const name = property.value || "untitled";

        this.getOutput("object0").setValue({ [name]: value });

    }
    
}

class BreakObject extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Break.Object",
        displayName: "Break Object",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {

        this.addInput("object0", "object", ObjectSocket);
        this.addOutput("value0", "value", WildcardSocket);

        this.propertyManager.addProperty("name0", PRIMITIVE_TYPES.STRING, "", { name: "name" });

        super.main(args);

    }

    execute() {

        const value = this.getInput("object0").getValue();

        const property = this.propertyManager.getProperty("name0");
        const name = property.value;

        this.getOutput("value0").setValue(value[name]);

    }
    
}


class WildcardToString extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Cast.WildcardToString",
        displayName: "Wildcard to String",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("wildcard0", "wildcard", WildcardSocket);
        this.addOutput("string0", "string", StringSocket);
        super.main(args);
    }

    execute() {

        const value = this.getInput("wildcard0").getValue();
        this.getOutput("string0").setValue(value);

    }
    
}
class WildcardToFloat extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Cast.WildcardToFloat",
        displayName: "Wildcard to Float",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("wildcard0", "wildcard", WildcardSocket);
        this.addOutput("float0", "float", FloatSocket);
        super.main(args);
    }

    execute() {

        const value = this.getInput("wildcard0").getValue();
        this.getOutput("float0").setValue(value || parseFloat(value));

    }
    
}
class WildcardToInteger extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Cast.WildcardToInteger",
        displayName: "Wildcard to Integer",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("wildcard0", "wildcard", WildcardSocket);
        this.addOutput("integer0", "integer", IntegerSocket);
        super.main(args);
    }

    execute() {

        const value = this.getInput("wildcard0").getValue();
        this.getOutput("integer0").setValue(value || parseInt(value));

    }
    
}

class FloatToString extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Cast.FloatToString",
        displayName: "Float to String",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("float0", "float", FloatSocket);
        this.addOutput("string0", "string", StringSocket);
        super.main(args);
    }

    execute() {

        const value = this.getInput("float0").getValue();
        this.getOutput("string0").setValue(value);

    }
    
}

class IntegerToString extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Cast.IntegerToString",
        displayName: "Integer to String",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("integer0", "integer", IntegerSocket);
        this.addOutput("string0", "string", StringSocket);
        super.main(args);
    }

    execute() {

        const value = this.getInput("integer0").getValue();
        this.getOutput("string0").setValue(value);

    }
    
}

class StringToFloat extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Cast.StringToFloat",
        displayName: "String to Float",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("string0", "string", StringSocket);
        this.addOutput("float0", "float", FloatSocket);
        super.main(args);
    }

    execute() {

        const value = this.getInput("string0").getValue();
        this.getOutput("float0").setValue(value);

    }
    
}

class StringToInteger extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "Javascript.Value.Cast.StringToInteger",
        displayName: "String to Integer",
        canCache: false,
    }

    constructor({ uuid, outer }) {
        super({ uuid, outer });
    }

    main(args) {
        this.addInput("string0", "string", StringSocket);
        this.addOutput("integer0", "integer", IntegerSocket);
        super.main(args);
    }

    execute() {

        const value = this.getInput("string0").getValue();
        this.getOutput("integer0").setValue(value);

    }
    
}

const nodes = [
    MakeFloat,
    MakeInteger,
    MakeString,
    MakeObject,
    BreakObject,
    WildcardToString,
    WildcardToFloat,
    WildcardToInteger,
    FloatToString,
    IntegerToString,
    StringToFloat,
    StringToInteger
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };