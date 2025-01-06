import { IObject } from "./object.js";
import { INode } from "./node.js";
import { IPin } from "./pin.js";

import { Begin, End, Log } from "./nodes/flow.js";

class IGraph extends IObject {
    constructor({ uuid = crypto.randomUUID(), name = "IGraph", outer = null } = {}) {
        super({ uuid, name, outer });
        this.nodes = {};
        this.values = {};
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
    linkNodesByUUID(sourceNodeUUID, sourcePinUUID, targetNodeUUID, targetPinUUID) {
        
        const sourceNode = this.getNodeByUUID(sourceNodeUUID);
        const targetNode = this.getNodeByUUID(targetNodeUUID);

        this.linkNodes(sourceNode, sourcePinUUID, targetNode, targetPinUUID);

    }
    linkNodes(sourceNode, sourcePinUUID, targetNode, targetPinUUID) {
        
        if(!sourceNode || !targetNode) {
            console.error("Invalid target or source node");
            return;
        }

        const sourcePin = sourceNode.getOutputPin(sourcePinUUID);
        const targetPin = targetNode.getInputPin(targetPinUUID);

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

        console.warn(`Node Pin Linked ${sourceNode.getUUID()}.${sourcePinUUID} -> ${targetNode.getUUID()}.${targetPinUUID}`);

        return true;
        
    }
    execute(nodeUUID) {

        const node = this.getNodeByUUID(nodeUUID);
        if(!node) return;

        node.execute();

    }
    export() {

        let nodes = {};
        let links = [];
        let entry = null;
        let success = true;

        for(const nodeUUID in this.nodes) {

            const node = this.nodes[nodeUUID];
            const nodeData = node.export();

            nodes[nodeUUID] = nodeData.data;
            links.push(...nodeData.links); 

            if(node.isEntry) {
                if(entry) {
                    success = false;
                    break;
                };
                entry = nodeUUID;
            }

        }

        if(!success) {
            console.error("Multiple entry found");
            return;
        };

        const exportData = { graphUUID: this.getUUID(), entryNodeUUID: entry, nodes: nodes, links: links };

        return exportData;

    }
}

// const g1 = new IGraph({ name: "Graph 1" });
// g1.addNode(Begin, "Begin");
// g1.addNode(Log, "Log");
// g1.addNode(End, "End");
// g1.linkNodesByUUID("Begin", "out0", "Log", "in0");
// g1.linkNodesByUUID("Log", "out0", "End", "in0");
// g1.execute("Begin");
// g1.export();

export { IGraph };