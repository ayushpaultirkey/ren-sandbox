import { IObject } from "./object.js";
import { INode } from "./node.js";
import { IPin } from "./pin.js";

import { Begin, End, Task } from "./nodes/flow.js";

class IGraph extends IObject {
    constructor({ uuid, name, outer }) {
        super({ uuid, name, outer });
        this.nodes = {};
    }
    addNode(nodeClass, nodeUUID) {

        const uuid = nodeUUID || crypto.randomUUID();

        if(!nodeClass) return null;
        if(this.nodes[uuid]) return null;

        const node = new nodeClass({ uuid: uuid , outer: this });
        this.nodes[uuid] = node;

        return node;

    }
    getNodeByUUID(nodeUUID) {
        return this.nodes[nodeUUID];
    }
    linkNodes(sourceNodeUUID, sourcePinName, targetNodeUUID, targetPinName) {
        
        const sourceNode = this.getNodeByUUID(sourceNodeUUID);
        const targetNode = this.getNodeByUUID(targetNodeUUID);

        if(!sourceNode || !targetNode) {
            console.error("Invalid target or source node");
            return;
        }

        const sourcePin = sourceNode.getOutputPin(sourcePinName);
        const targetPin = targetNode.getInputPin(targetPinName);

        if(!sourcePin || !targetPin) {
            console.error("Invalid target or source pin");
            return;
        }

        if(sourcePin == targetPin) {
            console.error("Source and target pins are the same");
            return;
        }

        if(!sourcePin.canLinkTo(targetPin) || !targetPin.canLinkTo(sourcePin)) {
            console.error("Cannot connect pins");
            return;
        }

        sourcePin.link(targetPin);
        targetPin.link(sourcePin);

    }
    execute() {

    }
}

const g1 = new IGraph({ name: "Graph 1" });

g1.addNode(Begin, "Begin");
g1.addNode(Task, "Task");
g1.addNode(End, "End");

g1.linkNodes("Begin", "out0", "Task", "in0");
g1.linkNodes("Task", "out0", "End", "in0");

g1.getNodeByUUID("Begin").execute();

export { IGraph };