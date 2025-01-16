import H12 from "@library/h12.js";
import { dispatcher } from "./dispatcher.js";

import { NODES_REGISTRY } from "../node/node.js";
import VIEWPORT from "./viewport.js";

class Category extends H12 {

    constructor() {
        super();
        this.staticFieldCreated = false;
        this.staticFields = {};
        this.items = [];
    }
    main(args) {
        if(args && args.auto) {
            this.createCategory();
        }
    }
    render() {
        return <>
            <div class="select-none">
                <div>{staticmenu}</div>
            </div>
        </>
    }

    createField(category = "", nodeClass) {

        const split = category.split(".");
        split.pop();

        const meta = nodeClass.getMeta();
        const name = meta.displayName;
        this.items.push(name);
        
        for(let i = 0; i < split.length; i++) {

            const current = split[i];
            const previous = split[i - 1];
            const isLast = i == split.length - 1;

            if(!this.staticFields[current]) {

                const field = <>
                    <details class="space-y-1" open>
                        <summary class="text-sm font-semibold">{ current }</summary>
                        <div class="pl-4 flex flex-col space-y-1"></div>
                    </details>
                </>;
                this.staticFields[current] = field;

                if(previous && this.staticFields[previous]) {
                    this.staticFields[previous].children[1].appendChild(field);
                }
                else {
                    this.set("{staticmenu}++", field);
                }

            }
            
            if(isLast) {
                this.staticFields[current].children[1].appendChild(<>
                    <button onclick={ () => { this.addNode(category); } } class="text-left italic hover:font-semibold hover:underline">{ name }</button>
                </>);
            }

        }

    }

    drag(event) {

        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", onDragStop);

        const placeholder = <>
            <div class="absolute bg-zinc-800 rounded-sm pointer-events-none shadow-md border-2 border-sky-800 text-xs select-none py-1 w-24 h-16"></div>
        </>;
        this.root.appendChild(placeholder);

        const elementRect = placeholder.getBoundingClientRect();
        let offsetX = event.clientX - elementRect.left;
        let offsetY = event.clientY - elementRect.top;

        function onDragMove(event) {

            event.stopPropagation();
            event.preventDefault();

            let width = elementRect.width / 2;
            let height = elementRect.height / 2;

            let rawX = (event.clientX - width);
            let rawY = (event.clientY - height);

            placeholder.style.left = rawX + "px";
            placeholder.style.top = rawY + "px";

        }

        function onDragStop(event) {
            
            window.removeEventListener("mousemove", onDragMove);
            window.removeEventListener("mouseup", onDragStop);

            placeholder.remove();

        }

    }

    addNode(className) {
        dispatcher.emit("addNode", className);
    }
    
    createCategory() {
        
        if(!this.staticFieldCreated) {
            
    
            const nodes = NODES_REGISTRY.getAll();
            for(const [ className, nodeClass ] of nodes) {
                this.createField(className, nodeClass);
            }
            this.staticFieldCreated = true;

        }

    }

}

export { Category };