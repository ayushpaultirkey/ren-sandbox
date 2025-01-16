import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";
import Drag from "./drag";

import { INode } from "../node/node";
import { ISocket } from "../node/socket";
import { UISocket } from "./socket";
import { UIValue, VALUE_REGISTRY } from "./value";

class UINode extends H12 {
    constructor() {
        super();
        this.inode = null;
    }
    main(args = {}) {
        
        // Drag(this.root, this.root);

        Drag(this.root, this.root, this.parent.root, false);
        this.renderPins();
        this.renderProperties();

        if(this.inode) {
            this.inode.customExport = () => {
                const { x: parentX, y: parentY } = this.parent.root.getBoundingClientRect();
                const { x, y } = this.root.getBoundingClientRect();
                return {
                    x: Math.round(x - parentX),
                    y: Math.round(y - parentY)
                };
            }
        }

        const { header, socket, values } = this.element;
        dispatcher.bind("onZoom", (e, zoom) => {
            if(zoom < 0.6) {
                header.classList.add("invisible");
                socket.classList.add("invisible");
                values.classList.add("invisible");
            }
            else {
                header.classList.remove("invisible");
                socket.classList.remove("invisible");
                values.classList.remove("invisible");
            }
        })

    }

    render() {
        
        if(!this.args.iobject) return <><label>Invalid node</label></>;
        this.inode = this.args.iobject;

        const x = Math.round(this.args.x || 5);
        const y = Math.round(this.args.y || 5);
        const meta = this.inode.getMeta();
        const name = meta.displayName || "Node";

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
                        {input}
                    </div>
                    <div class="w-full relative text-right">
                        {output}
                    </div>
                </div>

                <div id="values" class="px-1" onmousedown={ (e) => e.stopPropagation() }>
                    {values}
                </div>

            </div>
        </>;

    }
    
    removeNode() {
        this.parent.removeUINode(this);
    }
    renderProperties() {

        const { values: uiValues } = this.key;
        const values = this.inode.value;

        uiValues("");

        for(const valueUUID in values) {

            const value = values[valueUUID];
            if(!value) continue;

            const type = value.getType();
            if(!type) continue;

            const valueClass = VALUE_REGISTRY[type];
            if(!valueClass) continue;

            uiValues(<>
                <property args alias={ valueClass } iobject={ value }></property>
            </>, "++x");

        }

    }
    renderPins() {

        const { input, output } = this.key;
        const inPins = this.inode.input;
        const OutPins = this.inode.output;

        input("");
        for(const pinUUID in inPins) {
            const pin = inPins[pinUUID];
            input(<>
                <pin args alias={ UISocket } id={ pin.getUUID() } iobject={ pin }></pin>
            </>, "++x");
        }

        output("");
        for(const pinUUID in OutPins) {
            const pin = OutPins[pinUUID];
            output(<>
                <pin args alias={ UISocket } id={ pin.getUUID() } iobject={ pin }></pin>
            </>, "++x");
        }

    }


    getINode() {
        return this.inode;
    }

    getUISocket(socketUUID) {
        return this.child[socketUUID];
    }

}

export { UINode };