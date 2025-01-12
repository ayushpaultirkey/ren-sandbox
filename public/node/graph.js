import { IObject } from "./object.js";
import { INode, NODES_REGISTRY } from "./node.js";
import { ISocket } from "./socket.js";

class IGraph extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.IGraph",
        displayName: "Graph"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null } = {}) {

        super({ uuid, outer });

        this.nodes = {};
        this.values = {};

    }

    addNode(nodeClass, nodeUUID) {

        const uuid = nodeUUID || crypto.randomUUID();

        if(!nodeClass) return null;
        if(this.getNodeByUUID(uuid)) return null;
        if(!NODES_REGISTRY.isRegistered(nodeClass.meta.className)) return null;

        const node = new nodeClass({ uuid: uuid , outer: this });
        this.nodes[uuid] = node;

        return node;

    }
    
    getNodeByUUID(nodeUUID) {
        return this.nodes[nodeUUID];
    }

    removeNodeByUUID(nodeUUID) {
        return this.removeNode(this.getNodeByUUID(nodeUUID));
    }

    removeNode(node) {

        if(!node) return null;

        const inSockets = node.input;
        for(const socketUUID in inSockets) {
            const socket = inSockets[socketUUID];
            this.clearSocketLinks(socket);
        }

        const outSockets = node.output;
        for(const socketUUID in outSockets) {
            const socket = outSockets[socketUUID];
            this.clearSocketLinks(socket);
        }

        delete this.nodes[node.getUUID()];

        return true;

    }

    clearSocketLinksByUUID(nodeUUID, socketUUID) {

        const node = this.getNodeByUUID(nodeUUID);
        if(!node) return;

        const socket = node.getSocket(socketUUID);
        if(!socket) return;

        return this.clearSocketLinks(socket);

    }
    clearSocketLinks(socket) {

        if(!socket) return;

        socket.links.forEach(linkedSockets => {
            linkedSockets.unlink(socket);
        });

        socket.unlinkAll();
        
        return true;

    }
    
    unlinkNodesSocketsByUUID(sourceNodeUUID, sourceSocketUUID, targetNodeUUID, targetSocketUUID) {

        const sourceNode = this.getNodeByUUID(sourceNodeUUID);
        const targetNode = this.getNodeByUUID(targetNodeUUID);

        this.unlinkSocketsByUUID(sourceNode, sourceSocketUUID, targetNode, targetSocketUUID);
        
    }

    unlinkSocketsByUUID(sourceNode, sourceSocketUUID, targetNode, targetSocketUUID) {
        
        if(!sourceNode || !targetNode) {
            console.error("Invalid target or source node");
            return;
        }

        const sourceSocket = sourceNode.getOutputSocket(sourceSocketUUID);
        const targetSocket = targetNode.getInputSocket(targetSocketUUID);

        return this.unlinkSockets(sourceSocket, targetSocket);

    }

    unlinkSockets(sourceSocket, targetSocket) {

        if(!sourceSocket || !targetSocket) {
            console.error("Invalid target or source socket");
            return;
        }

        sourceSocket.unlink(targetSocket);
        targetSocket.unlink(sourceSocket);

        return true;

    }

    linkNodesSocketsByUUID(sourceNodeUUID, sourceSocketUUID, targetNodeUUID, targetSocketUUID) {
        
        const sourceNode = this.getNodeByUUID(sourceNodeUUID);
        const targetNode = this.getNodeByUUID(targetNodeUUID);

        this.linkSocketsByUUID(sourceNode, sourceSocketUUID, targetNode, targetSocketUUID);

    }
    linkSocketsByUUID(sourceNode, sourceSocketUUID, targetNode, targetSocketUUID) {
        
        if(!sourceNode || !targetNode) {
            console.error("Invalid target or source node");
            return;
        }

        const sourceSocket = sourceNode.getOutputSocket(sourceSocketUUID);
        const targetSocket = targetNode.getInputSocket(targetSocketUUID);

        return this.linkSockets(sourceSocket, targetSocket);
        
    }
    linkSockets(sourceSocket, targetSocket) {

        if(!sourceSocket || !targetSocket) {
            console.error("Invalid target or source socket");
            return;
        }

        if(sourceSocket == targetSocket) {
            console.error("Source and target socket are the same");
            return;
        }

        if(!sourceSocket.canLinkTo(targetSocket) || !targetSocket.canLinkTo(sourceSocket)) {
            console.error("Cannot connect socket");
            return;
        }

        sourceSocket.link(targetSocket);
        targetSocket.link(sourceSocket);

        console.warn(`Sockets Linked ${sourceSocket.getUUID()} <--> ${targetSocket.getUUID()}`);

        return true;

    }

    executeNode(nodeUUID) {
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