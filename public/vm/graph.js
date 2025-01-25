import { IObject } from "./object.js";
import { INode, NODES_REGISTRY } from "./node.js";
import { IPropertyManager } from "./property/manager.js";
import { ISocket } from "./socket.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "./types/default.js";
import { IProperty } from "./property.js";

class IGraph extends IObject {

    /** @type {{ className: string, displayName: string}} */
    static meta = {
        className: "IObject.IGraph",
        displayName: "Graph"
    }

    /** @type {Map<string, INode>} */
    #nodes = new Map();
    get nodes() {
        return this.#nodes;
    }

    /** @type {IPropertyManager} */
    #propertyManager = null;
    get propertyManager() {
        return this.#propertyManager;
    }

    /** @type {[{ sourceNode: string, sourceSocket: string, targetNode: string, targetSocket: string }]} */
    #links = [];
    get links() {
        return this.#links;
    }

    /** @type {IPropertyManager} */
    #inputs = null;
    get inputs() {
        return this.#inputs;
    }

    /** @type {IPropertyManager} */
    #outputs = null;
    get outputs() {
        return this.#outputs;
    }

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "Graph" } = {}) {

        super({ uuid, outer, name });

        this.#inputs = new IPropertyManager({ outer: this });
        this.#outputs = new IPropertyManager({ outer: this });

        this.custom = {};
        this.#propertyManager = new IPropertyManager({ outer: this });

    }

    main({ properties = {}, nodes = {}, links = [], custom = {} } = {}) {

        this.custom = custom || {};
        this.custom.name = custom.name || this.name;

        this.#propertyManager.main(properties || {});

        for(const uuid in nodes) {
            const node = nodes[uuid];
            this.addNode(uuid, node);
        }

        for(const link of links) {
            const sourceNode = this.getNode(link.sourceNode);
            const targetNode = this.getNode(link.targetNode);
            this.linkSocketsByUUID(sourceNode, link.sourceSocket, targetNode, link.targetSocket);
        }

        this.#inputs.addProperty("args0", USER_DEFINED_TYPES.OBJECT, {}, { name: "args?" });
        this.#outputs.addProperty("args0", USER_DEFINED_TYPES.OBJECT, {}, { name: "args?" });

        return true;

    }

    addOutput(uuid, name, type) {
        
        const newUUID = uuid || crypto.randomUUID();

        if(this.outputs[newUUID]) return;
        this.outputs[newUUID] = {
            name: name,
            type: type
        };

        return newUUID;

    }
    getOutputs() {
        return this.outputs;
    }

    addNode(nodeUUID, nodeData = { class: null, properties: {}, custom: {} }) {
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
    
            /** @type {INode} */
            const node = new nodeClass({ uuid: uuid , outer: this });
            node.main({
                properties: nodeData.properties,
                custom: nodeData.custom || {},
                inputs: nodeData.inputs || {},
                outputs: nodeData.outputs || {},
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
            this.clearAllSocketLinks(socket);
        };

        const outSockets = node.outputs;
        for(const socketUUID in outSockets) {
            const socket = outSockets[socketUUID];
            this.clearAllSocketLinks(socket);
        };

        this.#nodes.delete(node.uuid);

        this.dispatcher.emit("nodeRemoved", node);

        return true;

    }

    clearAllSocketLinksByUUID(nodeUUID, socketUUID) {

        const node = this.getNode(nodeUUID);
        if(!node) return;

        const socket = node.getSocket(socketUUID);
        if(!socket) return;

        return this.clearAllSocketLinks(socket);

    }

    clearAllSocketLinks(socket) {

        if(!socket) return;

        const targetSocket = socket.uuid;
        const targetNode = socket.outer.uuid;

        socket.links.forEach(linkedSockets => {
            
            const sourceSocket = linkedSockets.uuid;
            const sourceNode = linkedSockets.outer.uuid;

            linkedSockets.unlink(socket);

            this.#links = this.#links.filter(link => !(link.sourceNode == sourceNode && link.sourceSocket == sourceSocket && link.targetNode == targetNode && link.targetSocket == targetSocket));

        });

        socket.clear();
        
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

        const sourceSocket = sourceNode.getOutput(sourceSocketUUID);
        const targetSocket = targetNode.getInput(targetSocketUUID);

        return this.linkSockets(sourceSocket, targetSocket);
        
    }
    linkSockets(sourceSocket, targetSocket) {

        if(sourceSocket.type !== ISocket.TYPES.OUTPUT || targetSocket.type !== ISocket.TYPES.INPUT) {
            console.error("Source should be an output socket and target should be an input socket");
            return;
        }

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

        const link = {
            sourceNode: sourceSocket.outer.uuid,
            sourceSocket: sourceSocket.uuid,
            targetNode: targetSocket.outer.uuid,
            targetSocket: targetSocket.uuid
        }

        this.#links.push(link);
        this.dispatcher.emit("socketsLinked", link);
        
        console.warn(`Sockets Linked ${sourceSocket.uuid} <--> ${targetSocket.uuid}`);

        return true;

    }

    executeNode(nodeUUID) {
        const node = this.getNode(nodeUUID);
        if(!node) return;
        node.execute();
    }

    /**
     * 
     * @returns {INode}
     */
    getEntryNode() {
        let node = null;
        this.#nodes.forEach((value) => {
            if(value.isEntry) {
                node = value;
            }
        });
        return node;
    }

    customExport() { return {}; }
    export() {

        let success = true;
        
        const data = {
            entry: null,
            nodes: {},
            links: [],
            properties: this.#propertyManager.export(),
            // inputs: this.#inputs.export(),
            // outputs: this.#outputs.export(),
            custom: this.custom,
        };

        for(const [uuid, node] of this.#nodes) {

            const { data: nodeData, links: nodeLinks } = node.export();
            data.nodes[uuid] = nodeData;
            data.links.push(...nodeLinks);

            if(node.isEntry) {
                if(data.entry) {
                    success = false;
                    break;
                };
                data.entry = uuid;
            };

        };

        if(!success) {
            console.error("Multiple entry found");
            return;
        };

        return data;

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