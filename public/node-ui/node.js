import H12 from "@library/h12.js";
import { dispatcher } from "../editor/dispatcher.js";
//import Drag from "./drag";

import { INode } from "../node/node";
import { ISocket } from "../node/socket";
import { UISocket } from "./socket";
import { DragHandler } from "../editor/handler/drag-handler.js";
import { UIProperty, PROPERTY_REGISTRY } from "./property.js";

class UINode extends H12 {

    /** @type {INode} */
    #inode = null;

    /** @type {DragHandler} */
    #dragHandler = null;

    constructor() {
        super();
    }
    main(args = {}) {
        
        if(!this.#inode) {
            return;
        }

        // Drag(this.root, this.root, this.parent.root, false);
       
        this.#dragHandler = new DragHandler(this.root, this.root, this.parent.root);
        this.#dragHandler.register();

        this.renderSockets();
        this.renderProperties();

        // if(this.inode) {
        //     this.inode.customExport = () => {
        //         const { x: parentX, y: parentY } = this.parent.root.getBoundingClientRect();
        //         const { x, y } = this.root.getBoundingClientRect();
        //         return {
        //             x: Math.round(x - parentX),
        //             y: Math.round(y - parentY)
        //         };
        //     }
        // }

        // const { header, socket, values } = this.element;
        // dispatcher.bind("onZoom", (e, zoom) => {
        //     if(zoom < 0.6) {
        //         header.classList.add("invisible");
        //         socket.classList.add("invisible");
        //         values.classList.add("invisible");
        //     }
        //     else {
        //         header.classList.remove("invisible");
        //         socket.classList.remove("invisible");
        //         values.classList.remove("invisible");
        //     }
        // })

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

        const canCache = meta.canCache ? "" : "";

        return <>
            <div class={ `bg-zinc-800 rounded-sm text-zinc-500 border-2 ${meta.canCache ? "border-sky-800" : "border-teal-800"} text-xs absolute font-semibold select-none py-1` } style={ `top: ${y}px; left: ${x}px; min-width: 100px;` }>
                
                <div id="header" class="flex flex-row text-zinc-400 px-2 space-x-2">
                    <div class={ `flex-grow flex items-center space-x-1 ${meta.canCache ? "text-sky-600" : "text-teal-600"}` }>
                        <label id="handle">{ name }</label>
                    </div>
                    <button class="text-rose-700 font-extrabold hidden" onclick={ this.removeNode }>&times;</button>
                </div>

                <div id="socket" class="flex flex-row w-full">
                    <div class="w-full relative">
                        {inputs}
                    </div>
                    <div class="w-full relative text-right">
                        {outputs}
                    </div>
                </div>

                <div id="values" class="px-1" onmousedown={ (e) => e.stopPropagation() }>
                    {properties}
                </div>

            </div>
        </>;

    }
    
    // removeNode() {
    //     this.parent.removeUINode(this);
    // }

    renderProperties() {

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
                <property args alias={ propertyClass } iobject={ property }></property>
            </>, "x++");

        }

    }

    renderSockets() {

        const { inputs, outputs } = this.key;
        const inSockets = this.#inode.inputs;
        const outSockets = this.#inode.outputs;
        
        inputs("");
        for(const uuid in inSockets) {
            const socket = inSockets[uuid];
            inputs(<>
                <pin args alias={ UISocket } id={ socket.uuid } iobject={ socket }></pin>
            </>, "x++");
        }

        outputs("");
        for(const uuid in outSockets) {
            const socket = outSockets[uuid];
            outputs(<>
                <pin args alias={ UISocket } id={ socket.uuid } iobject={ socket }></pin>
            </>, "x++");
        }

    }


    // getINode() {
    //     return this.inode;
    // }

    // getUISocket(socketUUID) {
    //     return this.child[socketUUID];
    // }

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