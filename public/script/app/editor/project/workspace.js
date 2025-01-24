import H12 from "@library/h12.js";
import { Dispatcher } from "@library/h12/dispatcher.js";
import { getActiveWorkspace, setActiveWorkspace } from "@script/app/library/workspace";

class Workspace extends H12 {

    #active = false;

    get active() {
        return this.#active;
    }
    
    set active(value) {

        this.#active = value;

        if(value) {
            this.root.classList.remove("hidden");
            setActiveWorkspace(this);
        }
        else {
            this.root.classList.add("hidden");
        };

    }

    constructor() {
        super();
        this.name = "Workspace";
        this.dispatcher = new Dispatcher();
    }

    load() {
        
    }

    destroy() {
        this.dispatcher.clearAll();

        if(getActiveWorkspace() == this) {
            setActiveWorkspace(null);
        }

        super.destroy();
    }
}

export { Workspace };