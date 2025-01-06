class Link {
    constructor({ source, target, graph } = {}) {

        this.uuid = crypto.randomUUID();
        this.graph = graph;
        this.source = source;
        this.target = target;

        this.line = null;
        this.fOnMouseDown = this.onMouseDown.bind(this);

    }
    remove() {
        this.line.remove();
    }
    #createLine(x1, y1, x2, y2) {

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttributeNS(null, "x1", x1);
        line.setAttributeNS(null, "y1", y1);
        line.setAttributeNS(null, "x2", x2);
        line.setAttributeNS(null, "y2", y2);
        line.setAttributeNS(null, "style", "stroke:rgb(59,130,246);stroke-width:2");
        line.setAttributeNS(null, "class", "path");
        return line;

    }
    create() {

        const { source, target, graph, fOnMouseDown } = this;

        source.addLink(this);
        target.addLink(this);

        const { x: parentX, y: parentY } = graph.root.getBoundingClientRect();

        const o = source.root.getBoundingClientRect();
        const x1 = o.left - parentX + o.width / 2;
        const y1 = o.top - parentY + o.height / 2;

        const i = target.root.getBoundingClientRect();
        const x2 = i.left - parentX + i.width / 2;
        const y2 = i.top - parentY + i.height / 2;

        source.parent.root.addEventListener("mousedown", fOnMouseDown);
        target.parent.root.addEventListener("mousedown", fOnMouseDown);

        this.line = this.#createLine(x1, y1, x2, y2);

        return this.line;

    }
    onMouseDown(event) {
        
        const { source, target, graph, line } = this;

        const onDragMove = (e) => {

            const { x: parentX, y: parentY } = graph.root.getBoundingClientRect();
    
            const o = source.root.getBoundingClientRect();
            const x1 = o.left - parentX + o.width / 2;
            const y1 = o.top - parentY + o.height / 2;
    
            const i = target.root.getBoundingClientRect();
            const x2 = i.left - parentX + i.width / 2;
            const y2 = i.top - parentY + i.height / 2;

            console.log(source.id, target.id);

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
}

export { Link };