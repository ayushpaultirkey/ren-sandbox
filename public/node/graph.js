import { IObject } from "./object.js";
import { INode, NODES_REGISTRY } from "./node.js";
import { IPropertyManager } from "./property/manager.js";

class IGraph extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.IGraph",
        displayName: "Graph"
    }

    /** @type {Map<string, INode>} */
    #nodes = new Map();

    /** @type {IPropertyManager} */
    #propertyManager = null;

    constructor({ uuid = crypto.randomUUID(), outer = null, name = null } = {}) {

        super({ uuid, outer, name });
        this.#propertyManager = new IPropertyManager({ outer: this });

    }

    get nodes() {
        return this.#nodes;
    }
    get propertyManager() {
        return this.#propertyManager;
    }

    main({ properties = {}, nodes = {}, links = [] } = {}) {

        for(const name in properties) {
            const property = properties[name];

            const type = property.type;
            const value = property.value;
            const custom = property.custom;

            this.#propertyManager.addProperty(name, type, value, custom);
        }

        for(const uuid in nodes) {
            const node = nodes[uuid];
            this.addNode(uuid, node);
        }

        for(const link of links) {
            const sourceNode = this.getNode(link.sourceNode);
            const targetNode = this.getNode(link.targetNode);
            this.linkSocketsByUUID(sourceNode, link.sourceSocket, targetNode, link.targetSocket);
        }

        return true;

    }

    addNode(nodeUUID, nodeData = { class: null, values: {} }) {
        try {

            const uuid = nodeUUID || crypto.randomUUID();
    
            if(this.#nodes.has(uuid)) {
                throw new Error(`Graph: Node "${uuid}" already exists`);
            };
            if(!nodeData || !nodeData.class) {
                throw new Error(`Graph: Node class is required`);
            };

            const nodeClass = NODES_REGISTRY.get(nodeData.class);

            if(!nodeClass) {
                throw new Error(`Graph: Node class "${nodeData.class}" is not registered`);
            };
    
            const node = new nodeClass({ uuid: uuid , outer: this });
            node.main({
                values: nodeData.values || {}
            });
    
            this.#nodes.set(uuid, node);

            this.dispatcher.emit("nodeAdded", node);
    
            return node;

        }
        catch(error) {
            console.error(error);
        }
    }
    
    getNode(nodeUUID) {
        return this.#nodes.get(nodeUUID);
    }

    removeNodeByUUID(nodeUUID) {
        const node = this.getNode(nodeUUID);
        return this.removeNode(node);
    }

    removeNode(node) {

        if(!node) return null;

        const inSockets = node.inputs;
        for(const socketUUID in inSockets) {
            const socket = inSockets[socketUUID];
            this.clearSocketLinks(socket);
        }

        const outSockets = node.outputs;
        for(const socketUUID in outSockets) {
            const socket = outSockets[socketUUID];
            this.clearSocketLinks(socket);
        }

        this.#nodes.delete(node.uuid);

        return true;

    }

    clearSocketLinksByUUID(nodeUUID, socketUUID) {

        const node = this.getNode(nodeUUID);
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

        const sourceNode = this.getNode(sourceNodeUUID);
        const targetNode = this.getNode(targetNodeUUID);

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
        
        const sourceNode = this.getNode(sourceNodeUUID);
        const targetNode = this.getNode(targetNodeUUID);

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

        console.warn(`Sockets Linked ${sourceSocket.uuid} <--> ${targetSocket.uuid}`);

        return true;

    }

    executeNode(nodeUUID) {
        const node = this.getNode(nodeUUID);
        if(!node) return;
        node.execute();
    }

    getEntryNode() {
        return Object.values(this.nodes).find(node => node.isEntry === true);
    }

    customExport() { return {}; }
    export() {

        let nodes = {};
        let links = [];
        let entry = null;
        let success = true;
        let custom = this.customExport();

        // for(const nodeUUID in this.#nodes) {

        //     const node = this.nodes[nodeUUID];
        //     const nodeData = node.export();

        //     nodes[nodeUUID] = nodeData.data;
        //     links.push(...nodeData.links); 

        //     if(node.isEntry) {
        //         if(entry) {
        //             success = false;
        //             break;
        //         };
        //         entry = nodeUUID;
        //     }

        // }

        // if(!success) {
        //     console.error("Multiple entry found");
        //     return;
        // };

        // const exportData = { graphUUID: this.getUUID(), entryNodeUUID: entry, nodes: nodes, links: links, ...custom };

        // return exportData;

    }

}

export { IGraph };