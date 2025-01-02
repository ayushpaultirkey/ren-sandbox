
import dispatcher from "@library/h12/dispatcher";

function createLine(x1, y1, x2, y2) {
    var g = document.createElementNS("http://www.w3.org/2000/svg", "line");
    g.setAttributeNS(null, "x1", x1);
    g.setAttributeNS(null, "y1", y1);
    g.setAttributeNS(null, "x2", x2);
    g.setAttributeNS(null, "y2", y2);
    g.setAttributeNS(null, "style", "stroke:rgb(59,130,246);stroke-width:2");
    g.setAttributeNS(null, "class", "path");
    return g;
}






export default class Link {
    constructor(input, output) {

        this.uid = crypto.randomUUID();
        this.input = input;
        this.output = output;

        this.line = null;

        this.boundOnMouseDown = this.onMouseDown.bind(this);

    }
    remove() {

        const { input, output, line, boundOnMouseDown } = this;

        if (line) line.remove();
        if (input) input.disconnect();
        if (output) output.disconnect();

        input.parent.root.removeEventListener("mousedown", boundOnMouseDown);
        output.parent.root.removeEventListener("mousedown", boundOnMouseDown);

    }
    getLine() {
        return this.line;
    }
    create() {

        const { input, output, boundOnMouseDown } = this;

        input.connect(this);
        output.connect(this);

        const o = input.root.getBoundingClientRect();
        const x1 = o.left + (o.width / 2);
        const y1 = o.top + (o.height / 2);

        const i = output.root.getBoundingClientRect();
        const x2 = i.left + (i.width / 2);
        const y2 = i.top + (i.height / 2);

        input.parent.root.addEventListener("mousedown", boundOnMouseDown);
        output.parent.root.addEventListener("mousedown", boundOnMouseDown);

        this.line = createLine(x2, y2, x1, y1);

    }
    onMouseDown(event) {
        
        const { input, output, line } = this;

        const onDragMove = (e) => {

            const o = output.root.getBoundingClientRect();
            const x1 = o.left + (o.width / 2);
            const y1 = o.top + (o.height / 2);

            const i = input.root.getBoundingClientRect();
            const x2 = i.left + (i.width / 2);
            const y2 = i.top + (i.height / 2);

            console.log(input.uid, output.uid); 

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