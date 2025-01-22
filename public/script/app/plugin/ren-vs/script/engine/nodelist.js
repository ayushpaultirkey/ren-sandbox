import H12 from "@library/h12.js";
import { dispatcher } from "@event/dispatcher.js";
import VIEWPORT from "../config/viewport.js";
import { NODES_REGISTRY } from "@vm/node.js";
import { getWorkplace } from "@app/library/workplace.js";
import { mdiCardBulletedOutline } from "@mdi/js";
import { Icon } from "../../../../control/icon.js";

class Category extends H12 {

    constructor() {
        super();
        this.staticFieldCreated = false;
        this.staticFields = {};
        this.items = [];
        this.workplace = null;
    }
    main(args) {
        if(args && args.auto) {
            this.createCategory();
        }
        this.workplace = getWorkplace(this);
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
                        <summary class="text-xs">{ current }</summary>
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

                const canCache = nodeClass.meta.canCache;

                this.staticFields[current].children[1].appendChild(<>
                    <button onclick={ () => { this.addNode(category); } } class="text-xs font-semibold text-left italic hover:font-semibold hover:underline flex space-x-1 items-center">
                        <Icon args width="16" height="16" path={ mdiCardBulletedOutline } class={ `pointer-events-none ${canCache ? "fill-sky-600" : "fill-teal-600"}` }></Icon>
                        <label class="pointer-events-none">{ name }</label>
                    </button>
                </>);

            }

        }

    }

    addNode(className) {
        if(this.workplace) {
            this.workplace.dispatcher.emit("addNode", className);
        }
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