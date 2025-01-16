import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "./dispatcher.js";

import { ISocket } from "../node/socket";

class UISocket extends H12 {
    constructor() {
        
        super();

        this.links = [];
        this.isocket = null;

    }
    main() {

    }
    render() {
        
        if(!this.args.iobject) return <><label>Invalid socket</label></>;
        this.isocket = this.args.iobject;
        
        const meta = this.isocket.getMeta();
        const name = this.isocket.getName() ||  meta.displayName;
        const color = meta.displayColor || "gray";

        return <>
            <div class="px-[8px] relative">
                <label style="font-size: 10px;">{ name }</label>
                <button id="btn" style={ `background-color: ${color};` } class={ `absolute w-3 h-3 ${this.isocket.type == ISocket.TYPES.OUTPUT ? "-right-[6px]" : "-left-[6px]"} top-[4px] rounded border-2 border-zinc-800` } onclick={ this.clearLinks } onmouseleave={ this.removeActiveHoverSocket } onmouseover={ this.createActiveHoverSocket } onmousedown={ this.createActiveSocket }></button>
            </div>
        </>;

    }

    clearLinks() {

        if(this.isocket.type != ISocket.TYPES.INPUT) return;
        dispatcher.call("clearLinkedSockets", this);

    }
    removeLinks() {

        this.links.forEach(link => {
            link.remove();
        });
        this.links = [];
        
    }
    getPinElement() {
        return this.element.btn;
    }

    getUINode() {
        return this.parent;
    }

    getISocket() {
        return this.isocket;
    }
    getIUUID() {
        return this.isocket.getUUID();
    }
    
    addLink(link) {
        this.links.push(link);
    }

    createActiveHoverSocket() {
        if(this.isocket.type == ISocket.TYPES.INPUT) {
            dispatcher.call("createActiveHoverSocket", this);
        }
    }
    
    removeActiveHoverSocket() {
        if(this.isocket.type == ISocket.TYPES.INPUT) {
            dispatcher.call("removeActiveHoverSocket", this);
        }
    }

    createActiveSocket(event) {

        if(this.isocket.type !== ISocket.TYPES.OUTPUT) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const reference = this;
        const socket = this.root;

        if(socket) {

            dispatcher.call("createHelperLine", reference);
            dispatcher.call("createActiveSocket", reference);
    
            window.addEventListener("mousemove", onDragMove);
            window.addEventListener("mouseup", onDragStop);

            function onDragMove(event) {

                event.stopPropagation();
                event.preventDefault();

                dispatcher.call("updateHelperLine", { socket: reference, event: event });
        
            };
    
            function onDragStop(event) {

                event.stopPropagation();
                event.preventDefault();
        
                window.removeEventListener("mousemove", onDragMove);
                window.removeEventListener("mouseup", onDragStop);
    
                dispatcher.call("removeHelperLine", reference);
                dispatcher.call("removeActiveSocket", reference);
        
            };
    
        }


    }



}

export { UISocket }