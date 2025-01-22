import { INode, NODES_REGISTRY } from "../node.js";
import { FloatSocket, StringSocket } from "../sockets/primitive.js";
import { PRIMITIVE_TYPES } from "../types/default.js";

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
        this.propertyManager.addProperty("value0", "value", PRIMITIVE_TYPES.FLOAT, 0);
        super.main(args);
    }
    execute() {
        let value = this.propertyManager.getProperty("value").value;
        if(!isNaN(value)) {
            value = parseFloat(value);
        }
        else {
            value = null;
        }
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
        this.propertyManager.addProperty("value0", "value", PRIMITIVE_TYPES.STRING, "");
        super.main(args);
    }
    execute() {
        const property = this.propertyManager.getProperty("value0");
        const value = property.value;
        this.getOutput("value0").setValue(value);
    }
}

NODES_REGISTRY.registerMany({
    "INode.Value.MakeFloat": MakeFloat,
    "INode.Value.MakeString": MakeString
});

export { MakeFloat };