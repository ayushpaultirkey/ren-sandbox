import { Data } from "./data.js";
import { Node } from "./node.js";
import { Pin } from "./pin.js";

class Graph extends Data {
    constructor(uid) {
        super(uid);
        this.nodes = {};
        graphs[this.uid] = this;
    }
    createNode(name, node, data) {
        this.nodes[name] = new node(name, this, data);
    }
    getNode(name) {
        return this.nodes[name];
    }
}

const graphs = {};

export { Graph, graphs };