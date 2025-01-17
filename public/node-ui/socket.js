import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "./dispatcher.js";

import { ISocket } from "../node/socket";

class UISocket extends H12 {

    /** @type {ISocket} */
    #isocket = null;

    constructor() {
        
        super();

        this.links = [];

    }
    main() {

    }
    render() {
        
        if(!this.args.iobject) return <><label>Invalid socket</label></>;
        this.#isocket = this.args.iobject;
        
        const meta = this.#isocket.meta;
        const name = this.#isocket.name ||  meta.displayName;
        const color = meta.displayColor || "gray";
        const isOutput = this.#isocket.type == ISocket.TYPES.OUTPUT;

        return <>
            <div class="px-[8px] relative" onmouseover={ this.#createTargetSocket } onmouseleave={ this.#clearTargetSocket }>
                <label style="font-size: 10px;">{ name }</label>
                <button
                    id="btn"
                    style={ `background-color: ${color};` } 
                    class={ `absolute w-3 h-3 ${isOutput ? "-right-[6px]" : "-left-[6px]"} top-[4px] rounded border-2 border-zinc-800` }
                    onclick={ this.#clearAllInputLinks }
                    onmousedown={ this.#createSourceSocket }>
                </button>
            </div>
        </>;

    }

    #clearAllInputLinks() {

        if(this.#isocket.type != ISocket.TYPES.INPUT) return;
        dispatcher.emit("clearAllInputLinks", this);
        
    }

    clearLinks() {
        this.links.forEach(link => {
            link.remove();
        });
        this.links = [];
    }

    getPinElement() {
        return this.element.btn;
    }

    get isocket() {
        return this.#isocket;
    }

    getUINode() {
        return this.parent;
    }

    getISocket() {
        return this.#isocket;
    }
    getIUUID() {
        return this.#isocket.uuid;
    }
    
    addLink(link) {
        this.links.push(link);
    }


    #createTargetSocket() {
        if(this.#isocket.type == ISocket.TYPES.INPUT) {
            dispatcher.emit("createTargetSocket", this);
        }
    }
    #clearTargetSocket() {
        if(this.#isocket.type == ISocket.TYPES.INPUT) {
            dispatcher.emit("clearTargetSocket", this);
        }
    }
    #createSourceSocket(event) {

        if(this.#isocket.type !== ISocket.TYPES.OUTPUT) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const reference = this;
        const socket = this.root;
        const pin = this.getPinElement();

        if(socket) {

            dispatcher.emit("createSocketHelper", reference);
            dispatcher.emit("createSourceSocket", reference);
    
            window.addEventListener("mousemove", onDragMove);
            window.addEventListener("mouseup", onDragStop);

            function onDragMove(event) {

                event.stopPropagation();
                event.preventDefault();

                dispatcher.emit("updateSocketHelper", {
                    socketId: reference.id,
                    socketPin: pin,
                    x: event.clientX,
                    y: event.clientY
                });
        
            };
    
            function onDragStop(event) {

                event.stopPropagation();
                event.preventDefault();
        
                window.removeEventListener("mousemove", onDragMove);
                window.removeEventListener("mouseup", onDragStop);
    
                dispatcher.emit("clearSocketHelper", reference.id);
                dispatcher.emit("clearSourceSocket", reference);
        
            };
    
        }

    }



}

export { UISocket }