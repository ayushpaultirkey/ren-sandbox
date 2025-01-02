import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/h12/dispatcher";

class Pin extends H12 {
    constructor() {

        super();
        this.uid = crypto.randomUUID();

        this.links = [];
        this.linkLimit = -1;
        
        this.type = -1;
        this.validTypes = new Set([]);

    }
    static TYPES = {
        EXEC: 1,
        INT: 2
    }
    static SIDE = {
        INPUT: 0,
        OUTPUT: 1
    }

    getLinkNode(index = 0) {
        try {
            return this.links[index].input.parent;
        }
        catch(error) {
            return null;
        }
    }

    /** * @param {Pin} pin */
    canConnect(pin) {
        
        const { validTypes, linkLimit, links } = this;

        if(pin == this) {
            console.error("self pin");
            return;
        }

        if(this.links.includes(pin)) {
            console.error("already connected");
            return;
        };

        if(!pin) {
            console.error("Invalid pin");
            return;
        };

        if(!validTypes.has(pin.type)) {
            console.error("Invalid pin type");
            return;
        };

        const linkCount = links.length;
        if(linkCount >= linkLimit && linkLimit != -1) {
            console.error("Link limit failed");
            return;
        };

        return true;

    }
    /** * @param {Pin} pin */
    connect(link) {
        this.links.push(link);
    }
    disconnect() {
        this.links = [];
    }
    render() {
        const title = this.args.title || "in";
        return <>
            <span>
                <button onclick={ this.onClick } class="text-green-500" onmouseup={ this.onMouseUp } onmousedown={ this.mouseDown }>{ title }</button>
            </span>
        </>;
    }
}


class PinX extends Pin {
    constructor() {
        super();
    }

    createActiveHoverPin() {
        if(this.args.side == Pin.SIDE.INPUT) {
            dispatcher.call("createActiveHoverPin", this);
        }
    }
    removeActiveHoverPin() {
        if(this.args.side == Pin.SIDE.INPUT) {
            dispatcher.call("removeActiveHoverPin", this);
        }
    }
    removeLinks() {
        if(this.args.side == Pin.SIDE.INPUT) {
            this.links.forEach(link => {
                link.remove();
            });
        }
    }


    createActivePin(event) {

        if(this.args.side !== Pin.SIDE.OUTPUT) {
            return;
        }

        event.stopPropagation();
        event.preventDefault();

        const reference = this;
        const { pin } = this.element;

        if(pin) {

            dispatcher.call("createHelperLine", reference);
            dispatcher.call("createActivePin", reference);
    
            window.addEventListener("mousemove", onDragMove);
            window.addEventListener("mouseup", onDragStop);

            function onDragMove(event) {

                event.stopPropagation();
                event.preventDefault();

                dispatcher.call("updateHelperLine", { pin: reference, event: event });
        
            };
    
            function onDragStop(event) {

                event.stopPropagation();
                event.preventDefault();
        
                window.removeEventListener("mousemove", onDragMove);
                window.removeEventListener("mouseup", onDragStop);
    
                dispatcher.call("removeHelperLine", reference);
                dispatcher.call("removeActivePin", reference);
        
            };
    
        }


    }
}


class ExecPin extends PinX {
    constructor() {
        super();
        this.type = Pin.TYPES.EXEC;
        this.validTypes = new Set([ Pin.TYPES.EXEC ]);
    }
    main() {
        if(this.args.side == Pin.SIDE.OUTPUT) {
            this.linkLimit = 1;
        }
    }
    render() {
        const title = this.args.side == Pin.SIDE.INPUT ? "in" : "out";
        return <>
            <span>
                <button id="pin" onclick={ this.removeLinks } class="text-green-500" onmouseleave={ this.removeActiveHoverPin } onmouseover={ this.createActiveHoverPin } onmousedown={ this.createActivePin }>{ title }</button>
            </span>
        </>;
    }
}

class IntPin extends PinX {
    constructor() {
        super();
        this.type = Pin.TYPES.INT;
        this.validTypes = new Set([ Pin.TYPES.INT ]);
    }
    render() {
        const title = this.args.title || "int";
        return <>
            <span>
                <button id="pin" onclick={ this.removeLinks } class="text-blue-500" onmouseleave={ this.removeActiveHoverPin } onmouseover={ this.createActiveHoverPin } onmousedown={ this.createActivePin }>{ title }</button>
            </span>
        </>;
    }
}


export { Pin, ExecPin, IntPin }