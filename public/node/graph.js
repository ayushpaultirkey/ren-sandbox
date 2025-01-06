import { IObject } from "./object.js";
import { INode } from "./node.js";
import { IPin } from "./pin.js";

import { Begin, End, Log } from "./nodes/flow.js";

class IGraph extends IObject {
    constructor({ uuid = crypto.randomUUID(), name = "IGraph", outer = null, classId = "NDE|IGraph" } = {}) {
        super({ uuid, name, outer, classId });
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
    removeNodeByUUID(nodeUUID) {
        this.removeNode(this.nodes[nodeUUID]);
    }
    removeNode(node) {

        if(!node) return null;

        const inPins = node.in;
        for(const pinUUID in inPins) {
            const pin = inPins[pinUUID];
            this.clearNodePin(pin);
        }

        const outPins = node.in;
        for(const pinUUID in outPins) {
            const pin = outPins[pinUUID];
            this.clearNodePin(pin);
        }

        delete this.nodes[node.getUUID()];

        return true;

    }
    getNodeByUUID(nodeUUID) {
        return this.nodes[nodeUUID];
    }

    clearNodePinByUUID(nodeUUID, pinUUID) {

        const node = this.getNodeByUUID(nodeUUID);
        if(!node) return;

        const pin = node.getPin(pinUUID);
        if(!pin) return;

        return this.clearNodePin(pin);

    }
    clearNodePin(pin) {

        if(!pin) return;

        pin.links.forEach(linkedPin => {
            linkedPin.unlink(pin);
        });

        pin.unlinkAll();

        return true;

    }
    
    unlinkNodesByUUID(sourceNodeUUID, sourcePinUUID, targetNodeUUID, targetPinUUID) {

        const sourceNode = this.getNodeByUUID(sourceNodeUUID);
        const targetNode = this.getNodeByUUID(targetNodeUUID);

        this.unlinkNodes(sourceNode, sourcePinUUID, targetNode, targetPinUUID);

    }
    unlinkNodes(sourceNode, sourcePinUUID, targetNode, targetPinUUID) {
        
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

        sourcePin.unlink(targetPin);
        targetPin.unlink(sourcePin);

        return true;

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
    getEntryNode() {
        return Object.values(this.nodes).find(node => node.isEntry === true);
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

export { IGraph };