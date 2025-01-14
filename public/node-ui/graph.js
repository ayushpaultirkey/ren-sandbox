import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";

import { IGraph } from "../node/graph.js";
import { INode } from "../node/node.js";
import { UINode } from "./node.js";
import { Link } from "./link.js";
import VIEWPORT from "./viewport.js";
import Drag from "./drag.js";


class UIGraph extends H12 {

    constructor() {
        
        super();
        this.igraph = null;

        this.activeSocket = null;
        this.activeHoverSocket = null;
        this.helperLinks = {};

    }

    main(args = {}) {

        this.registerActiveSocket();
        this.registerHelperLine();
        this.registerActiveHoverSocket();

        Drag(this.root, this.parent.element.viewport, this.parent.element.viewport, true);

    }

    render() {

        if(!this.args.iobject) return <><label>Invalid graph</label></>;
        this.igraph = this.args.iobject;

        return <>
            <div class="absolute" onmousewheel={ this.zoom }>
                <div id="frame" class="frame border-2 border-zinc-500 absolute w-[650px] h-[450px]">
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
        
        if(event.deltaY > 0) {
            this.zoomOut();
        }
        else {
            this.zoomIn();
        }

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



    addUINode(nodeClass, nodeUUID, nodeValue, x = 20, y = 20) {

        const node = this.igraph.addNode(nodeClass, nodeUUID, nodeValue);
        if(!node) {
            console.error("Failed to add node");
            return false;
        };
        
        const { nodes } = this.key;
        nodes(<><node args id={ node.getUUID() } x={ x } y={ y } iobject={ node } alias={ UINode }></node></>, "x++");

    }




























    getIGraph() {
        return this.igraph;
    }
    getIGraphUUID() {
        return this.igraph.getUUID();
    }
    getIGraphEntryNode() {
        return this.igraph.getEntryNode();
    }

    getUINode(nodeUUID) {
        return this.child[nodeUUID];
    }

    linkUINodes(uiSourceNode, uiSourceSocket, uiTargetNode, uiTargetSocket) {

        const iNodeA = uiSourceNode.getINode();
        const iNodeB = uiTargetNode.getINode();
        const iSocketAUUID = uiSourceSocket.getIUUID();
        const iSocketBUUID = uiTargetSocket.getIUUID();

        if(!iNodeA || !iNodeB || !iSocketAUUID || !iSocketBUUID) return false;

        const success = this.igraph.linkSocketsByUUID(iNodeA, iSocketAUUID, iNodeB, iSocketBUUID);
        if(!success) {
            console.error("Failed to link nodes");
            return false;
        };
        
        const link = new Link({ source: uiSourceSocket, target: uiTargetSocket, graph: this });
        const line = link.create();

        this.helperLinks[link.uuid] = line;

        this.element.backGraph.append(line);

        console.warn("connected");

        return true;

    }


    removeUINode(uiNode) {

        if(!uiNode) return false;
        const inode = uiNode.getINode();

        if(!inode) return false;

        const inSockets = inode.input;
        const outSockets = inode.output;

        for(const socketUUID in inSockets) {
            console.log(uiNode.child[socketUUID]);
            uiNode.child[socketUUID].removeLinks()
        };
        for(const socketUUID in outSockets) {
            console.warn(uiNode.child[socketUUID]);
            uiNode.child[socketUUID].removeLinks();
        };

        const success = this.igraph.removeNode(inode);
        if(!success) {
            console.error("Failed to remove node");
            return false;
        };

        console.log("removed node");
        uiNode.destroy();

        return true;

    }

    clearUINodeSockets(uiSocket) {

        const isocket = uiSocket.getISocket();
        if(!isocket) return;

        const success = this.igraph.clearSocketLinks(isocket);
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

        dispatcher.bind("createHelperLine", (e, socket) => {

            const socketID = socket.id;
            const { topGraph } = this.element;
    
            const line = <><line svg x1={ 0 } y1={ 0 } x2={ 0 } y2={ 0 } style="stroke:rgb(59,130,246);stroke-width:2;" class="path"></line></>;
        
            topGraph.append(line);
            this.helperLinks[socketID] = line;

        });

        dispatcher.bind("updateHelperLine", (e, { socket, event }) => {

            const scale = VIEWPORT.zoom;
            const socketID = socket.id;
            const socketRoot = socket.getPinElement();

            const { x: parentX, y: parentY } = this.root.getBoundingClientRect();
            const { x, y, width, height } = socketRoot.getBoundingClientRect();

            const x1 = (x - parentX + width / 2) / scale;
            const y1 = (y - parentY + height / 2) / scale;

            const line = this.helperLinks[socketID];
            if(line) {

                line.setAttributeNS(null, "x1", x1);
                line.setAttributeNS(null, "y1", y1);
                line.setAttributeNS(null, "x2", (event.clientX - parentX) / scale);
                line.setAttributeNS(null, "y2", (event.clientY - parentY) / scale);

            }

        });
        dispatcher.bind("removeHelperLine", (e, socket) => {

            const socketID = socket.id;
            const helperLink = this.helperLinks[socketID];

            if(!helperLink) return;
            helperLink.remove();

            delete this.helperLinks[socketID];

        });
    }
    registerActiveSocket() {


        dispatcher.bind("createActiveSocket", (e, socket) => {
            this.activeSocket = socket;
            console.log(this.activeSocket);
        });

        dispatcher.bind("removeActiveSocket", (e, socket) => {

            const osocket = this.activeSocket;
            const isocket = this.activeHoverSocket;

            this.activeSocket = null;
            this.activeHoverSocket = null;

            if(isocket && osocket) {
                this.linkUINodes(osocket.getUINode(), osocket, isocket.getUINode(), isocket);
            }

        });

        dispatcher.bind("clearLinkedSockets", (e, socket) => {
            if(!socket) return;
            this.clearUINodeSockets(socket);
        });

    }
    registerActiveHoverSocket() {
        dispatcher.bind("createActiveHoverSocket", (e, socket) => {
            if(this.activeSocket) {
                this.activeHoverSocket = socket;
                console.log(this.activeHoverSocket);
            }
        });
        dispatcher.bind("removeActiveHoverSocket", (e, socket) => {
            if(this.activeSocket) {
                this.activeHoverSocket = null;
                console.log(this.activeHoverSocket);
            }
        });
    }



}

export { UIGraph };