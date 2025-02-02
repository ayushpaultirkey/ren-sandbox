import VIEWPORT from "../../config/viewport.js";



class Link {
    constructor({ source, target, graph } = {}) {

        this.uuid = crypto.randomUUID();
        this.graph = graph;
        this.source = source;
        this.target = target;

        this.line = null;
        this.fOnMouseDown = this.onMouseDown.bind(this);
        this.fOnTouchStart = this.onTouchStart.bind(this);

    }
    remove() {
        this.line.remove();
    }
    getColor() {

        let color = "#3b82f6";

        const isocket = this.source.isocket;
        if(!isocket) return color;

        const meta = isocket.meta;
        if(!meta) return color;
        if(!meta.displayColor) return color;

        return meta.displayColor;

    }
    #createLine(x1, y1, x2, y2) {

        const color = this.getColor();

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttributeNS(null, "x1", x1);
        line.setAttributeNS(null, "y1", y1);
        line.setAttributeNS(null, "x2", x2);
        line.setAttributeNS(null, "y2", y2);
        line.setAttributeNS(null, "style", `stroke:${color};stroke-width:2`);
        line.setAttributeNS(null, "class", "socket-link");
        return line;

    }
    create() {

        const { source, target, graph, fOnMouseDown, fOnTouchStart } = this;

        source.addLink(this);
        target.addLink(this);

        const scale = VIEWPORT.zoom || 1;
        const { x: parentX, y: parentY } = graph.root.getBoundingClientRect();

        const o = source.getSocketElement().getBoundingClientRect();
        const x1 = (o.left - parentX + o.width / 2) / scale;
        const y1 = (o.top - parentY + o.height / 2) / scale;

        const i = target.getSocketElement().getBoundingClientRect();
        const x2 = (i.left - parentX + i.width / 2) / scale;
        const y2 = (i.top - parentY + i.height / 2) / scale;

        source.parent.root.addEventListener("mousedown", fOnMouseDown);
        target.parent.root.addEventListener("mousedown", fOnMouseDown);

        source.parent.root.addEventListener("touchstart", fOnTouchStart);
        target.parent.root.addEventListener("touchstart", fOnTouchStart);

        this.line = this.#createLine(x1, y1, x2, y2);

        return this.line;

    }
    onMouseDown(event) {
        
        const { source, target, graph, line } = this;
        const scale = VIEWPORT.zoom || 1;

        const onDragMove = (e) => {

            const { x: parentX, y: parentY } = graph.root.getBoundingClientRect();
    
            const o = source.getSocketElement().getBoundingClientRect();
            const x1 = (o.left - parentX + o.width / 2) / scale;
            const y1 = (o.top - parentY + o.height / 2) / scale;
    
            const i = target.getSocketElement().getBoundingClientRect();
            const x2 = (i.left - parentX + i.width / 2) / scale;
            const y2 = (i.top - parentY + i.height / 2) / scale;

            line.setAttributeNS(null, "x1", x1);
            line.setAttributeNS(null, "y1", y1);
            line.setAttributeNS(null, "x2", x2);
            line.setAttributeNS(null, "y2", y2);

        };

        const onDragStop = () => {
            window.removeEventListener("mousemove", onDragMove);
            window.removeEventListener("mouseup", onDragStop);
        };

        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", onDragStop);
        
    }
    onTouchStart(event) {

        const { source, target, graph, line } = this;
        const scale = VIEWPORT.zoom || 1;

        const onTouchMove = (e) => {

            const { x: parentX, y: parentY } = graph.root.getBoundingClientRect();
    
            const o = source.getSocketElement().getBoundingClientRect();
            const x1 = (o.left - parentX + o.width / 2) / scale;
            const y1 = (o.top - parentY + o.height / 2) / scale;
    
            const i = target.getSocketElement().getBoundingClientRect();
            const x2 = (i.left - parentX + i.width / 2) / scale;
            const y2 = (i.top - parentY + i.height / 2) / scale;

            line.setAttributeNS(null, "x1", x1);
            line.setAttributeNS(null, "y1", y1);
            line.setAttributeNS(null, "x2", x2);
            line.setAttributeNS(null, "y2", y2);

        };

        const onTouchStop = () => {
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchStop);
        };

        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchStop);

    }
}

export { Link };