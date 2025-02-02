import H12 from "@library/h12.js";

import { IGraph } from "@vm/graph.js";
import VIEWPORT from "../config/viewport.js";
import { ZoomHandler } from "../handler/zoom-handler.js";
import { DragHandler } from "../handler/drag-handler.js";
import { UINode } from "./node.js";
import { UISocket } from "./socket.js";
import { Link } from "../widget/graph/link.js";
import { getWorkspace } from "@script/app/library/workspace.js";

// import { UINode } from "./node.js";
// import { UISocket } from "./socket.js";
// import { Link } from "./link.js";

class UIGraph extends H12 {

    /** @type {IGraph} */
    #igraph = null;

    /** @type {ZoomHandler} */
    #zoomHandler = null;

    /** @type {DragHandler} */
    #dragHandler = null;

    /** @type {import("@script/editor/project/workspace.js").Workspace} */
    #workplace = null;

    constructor() {
        
        super();

        /** @type {UISocket} */
        this.sourceSocket = null;

        /** @type {UISocket} */
        this.targetSocket = null;

        /** @type {Map<string, SVGLineElement>} */
        this.helperLinks = new Map();


    }

    main(args = {}) {

        if(!this.#igraph) {
            return;
        };

        this.#workplace = getWorkspace(this);

        this.#registerViewport();
        this.#registerHandlers();
        this.#registerDispatchers();
        
        this.#displayNodes();
        this.#displayLinks();

    }

    render() {

        if(!this.args.iobject) return <><label>Invalid graph</label></>;
        this.#igraph = this.args.iobject;

        if(this.#igraph.custom.x == null) this.#igraph.custom.x = 0;
        if(this.#igraph.custom.y == null) this.#igraph.custom.y = 0;
        if(this.#igraph.custom.z == null) this.#igraph.custom.z = 1;

        const x = Math.round(this.#igraph.custom.x);
        const y = Math.round(this.#igraph.custom.y);
        const z = VIEWPORT.zoom = parseFloat(this.#igraph.custom.z);

        return <>
            <div class="absolute" style={ `left: ${x}px; top: ${y}px; transform: scale(${z});` }>
                <div id="frame" class="frame absolute">
                    { this.#createSVG("backGraph") }
                    <div>
                        {nodes}
                    </div>
                    { this.#createSVG("topGraph") }
                </div>
            </div>
        </>;

    }

    #createSVG(id) {
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
        });

    }

    #displayLink(link = {}) {
        
        const uiSourceNode = this.child[link.sourceNode];
        const uiTargetNode = this.child[link.targetNode];

        if(!uiSourceNode || !uiTargetNode) {
            console.error("Invalid source or target nodes");
            return;
        };

        const uiSourceSocket = uiSourceNode.child[link.sourceSocket];
        const uiTargetSocket = uiTargetNode.child[link.targetSocket];

        if(!uiSourceSocket || !uiTargetSocket) {
            console.error("Invalid source or target socket");
            return;
        };

        const uiLink = new Link({ source: uiSourceSocket, target: uiTargetSocket, graph: this });
        const uiLine = uiLink.create();
        this.element.backGraph.append(uiLine);

    }

    #registerViewport() {

        const { frame } = this.element;
        frame.style.width = VIEWPORT.size.width + "px";
        frame.style.height = VIEWPORT.size.height + "px";

    }

    #registerHandlers() {

        this.#zoomHandler = new ZoomHandler(this.root);
        this.#zoomHandler.onZoom = () => {
            this.#igraph.custom.z = VIEWPORT.zoom;
        };
        this.#zoomHandler.register();

        this.#dragHandler = new DragHandler(this.root, this.parent.element.viewport, this.parent.element.viewport);
        this.#dragHandler.isFrame = true;
        this.#dragHandler.gridSize = 1;
        this.#dragHandler.onDragEnd = () => {

            const x = this.root.style.left.replace("px", "");
            const y = this.root.style.top.replace("px", "");
    
            this.#igraph.custom["x"] = Math.round(x);
            this.#igraph.custom["y"] = Math.round(y);

        };
        this.#dragHandler.register();

    }
    
    #registerDispatchers() {

        if(!this.#workplace) {
            console.error("Invalid workplace");
            return;
        };

        this.#registerNodeDispatcher();
        this.#registerSocketDispatcher();

    }

    #registerNodeDispatcher() {

        this.#workplace.dispatcher.on("addNode", (nodeClass) => {
            this.#igraph.addNode(null, { class: nodeClass });
        });

        this.#igraph.dispatcher.on("nodeAdded", (node) => {
            console.warn(`UIGraph: Node ${node.uuid} added`);
            this.#displayNode(node);
        });

    }

    #registerSocketDispatcher() {

        const { topGraph } = this.element;
        const dispatcher = this.#workplace.dispatcher;

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
    
            const line = <><line svg x1={ 0 } y1={ 0 } x2={ 0 } y2={ 0 } style={ `stroke:${color};stroke-width:2;` } class="socket-link"></line></>;
        
            topGraph.append(line);
            this.helperLinks.set(socketID, line);

        });
        dispatcher.on("updateSocketHelper", ({ socketId, socketElement, x, y }) => {

            const line = this.helperLinks.get(socketId);
            if(line) {

                const scale = VIEWPORT.zoom;
    
                const { x: parentX, y: parentY } = this.root.getBoundingClientRect();
                const { x: socketX, y: socketY, width, height } = socketElement.getBoundingClientRect();
    
                const x1 = (socketX - parentX + width / 2) / scale;
                const y1 = (socketY - parentY + height / 2) / scale;
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
        dispatcher.on("clearAllSocketLinks", (socket) => {

            if(!socket) return;

            const isocket = socket.isocket;
            if(!isocket) return;

            const success = this.#igraph.clearAllSocketLinks(isocket);
            if(!success) {
                console.error("Failed to clear socket");
                return;
            };

            socket.clearLinks();
            console.warn("Cleared all sockets links");

        });
        this.#igraph.dispatcher.on("socketsLinked", ({ sourceNode, sourceSocket, targetNode, targetSocket }) => {
            this.#displayLink({
                sourceNode: sourceNode,
                sourceSocket: sourceSocket,
                targetNode: targetNode,
                targetSocket: targetSocket,
            });
        });


        dispatcher.on("createTargetSocket", (socket) => {
            if(this.sourceSocket) {
                this.targetSocket = socket;
                console.warn(`Target socket set to ${socket.id}`);
            }
        });
        dispatcher.on("clearTargetSocket", (socket) => {
            if(this.sourceSocket) {
                this.targetSocket = null;
                console.warn("Target socket cleared");
            }
        });

    }

    destroy() {
        
        if(this.#workplace) {

            const dispatcher = this.#workplace.dispatcher;

            dispatcher.clear("addNode");

            dispatcher.clear("createSocketHelper");
            dispatcher.clear("updateSocketHelper");
            dispatcher.clear("clearSocketHelper");

            dispatcher.clear("createSourceSocket");
            dispatcher.clear("clearSourceSocket");
            
            dispatcher.clear("createTargetSocket");
            dispatcher.clear("clearTargetSocket");

            dispatcher.clear("clearAllInputLinks");

        }

        if(this.#igraph) {
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
            this.#igraph.custom["z"] = parseFloat(VIEWPORT.zoom).toFixed(4);

            this.#dragHandler.unregister();

        }

        super.destroy();

    }

    removeNode(uiNode) {

        if(!uiNode || !uiNode.inode) {
            console.error("Invalid node");
            return;
        };

        if(!this.#igraph.removeNode(uiNode.inode)) {
            console.error("Failed to remove node");
            return;
        };
        
        uiNode.destroy();
        console.warn("removed node");

        return true;

    }


}

export { UIGraph };