import { INode, NODES_REGISTRY } from "@vm/node.js";
import { FloatSocket, StringSocket } from "@vm/sockets/primitive.js";
import { PRIMITIVE_TYPES } from "@vm/types/default.js";

class MakeFloat extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Value.MakeFloat",
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

class MakeString extends INode {

    /** @type {IObject.meta} */
    static meta = {
        className: "INode.Value.MakeString",
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
        const value = property.value;
        this.getOutput("value0").setValue(value);
    }
    
}

const nodes = [
    MakeFloat,
    MakeString
]

function register() {
    NODES_REGISTRY.registerMany(nodes);
};

function unregister() {
    NODES_REGISTRY.unregisterMany(nodes);
};

export { register, unregister, nodes };