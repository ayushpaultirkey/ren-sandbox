import H12 from "@library/h12.js";
import { dispatcher } from "./dispatcher.js";

import { IGraph } from "../node/graph.js";
//import { INode } from "../node/node.js";
//import { UINode } from "./node.js";
//import { Link } from "./link.js";
import VIEWPORT from "./viewport.js";
import Drag from "./drag.js";
import { UINode } from "./node.js";
import { ZoomHandler } from "./handler/zoom-handler.js";
import { DragHandler } from "./handler/drag-handler.js";
import { UISocket } from "./socket.js";
import { Link } from "./link.js";


class UIGraph extends H12 {

    /** @type {IGraph} */
    #igraph = null;

    /** @type {ZoomHandler} */
    #zoomHandler = null;

    /** @type {DragHandler} */
    #dragHandler = null;

    constructor() {
        
        super();

        /** @type {UISocket} */
        this.sourceSocket = null;

        /** @type {UISocket} */
        this.targetSocket = null;

        /** @type {Map<string, SVGLineElement>} */
        this.helperLinks = new Map();

        this.mouseLocation = { x: 0, y: 0 };

    }

    main(args = {}) {

        if(!this.#igraph) {
            return;
        };

        this.#registerHandlers();
        this.#registerDispatchers();
        
        this.#displayNodes();
        this.#displayLinks();


        const { frame } = this.element;
        frame.style.width = VIEWPORT.size.width + "px";
        frame.style.height = VIEWPORT.size.height + "px";

        this.#igraph.customExport = () => {
            const { x: parentX, y: parentY } = this.parent.element.viewport.getBoundingClientRect();
            const { x, y } = this.root.getBoundingClientRect();
            return {
                position: {
                    x: Math.round(x - parentX),
                    y: Math.round(y - parentY),
                    zoom: VIEWPORT.zoom
                }
            }
        }

    }

    #displayNodes() {
        this.set("{nodes}", "");
        
        const nodes = this.#igraph.nodes;
        for(const [uuid, node] of nodes) {
            this.#displayNode(node);
        }
    }
    #displayNode(node) {
        this.set("{nodes}++", <>
            <node args alias={ UINode } id={ node.uuid } iobject={ node }></node>
        </>);
    }
    #displayLinks() {
        queueMicrotask(() => {
            const links = this.#igraph.links;
            for(const link of links) {
                this.#displayLink(link);
            }
        })
    }
    #displayLink(link = {}) {
        
        const uiSourceNode = this.child[link.sourceNode];
        const uiTargetNode = this.child[link.targetNode];

        const uiSourceSocket = uiSourceNode.child[link.sourceSocket];
        const uiTargetSocket = uiTargetNode.child[link.targetSocket];

        const uiLink = new Link({ source: uiSourceSocket, target: uiTargetSocket, graph: this });
        const uiLine = uiLink.create();
        this.element.backGraph.append(uiLine);

    }

    #registerHandlers() {

        this.#zoomHandler = new ZoomHandler(this.root);
        this.#zoomHandler.register();

        this.#dragHandler = new DragHandler(this.root, this.parent.element.viewport, this.parent.element.viewport);
        this.#dragHandler.isFrame = true;
        this.#dragHandler.gridSize = 1;
        this.#dragHandler.register();

    }
    
    #registerDispatchers() {

        this.#registerNodeDispatchers();
        this.registerActiveSocket();
        this.registerHelperLine();

        this.registerTargetSocket();

    }
    #registerNodeDispatchers() {
        dispatcher.on("addNode", (nodeClass) => {
            this.#igraph.addNode(null, { class: nodeClass });
        });
        this.#igraph.dispatcher.on("nodeAdded", (node) => {
            console.warn(`UIGraph: Node ${node.uuid} added`);
            this.#displayNode(node);
        });
    }

    render() {

        if(!this.args.iobject) return <><label>Invalid graph</label></>;
        this.#igraph = this.args.iobject;

        if(this.#igraph.custom.x == null) this.#igraph.custom.x = 0;
        if(this.#igraph.custom.y == null) this.#igraph.custom.y = 0;
        if(this.#igraph.custom.z == null) this.#igraph.custom.z = 1;

        const x = Math.round(this.#igraph.custom.x);
        const y = Math.round(this.#igraph.custom.y);
        const z = VIEWPORT.zoom = this.#igraph.custom.z;

        return <>
            <div class="absolute" style={ `left: ${x}px; top: ${y}px; transform: scale(${z});` }>
                <div id="frame" class="frame border-2 border-zinc-500 absolute">
                    { this.createSVG("backGraph") }
                    <div>
                        {nodes}
                    </div>
                    { this.createSVG("topGraph") }
                </div>
            </div>
        </>;

    }
    
    recenter() {
        const parent = this.root.parentElement;
        const frame = this.element.frame;
        const parentRect = parent.getBoundingClientRect();
        const frameRect = frame.getBoundingClientRect();
        this.root.style.left = ((parentRect.width / 2) - (frameRect.width / 2)) + "px";
        this.root.style.top = ((parentRect.height / 2) - (frameRect.height / 2)) + "px"; 
    }



    // addUINode(nodeClass, nodeUUID, nodeValue, x = 20, y = 20) {

    //     const node = this.igraph.addNode(nodeClass, nodeUUID, nodeValue);
    //     if(!node) {
    //         console.error("Failed to add node");
    //         return false;
    //     };
        
    //     const { nodes } = this.key;
    //     nodes(<><node args id={ node.getUUID() } x={ x } y={ y } iobject={ node } alias={ UINode }></node></>, "x++");

    // }




























    // getIGraph() {
    //     return this.igraph;
    // }
    // getIGraphUUID() {
    //     return this.igraph.getUUID();
    // }
    // getIGraphEntryNode() {
    //     return this.igraph.getEntryNode();
    // }

    // getUINode(nodeUUID) {
    //     return this.child[nodeUUID];
    // }

    // linkUINodes(uiSourceNode, uiSourceSocket, uiTargetNode, uiTargetSocket) {

    //     const iNodeA = uiSourceNode.getINode();
    //     const iNodeB = uiTargetNode.getINode();
    //     const iSocketAUUID = uiSourceSocket.getIUUID();
    //     const iSocketBUUID = uiTargetSocket.getIUUID();

    //     if(!iNodeA || !iNodeB || !iSocketAUUID || !iSocketBUUID) return false;

    //     const success = this.igraph.linkSocketsByUUID(iNodeA, iSocketAUUID, iNodeB, iSocketBUUID);
    //     if(!success) {
    //         console.error("Failed to link nodes");
    //         return false;
    //     };
        
    //     const link = new Link({ source: uiSourceSocket, target: uiTargetSocket, graph: this });
    //     const line = link.create();

    //     this.helperLinks[link.uuid] = line;

    //     this.element.backGraph.append(line);

    //     console.warn("connected");

    //     return true;

    // }


    // removeUINode(uiNode) {

    //     if(!uiNode) return false;
    //     const inode = uiNode.getINode();

    //     if(!inode) return false;

    //     const inSockets = inode.input;
    //     const outSockets = inode.output;

    //     for(const socketUUID in inSockets) {
    //         console.log(uiNode.child[socketUUID]);
    //         uiNode.child[socketUUID].removeLinks()
    //     };
    //     for(const socketUUID in outSockets) {
    //         console.warn(uiNode.child[socketUUID]);
    //         uiNode.child[socketUUID].removeLinks();
    //     };

    //     const success = this.igraph.removeNode(inode);
    //     if(!success) {
    //         console.error("Failed to remove node");
    //         return false;
    //     };

    //     console.log("removed node");
    //     uiNode.destroy();

    //     return true;

    // }

    clearUINodeSockets(uiSocket) {

        if(!uiSocket) return;

        const isocket = uiSocket.isocket;
        if(!isocket) return;

        const success = this.#igraph.clearSocketLinks(isocket);
        if(!success) {
            console.error("Failed to clear socket");
            return false;
        };

        uiSocket.removeLinks();
        console.log("cleared socket");

        return true;

    }

    createSVG(id) {
        return <>
            <svg width={ VIEWPORT.size.width } height={ VIEWPORT.size.height } id={ id } class="absolute select-none pointer-events-none top-0 left-0">
                <defs svg>
                    <linearGradient alias="linearGradient" svg id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop svg offset="0%" stop-color="white" />
                        <stop svg offset="100%" stop-color="rgba(255,255,255,0.1)" />
                    </linearGradient>
                </defs>
            </svg>
        </>
    }
    registerHelperLine() {

        const { topGraph } = this.element;

        dispatcher.on("createSocketHelper", (socket) => {

            const socketID = socket.id;

            let color = "#3b82f6";
            const isocket = socket.isocket;
            if(isocket) {
                const meta = isocket.meta;
                if(meta) {
                    color = meta.displayColor;
                }
            }
    
            const line = <><line svg x1={ 0 } y1={ 0 } x2={ 0 } y2={ 0 } style={ `stroke:${color};stroke-width:2;` } class="path"></line></>;
        
            topGraph.append(line);
            this.helperLinks.set(socketID, line);

        });
        dispatcher.on("updateSocketHelper", ({ socketId, socketPin, x, y }) => {

            const line = this.helperLinks.get(socketId);
            if(line) {

                const scale = VIEWPORT.zoom;
    
                const { x: parentX, y: parentY } = this.root.getBoundingClientRect();
                const { x: socketX, y: socketY, width, height } = socketPin.getBoundingClientRect();
    
                const x1 = (socketX - parentX + width / 2.5) / scale;
                const y1 = (socketY - parentY + height / 2.5) / scale;
                const x2 = (x - parentX) / scale;
                const y2 = (y - parentY) / scale;

                line.setAttributeNS(null, "x1", x1);
                line.setAttributeNS(null, "y1", y1);
                line.setAttributeNS(null, "x2", x2);
                line.setAttributeNS(null, "y2", y2);

            }

        });
        dispatcher.on("clearSocketHelper", (socketId) => {

            const helperLink = this.helperLinks.get(socketId);

            if(!helperLink) return;
            helperLink.remove();

            this.helperLinks.delete(socketId);

        });
    }
    registerActiveSocket() {

        dispatcher.on("createSourceSocket", (socket) => {
            this.sourceSocket = socket;
            console.warn(`Source socket set to ${socket.id}`);
        });
        dispatcher.on("clearSourceSocket", (socket) => {

            const osocket = this.sourceSocket;
            const isocket = this.targetSocket;

            this.sourceSocket = null;
            this.targetSocket = null;

            if(isocket && osocket) {
                this.#igraph.linkSockets(osocket.isocket, isocket.isocket);
            }

        });
        dispatcher.on("clearAllInputLinks", (socket) => {

            if(!socket) return;

            const isocket = socket.isocket;
            if(!isocket) return;

            const success = this.#igraph.clearAllSocketLinks(isocket);
            if(!success) {
                console.error("Failed to clear socket");
                return;
            };

            socket.clearLinks();
            console.warn("Cleared all input links");

        });
        this.#igraph.dispatcher.on("socketsLinked", ({ sourceNode, sourceSocket, targetNode, targetSocket }) => {
            this.#displayLink({
                sourceNode: sourceNode,
                sourceSocket: sourceSocket,
                targetNode: targetNode,
                targetSocket: targetSocket,
            });
        });
        

    }
    registerTargetSocket() {
        dispatcher.on("createTargetSocket", (socket) => {
            if(this.sourceSocket) {
                this.targetSocket = socket;
                console.log(`Target socket set to ${socket.id}`);
            }
        });
        dispatcher.on("clearTargetSocket", (socket) => {
            if(this.sourceSocket) {
                this.targetSocket = null;
                console.log(`Target socket cleared`);
            }
        });
    }

    destroy() {

        if(this.#igraph) {

            dispatcher.clear("addNode");

            dispatcher.clear("createSocketHelper");
            dispatcher.clear("updateSocketHelper");
            dispatcher.clear("clearSocketHelper");

            dispatcher.clear("createSourceSocket");
            dispatcher.clear("clearSourceSocket");
            
            dispatcher.clear("createTargetSocket");
            dispatcher.clear("clearTargetSocket");

            dispatcher.clear("clearAllInputLinks");

            this.#igraph.dispatcher.clear("nodeAdded");
            this.#igraph.dispatcher.clear("socketsLinked");

        }
        if(this.#zoomHandler) {
            this.#zoomHandler.unregister();
        }
        if(this.#dragHandler) {

            const x = this.root.style.left.replace("px", "");
            const y = this.root.style.top.replace("px", "");
    
            this.#igraph.custom["x"] = Math.round(x);
            this.#igraph.custom["y"] = Math.round(y);
            this.#igraph.custom["z"] = VIEWPORT.zoom;

            this.#dragHandler.unregister();

        }

        super.destroy();

    }


}

export { UIGraph };