import H12 from "@library/h12";
import { Dispatcher } from "@library/h12/dispatcher";

class Workspace extends H12 {

    #isActive = false;

    get isActive() {
        return this.#isActive;
    }
    set isActive(value) {
        this.#isActive = value;
        if(value) {
            this.root.classList.remove("hidden");
        }
        else {
            this.root.classList.add("hidden");
        }
    }

    constructor() {
        super();
        this.name = "Workspace";
        this.dispatcher = new Dispatcher();
    }
    destroy() {
        this.dispatcher.clearAll();
        super.destroy();
    }
}

export { Workspace };