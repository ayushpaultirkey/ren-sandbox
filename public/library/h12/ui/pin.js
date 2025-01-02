import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/h12/dispatcher";


class GNodePin extends H12 {
    constructor() {

        super();
        this.pid = H12.raid();

        this.lines = [];
        this.links = [];
        this.linkLimit = -1;

        this.connections = [];
        
        this.type = -1;
        this.validTypes = new Set([]);
        
    }
    static TYPES = {
        EXEC_OUT: 0,
        EXEC_IN: 0
    }
    getLinkedParent(index = 0) {

        return this.links[index].parent;
        // const link = Object.keys(this.links)[index];
        // if(link) {
        //     return this.links[link].parent;
        // };

    }
    render() {
        const title = this.args.title || "title";
        return <>
            <span>
                <button class="text-green-500">{ title }</button>
            </span>
        </>;
    }
    mouseDown(event) {

        const reference = this;
        const { pin } = this.element;

        if(pin && !this.isConnected) {

            const lineId = crypto.randomUUID();
            const { x, y, width, height } = pin.getBoundingClientRect();
            const RX = x + (width / 2);
            const RY = y + (height / 2);

            dispatcher.call("createTempLine", { id: lineId, x1: RX, y1: RY, x2: RX, y2: RY });
            dispatcher.call("socketDragStart", reference);
    
            window.addEventListener("mousemove", onDragMove);
            window.addEventListener("mouseup", onDragStop);

            function onDragMove(event) {
            
                dispatcher.call("updateTempLine", { id: lineId, x1: RX, y1: RY, x2: event.clientX, y2: event.clientY });
                dispatcher.call("socketDragging");
        
            };
    
            function onDragStop(event) {
        
                window.removeEventListener("mousemove", onDragMove);
                window.removeEventListener("mouseup", onDragStop);
    
                dispatcher.call("removeTempLine", lineId);
                dispatcher.call("socketDragEnd", reference);
        
            };
    
        }


    }
    /** * @param {GNodePin} pin */
    canConnect(pin) {
        
        if(!pin) {
            console.error("Invalid pin");
            return;
        };

        if(this.parent == pin.parent) {
            console.error("Pin have same parent");
            return;
        };

        if(!this.validTypes.has(pin.type)) {
            console.error("Invalid pin type");
            return;
        };

        const linkCount = this.links.length;
        if(linkCount >= this.linkLimit && this.linkLimit != -1) {
            console.error("Link limit failed");
            return;
        };

        return true;

    }
    /** * @param {GNodePin} pin */
    connect(pin) {

        // if(!this.canConnect(pin)) {
        //     console.error("Link condition failed");
        //     return;
        // };

        this.links.push(pin);

        return true;

    }
    addLine(line) {
        this.lines.push(line);
    }
    disconnect() {
        this.links = [];
    }
}
class GNodePinExecIn extends GNodePin {
    constructor() {
        super();
        this.type = GNodePin.TYPES.EXEC_IN;
        this.validTypes = new Set([ GNodePin.TYPES.EXEC_OUT ]);
    }
    main() {
        
    }
    render() {
        const title = this.args.title || "in";
        return <>
            <div>
                <button onclick={ this.onClick } class="text-green-500" onmouseup={ this.onMouseUp } onmousedown={ this.mouseDown }>{ title }</button>
            </div>
        </>;
    }
    onMouseUp() {
        dispatcher.call("socketDragEnd", this);
    }
    onClick() {
        dispatcher.call("pinDisconnect", this);
    }
}
class GNodePinExecOut extends GNodePin {
    constructor() {
        super();

        this.linkLimit = 1;
        this.type = GNodePin.TYPES.EXEC_OUT;
        this.validTypes = new Set([ GNodePin.TYPES.EXEC_IN ]);

    }
    render() {
        const title = this.args.title || "out";
        return <>
            <div class="text-right bg-red-300">
                <button id="pin" class="text-red-500" onmouseup={ this.onMouseUp } onmousedown={ this.mouseDown }>{ title }</button>
            </div>
        </>;
    }
}

export { GNodePin, GNodePinExecIn, GNodePinExecOut }