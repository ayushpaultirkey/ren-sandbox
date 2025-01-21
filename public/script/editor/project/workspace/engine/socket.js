import H12 from "@library/h12";
import { ISocket } from "@vm/socket.js";
import { getWorkplace } from "@script/library/workplace";

class UISocket extends H12 {

    /** @type {ISocket} */
    #isocket = null;

    /** @type {import("@script/editor/project/workspace").Workspace} */
    #workspace = null;

    /** @type {Link[]} */
    #links = [];

    #lastTouch = null;

    constructor() {
        super();
    }

    main() {

        if(!this.#isocket) {
            console.error("Invalid socket");
            return;
        };
        this.#workspace = getWorkplace(this);

    }

    removeButton() {
        return this.#isocket.isRuntime ? <><button class="text-xs font-semibold text-rose-500 mr-1" onclick={ this.#removeSocket }>&times;</button></> : "";
    }

    render() {
        
        if(!this.args.iobject) return <><label>Invalid socket</label></>;
        this.#isocket = this.args.iobject;
        
        const meta = this.#isocket.meta;
        const name = this.#isocket.name ||  meta.displayName;
        const color = meta.displayColor || "gray";
        const isOutput = this.#isocket.type == ISocket.TYPES.OUTPUT;

        return <>
            <div class="px-[8px] relative"
                onmouseover={ this.#createTargetSocket }
                onmouseleave={ this.#clearTargetSocket }
                socketuuid={ this.#isocket.uuid }
                nodeuuid={ this.#isocket.outer.uuid }>
                <span>
                    { ... this.removeButton() }
                </span>
                <label>{ name }</label>
                <button
                    id="btn"
                    onclick={ this.#clearAllSocketLinks }
                    ontouchstart={ this.#createSourceSocket }
                    onmousedown={ this.#createSourceSocket }
                    style={ `background-color: ${color};` }
                    class={ `absolute w-3 h-3 ${isOutput ? "-right-[6px]" : "-left-[6px]"} top-[4px] rounded border-2 border-zinc-800` }>
                </button>
            </div>
        </>;

    }

    #removeSocket() {
        if(this.#isocket.isRuntime) {
            this.#workspace.dispatcher.emit("clearAllSocketLinks", this);
            this.parent.removeSocket(this.#isocket);
        };
    }

    #clearAllSocketLinks() {

        if(this.#isocket.type != ISocket.TYPES.INPUT || !this.#workspace) {
            console.error("Invalid socket or workspace");
            return;
        };
        this.#workspace.dispatcher.emit("clearAllSocketLinks", this);
        
    }

    clearLinks() {

        this.#links.forEach(link => {
            link.remove();
        });
        this.#links = [];
        
    }


    get isocket() {
        return this.#isocket;
    }

    getSocketElement() {
        return this.element.btn;
    }
    addLink(link) {
        this.#links.push(link);
    }


    #createTargetSocket() {
        if(this.#isocket.type == ISocket.TYPES.INPUT) {
            this.#workspace.dispatcher.emit("createTargetSocket", this);
        };
    }
    #clearTargetSocket() {
        if(this.#isocket.type == ISocket.TYPES.INPUT) {
            this.#workspace.dispatcher.emit("clearTargetSocket", this);
        };
    }

    #createSourceSocket(event) {

        if(this.#isocket.type !== ISocket.TYPES.OUTPUT || !this.#workspace) {
            return;
        };

        event.stopPropagation();
        event.preventDefault();

        const dispatcher = this.#workspace.dispatcher;
        const reference = this;
        const socket = this.root;
        const element = this.getSocketElement();

        if (event.type === "touchstart") {
            if (event.touches.length === 1) {
                this.#lastTouch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            }
        }

        if(socket) {

            dispatcher.emit("createSocketHelper", reference);
            dispatcher.emit("createSourceSocket", reference);
    
            if (event.type === "mousedown") {
                window.addEventListener("mousemove", onDragMove);
                window.addEventListener("mouseup", onDragStop);
            }
            else if (event.type === "touchstart") {
                window.addEventListener("touchmove", onTouchMove);
                window.addEventListener("touchend", onTouchStop);
            }

            function onDragMove(event) {

                event.stopPropagation();
                event.preventDefault();

                dispatcher.emit("updateSocketHelper", {
                    socketId: reference.id,
                    socketElement: element,
                    x: event.clientX,
                    y: event.clientY
                });
        
            };

            function onTouchMove(event) {

                if (event.touches.length === 1) {
                    const touch = event.touches[0];
                    const deltaX = touch.clientX - reference.#lastTouch.x;
                    const deltaY = touch.clientY - reference.#lastTouch.y;

                    dispatcher.emit("updateSocketHelper", {
                        socketId: reference.id,
                        socketElement: element,
                        x: touch.clientX,
                        y: touch.clientY
                    });

                    reference.#lastTouch = { x: touch.clientX, y: touch.clientY };
                }

                event.stopPropagation();
                event.preventDefault();

            };
    
            function onDragStop(event) {

                event.stopPropagation();
                event.preventDefault();
        
                window.removeEventListener("mousemove", onDragMove);
                window.removeEventListener("mouseup", onDragStop);
    
                dispatcher.emit("clearSocketHelper", reference.id);
                dispatcher.emit("clearSourceSocket", reference);
        
            };

            function onTouchStop(event) {

                event.stopPropagation();
                event.preventDefault();

                window.removeEventListener("touchmove", onTouchMove);
                window.removeEventListener("touchend", onTouchStop);

                dispatcher.emit("clearSocketHelper", reference.id);
                dispatcher.emit("clearSourceSocket", reference);

                const x = reference.#lastTouch.x;
                const y = reference.#lastTouch.y;
                const ele = document.elementsFromPoint(x, y);

                ele.forEach(el => {
                    if(el.hasAttribute("socketuuid") && el.hasAttribute("nodeuuid")) {
                        console.log(el.getAttribute("socketuuid"), el.getAttribute("nodeuuid"));
                        return;
                    }
                });

            };
    
        }

    }

    destroy() {
        this.clearLinks();
        super.destroy();
    }

}

export { UISocket }
