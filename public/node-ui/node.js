import H12 from "@library/h12.js";
import dispatcher from "@library/h12/dispatcher.js";
import Drag from "./drag";

import { INode } from "../node/node";
import { IPin } from "../node/pin";
import { ExecPin } from "../node/pins/exec";
import { UIPin } from "./pin";

class UINode extends H12 {
    constructor() {
        super();
        this.inode = null;
    }
    main(args = {}) {
        
        Drag(this.root, this.root);

        this.renderPins();

    }
    render() {
        
        this.inode = this.args.iobject;
        this.inode.extendExport = () => {

            const { x: parentX, y: parentY } = this.parent.root.getBoundingClientRect();
            const { x, y } = this.root.getBoundingClientRect();

            return {
                x: x - parentX,
                y: y - parentY
            }

        };

        const x = this.args.x || 5;
        const y = this.args.y || 5;
        const title = this.args.title || "Title";

        return <>
            <div class="bg-zinc-800 w-28 text-zinc-100 border-2 border-green-500 p-1 space-y-1 text-xs absolute font-bold select-none" style={ `top: ${y}px; left: ${x}px;` }>
                <label id="handle" class="mx-1">{ this.inode.getName() }</label>
                <button class="text-red-400" onclick={ this.removeNode }>x</button>
                <div>
                    {input}
                </div>
                <div class="text-right">
                    {output}
                </div>
            </div>
        </>;

    }
    
    removeNode() {
        this.parent.removeUINode(this);
    }

    renderPins() {

        const { input, output } = this.key;
        const inPins = this.inode.in;
        const OutPins = this.inode.out;

        input("");
        for(const pinUUID in inPins) {
            const pin = inPins[pinUUID];
            input(<>
                <pin args alias={ UIPin } title={ pin.getName() || "out" } id={ pin.getUUID() } iobject={ pin }></pin>
            </>, "x++");
        }

        output("");
        for(const pinUUID in OutPins) {
            const pin = OutPins[pinUUID];
            output(<>
                <pin args alias={ UIPin } title={ pin.getName() || "in" } id={ pin.getUUID() } iobject={ pin }></pin>
            </>, "x++");
        }

    }

    addInputPin(pinName, pinUUID, pinClass, pinSubType) {

        const pin = this.inode.addInputPin(pinUUID, pinClass, pinSubType);
        if(!pin) return "";

        return <>
            <pin args alias={ UIPin } title={ pinName || "in" } id={ pin.getUUID() } iobject={ pin }></pin>
        </>;

    }
    addOutputPin(pinName, pinUUID, pinClass, pinSubType) {

        const pin = this.inode.addOutputPin(pinUUID, pinClass, pinSubType);
        if(!pin) return "";

        return <>
            <pin args alias={ UIPin } title={ pinName || "out" } id={ pin.getUUID() } iobject={ pin }></pin>
        </>;

    }

    getINode() {
        return this.inode;
    }

    getUIPin(pinUUID) {
        return this.child[pinUUID];
    }

}

export { UINode };