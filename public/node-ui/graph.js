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


class UIGraph extends H12 {

    /** @type {IGraph} */
    #igraph = null;

    /** @type {ZoomHandler} */
    #zoomHandler = null;

    /** @type {DragHandler} */
    #dragHandler = null;

    constructor() {
        
        super();

        this.activeSocket = null;
        this.activeHoverSocket = null;
        this.helperLinks = {};

        this.mouseLocation = { x: 0, y: 0 };

    }

    main(args = {}) {

        // this.registerActiveSocket();
        // this.registerHelperLine();
        // this.registerActiveHoverSocket();
        if(!this.#igraph) {
            return;
        };

        this.#registerHandlers();
        this.#registerDispatchers();
        
        this.#displayNodes();


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
            <node args alias={ UINode } iobject={ node }></node>
        </>);
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
    }

    #registerNodeDispatchers() {
        dispatcher.on("addNode", (nodeClass) => {
            this.#igraph.addNode(null, { class: nodeClass });
        });

        const { nodes: uiNodes } = this.key;
        this.#igraph.dispatcher.on("nodeAdded", (node) => {
            console.warn(`UIGraph: Node ${node.uuid} added`);
            this.#displayNode(node);
        });
    }

    render() {

        if(!this.args.iobject) return <><label>Invalid graph</label></>;
        this.#igraph = this.args.iobject;

        // const ui = this.args.ui;
        // const x = ui.x || 0;
        // const y = ui.y || 0;
        // const scale = ui.zoom || 1;
        // VIEWPORT.zoom = scale;

        return <>
            <div class="absolute" style={ `left: ${0}px; top: ${0}px; transform: scale(${1});` }>
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
    zoom(event) {

        event.preventDefault();

        const root = this.root;
        const rect = root.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const zoomDelta = event.deltaY > 0 ? -0.05 : 0.05;

        const newZoom = Math.min(
            Math.max(VIEWPORT.zoom + zoomDelta, VIEWPORT.zoomMin),
            VIEWPORT.zoomMax
        );

        const scaleDelta = newZoom / VIEWPORT.zoom;

        const offsetX = mouseX - mouseX * scaleDelta;
        const offsetY = mouseY - mouseY * scaleDelta;

        root.style.transform = `scale(${newZoom})`;
        root.style.left = `${(parseFloat(root.style.left || 0) || 0) + offsetX}px`;
        root.style.top = `${(parseFloat(root.style.top || 0) || 0) + offsetY}px`;

        VIEWPORT.zoom = newZoom;

        dispatcher.call("onZoom", VIEWPORT.zoom);

    }
    zoomIn() {
        VIEWPORT.zoom = (VIEWPORT.zoom + 0.1) > VIEWPORT.zoomMax ? VIEWPORT.zoomMax : VIEWPORT.zoom + 0.05;
        this.root.style.transform = `scale(${VIEWPORT.zoom})`;
        dispatcher.call("onZoom", VIEWPORT.zoom);
    }
    zoomOut() {
        VIEWPORT.zoom -= (VIEWPORT.zoom - 0.1) < VIEWPORT.zoomMin ? 0 : 0.05;
        this.root.style.transform = `scale(${VIEWPORT.zoom})`;
        dispatcher.call("onZoom", VIEWPORT.zoom);
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

    // clearUINodeSockets(uiSocket) {

    //     const isocket = uiSocket.getISocket();
    //     if(!isocket) return;

    //     const success = this.igraph.clearSocketLinks(isocket);
    //     if(!success) {
    //         console.error("Failed to clear socket");
    //         return false;
    //     };

    //     uiSocket.removeLinks();
    //     console.log("cleared socket");

    //     return true;

    // }

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
    // registerHelperLine() {

    //     dispatcher.bind("createHelperLine", (e, socket) => {

    //         const socketID = socket.id;
    //         const { topGraph } = this.element;

    //         let color = "#3b82f6";
    //         const isocket = socket.isocket;
    //         if(isocket) {
    //             const meta = isocket.getMeta();
    //             if(meta) {
    //                 color = meta.displayColor;
    //             }
    //         }
    
    //         const line = <><line svg x1={ 0 } y1={ 0 } x2={ 0 } y2={ 0 } style={ `stroke:${color};stroke-width:2;` } class="path"></line></>;
        
    //         topGraph.append(line);
    //         this.helperLinks[socketID] = line;

    //     });

    //     dispatcher.bind("updateHelperLine", (e, { socket, event }) => {

    //         const scale = VIEWPORT.zoom;
    //         const socketID = socket.id;
    //         const socketRoot = socket.getPinElement();

    //         const { x: parentX, y: parentY } = this.root.getBoundingClientRect();
    //         const { x, y, width, height } = socketRoot.getBoundingClientRect();

    //         const x1 = (x - parentX + width / 2) / scale;
    //         const y1 = (y - parentY + height / 2) / scale;

    //         const line = this.helperLinks[socketID];
    //         if(line) {

    //             line.setAttributeNS(null, "x1", x1);
    //             line.setAttributeNS(null, "y1", y1);
    //             line.setAttributeNS(null, "x2", (event.clientX - parentX) / scale);
    //             line.setAttributeNS(null, "y2", (event.clientY - parentY) / scale);

    //         }

    //     });
    //     dispatcher.bind("removeHelperLine", (e, socket) => {

    //         const socketID = socket.id;
    //         const helperLink = this.helperLinks[socketID];

    //         if(!helperLink) return;
    //         helperLink.remove();

    //         delete this.helperLinks[socketID];

    //     });
    // }
    // registerActiveSocket() {


    //     dispatcher.bind("createActiveSocket", (e, socket) => {
    //         this.activeSocket = socket;
    //         console.log(this.activeSocket);
    //     });

    //     dispatcher.bind("removeActiveSocket", (e, socket) => {

    //         const osocket = this.activeSocket;
    //         const isocket = this.activeHoverSocket;

    //         this.activeSocket = null;
    //         this.activeHoverSocket = null;

    //         if(isocket && osocket) {
    //             this.linkUINodes(osocket.getUINode(), osocket, isocket.getUINode(), isocket);
    //         }

    //     });

    //     dispatcher.bind("clearLinkedSockets", (e, socket) => {
    //         if(!socket) return;
    //         this.clearUINodeSockets(socket);
    //     });

    // }
    // registerActiveHoverSocket() {
    //     dispatcher.bind("createActiveHoverSocket", (e, socket) => {
    //         if(this.activeSocket) {
    //             this.activeHoverSocket = socket;
    //             console.log(this.activeHoverSocket);
    //         }
    //     });
    //     dispatcher.bind("removeActiveHoverSocket", (e, socket) => {
    //         if(this.activeSocket) {
    //             this.activeHoverSocket = null;
    //             console.log(this.activeHoverSocket);
    //         }
    //     });
    // }

    destroy() {

        if(this.#igraph) {
            dispatcher.clear("addNode");
            this.#igraph.dispatcher.clear("nodeAdded");
        }
        if(this.#zoomHandler) {
            this.#zoomHandler.unregister();
        }
        if(this.#dragHandler) {
            this.#dragHandler.unregister();
        }

        super.destroy();

    }


}

export { UIGraph };