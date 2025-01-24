import H12 from "@library/h12.js";

import { INode } from "@vm/node";
import { ISocket } from "@vm/socket";
import { UISocket } from "./socket";
import { DragHandler } from "../handler/drag-handler";
import { PROPERTY_REGISTRY, UIProperty } from "./property";
import { FloatSocket, StringSocket } from "@vm/sockets/primitive";
import { Icon } from "@script/app/control/icon";
import { mdiClose, mdiPlay } from "@mdi/js";


class UINode extends H12 {

    /** @type {INode} */
    #inode = null;
    get inode() {
        return this.#inode;
    }

    /** @type {DragHandler} */
    #dragHandler = null;

    constructor() {
        super();
    }
    main(args = {}) {
        
        if(!this.#inode) {
            return;
        }
       
        this.#dragHandler = new DragHandler(this.root, this.root, this.parent.root);
        this.#dragHandler.onDragEnd = () => {

            const x = this.root.style.left.replace("px", "");
            const y = this.root.style.top.replace("px", "");
    
            this.#inode.custom["x"] = Math.round(x) || 5;
            this.#inode.custom["y"] = Math.round(y) || 5;

        };

        this.#dragHandler.register();

        this.#displaySockets();
        this.renderProperties();

    }

    render() {
        
        if(!this.args.iobject) return <><label>Invalid node</label></>;
        this.#inode = this.args.iobject;

        if(this.#inode.custom.x == null) this.#inode.custom.x = 5;
        if(this.#inode.custom.y == null) this.#inode.custom.y = 5;
        
        const x = Math.round(this.#inode.custom.x);
        const y = Math.round(this.#inode.custom.y);
        
        const meta = this.#inode.meta;
        const name = this.#inode.name || meta.displayName || "Node";

        const canCache = meta.canCache ? "cache" : "non-cache";
        const isEntry = this.#inode.isEntry ? <><button class="node-action fill-green-600" onclick={ () => { this.#inode.execute() } }><Icon args path={ mdiPlay }></Icon></button></> : "";


        return <>
            <div class={ `node ${canCache}` } style={ `top: ${y}px; left: ${x}px; min-width: 100px;` }>
                
                <div id="header" class="node-title">
                    <div class={ `${canCache}` }>
                        <label id="handle">{ name }</label>
                        { isEntry }
                    </div>
                    <button class="node-close" onclick={ this.removeNode }>
                        <Icon args path={ mdiClose }></Icon>
                    </button>
                </div>

                <div id="socket" class="node-socket">
                    <div class="input">
                        {inputs}
                    </div>
                    <div class="output">
                        {outputs}
                    </div>
                </div>

                <div id="nodeProperties" class="node-property hidden" onmousedown={ (e) => e.stopPropagation() }>
                    {properties}
                </div>

            </div>
        </>;

    }
    
    removeNode() {
        this.parent.removeNode(this);
    }

    renderProperties() {

        const { nodeProperties } = this.element;
        const { properties: uiProperties } = this.key;
        const properties = this.#inode.propertyManager.properties;

        uiProperties("");

        for(const [uuid, property] of properties) {

            if(!property) continue;
            
            const type = property.type;
            if(!type) continue;

            const propertyClass = PROPERTY_REGISTRY[type];
            if(!propertyClass) continue;

            uiProperties(<>
                <div class="flex flex-col">
                    <label class="text-xs font-semibold">{ property.custom.name || "Property" }:</label>
                    <property args alias={ propertyClass } iobject={ property }></property>
                </div>
            </>, "x++");

        };
    
        if(properties.size > 0) {
            nodeProperties.classList.remove("hidden");
        };

    }

    #displaySockets() {

        const { inputs, outputs } = this.key;
        const inSockets = this.#inode.inputs;
        const outSockets = this.#inode.outputs;
        
        inputs("");
        for(const uuid in inSockets) {
            this.#displaySocket(inputs, inSockets[uuid]);
        };

        outputs("");
        for(const uuid in outSockets) {
            this.#displaySocket(outputs, outSockets[uuid]);
        };

    }

    #displaySocket(uiSocket, socket) {
        uiSocket(<>
            <socket args alias={ UISocket } id={ socket.uuid } iobject={ socket }></socket>
        </>, "x++");
    }

    addOutputSocket(uuid) {

        const node = this.#inode;
        const socket = node.addOutput(uuid, "out", StringSocket, true);
        
        const { outputs } = this.key;
        this.#displaySocket(outputs, socket);

    }
    
    removeSocket(isocket) {

        const uuid = isocket.uuid;

        if(isocket.type == ISocket.TYPES.INPUT) {
            this.#inode.removeInput(uuid);
        }
        else {
            this.#inode.removeOutput(uuid);
        };
        this.child[uuid].destroy();

    }

    destroy() {

        if(this.#dragHandler) {

            const x = this.root.style.left.replace("px", "");
            const y = this.root.style.top.replace("px", "");
    
            this.#inode.custom["x"] = Math.round(x) || 5;
            this.#inode.custom["y"] = Math.round(y) || 5;
    
            this.#dragHandler.unregister();
            
        }

        super.destroy();

    }

}

export { UINode };