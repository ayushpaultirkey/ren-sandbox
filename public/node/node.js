import { IObject } from "./object.js";
import { ISocket } from "./socket.js";

class INode extends IObject {

    /** @type {IObject.meta} */
    static meta = {
        className: "IObject.INode",
        displayName: "Node"
    }

    constructor({ uuid = crypto.randomUUID(), outer = null } = {}) {
        super({ uuid, outer });
        this.input = {};
        this.output = {};
        this.isEntry = false;
    }
    
    
    addInputSocket(socketUUID, socketClass, socketSubType) {
        
        if(!socketClass) return null;
        if(this.input[socketUUID]) return null;

        const socket = new socketClass({ uuid: socketUUID, outer: this, type: ISocket.TYPES.INPUT, subType: socketSubType });
        this.input[socketUUID] = socket;

        return socket;

    }
    addOutputSocket(socketUUID, socketClass, socketSubType) {

        if(!socketClass) return null;
        if(this.output[socketUUID]) return null;

        const socket = new socketClass({ uuid: socketUUID, outer: this, type: ISocket.TYPES.OUTPUT, subType: socketSubType });
        this.output[socketUUID] = socket;

        return socket;
        
    }
    getInputSocket(socketUUID) {
        return this.input[socketUUID];
    }
    getOutputSocket(socketUUID) {
        return this.output[socketUUID];
    }
    getSocket(socketUUID) {
        return this.getInputSocket(socketUUID) || this.getOutputSocket(socketUUID);
    }


    execute() {}
    executeLinkedNode(socketUUID, linkIndex = 0) {

        const socket = this.getSocket(socketUUID);

        if(socket && socket.isLinked(linkIndex)) {
            const node = socket.getLinkedNode(linkIndex);
            if(node) {
                node.execute();
            }
        }

    }


    customExport() { return null; }
    export() {
        
        let links = [];

        for(const socketUUID in this.output) {
            const socket = this.output[socketUUID];
            links = links.concat(socket.export());
        }

        return {
            data: {
                class: this.getMeta().className, ... this.customExport()
            },
            links: links
        };

    }

}

const REGISTERED_NODES = {};
const NODES_REGISTRY = {
    register: function(classId, nodeClass) {
        REGISTERED_NODES[classId] = nodeClass;
    },
    registerMany: function(nodes = {}) {
        for(const classId in nodes) {
            this.register(classId, nodes[classId]);
        }
    },
    unregister: function(classId) {
        delete REGISTERED_NODES[classId];
    },
    get: function(classId) {
        return REGISTERED_NODES[classId];
    },
    getAll: function() {
        return REGISTERED_NODES;
    },
    isRegistered: function(classId) {
        return classId in REGISTERED_NODES;
    },
};

export { INode, NODES_REGISTRY };