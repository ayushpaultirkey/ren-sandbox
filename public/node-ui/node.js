import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";
import Drag from "./drag";

import { INode } from "../node/node";
import { ISocket } from "../node/socket";
import { ExecPin } from "../node/pins/exec";
import { UISocket } from "./socket";

class UINode extends H12 {
    constructor() {
        super();
        this.inode = null;
    }
    main(args = {}) {
        
        // Drag(this.root, this.root);

        Drag(this.root, this.root, this.parent.root, false);
        this.renderPins();

        if(this.inode) {
            this.inode.customExport = () => {
                const { x, y } = this.root.getBoundingClientRect();
                return {
                    x: x,
                    y: y
                };
            }
        }

    }
    render() {
        
        if(!this.args.iobject) return <><label>Invalid node</label></>;
        this.inode = this.args.iobject;

        const name = this.inode.getMeta().displayName || "Node";
        const x = this.args.x || 5;
        const y = this.args.y || 5;
        
        return <>
            <div class="bg-zinc-800 text-zinc-100 border border-zinc-600 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px; min-width: 100px;` }>
                <div class="flex flex-row px-2 py-1 space-x-1 text-zinc-300">
                    <div class="flex-grow flex items-center space-x-1">
                        <i>[f]</i>
                        <label id="handle" class="">{ name }</label>
                    </div>
                    <button class="text-red-700 font-bold" onclick={ this.removeNode }>&times;</button>
                </div>
                <div class="flex flex-row w-full">
                    <div class="w-full relative">
                        {input}
                    </div>
                    <div class="w-full relative text-right">
                        {output}
                    </div>
                </div>
            </div>
        </>;

    }
    
    removeNode() {
        this.parent.removeUINode(this);
    }

    renderPins() {

        const { input, output } = this.key;
        const inPins = this.inode.input;
        const OutPins = this.inode.output;

        input("");
        for(const pinUUID in inPins) {
            const pin = inPins[pinUUID];
            const name = pin.getName() || pin.getMeta().displayName;
            input(<>
                <pin args alias={ UISocket } title={ name } id={ pin.getUUID() } iobject={ pin }></pin>
            </>, "x++");
        }

        output("");
        for(const pinUUID in OutPins) {
            const pin = OutPins[pinUUID];
            const name = pin.getName() || pin.getMeta().displayName;
            console.log(pin.getName());
            output(<>
                <pin args alias={ UISocket } title={ name } id={ pin.getUUID() } iobject={ pin }></pin>
            </>, "x++");
        }

    }

    addInputPin(pinName, pinUUID, pinClass, pinSubType) {

        const pin = this.inode.addInputPin(pinUUID, pinClass, pinSubType);
        if(!pin) return "";

        return <>
            <pin args alias={ UISocket } title={ pinName || "in" } id={ pin.getUUID() } iobject={ pin }></pin>
        </>;

    }
    addOutputPin(pinName, pinUUID, pinClass, pinSubType) {

        const pin = this.inode.addOutputPin(pinUUID, pinClass, pinSubType);
        if(!pin) return "";

        return <>
            <pin args alias={ UISocket } title={ pinName || "out" } id={ pin.getUUID() } iobject={ pin }></pin>
        </>;

    }

    getINode() {
        return this.inode;
    }

    getUISocket(socketUUID) {
        return this.child[socketUUID];
    }

}

export { UINode };