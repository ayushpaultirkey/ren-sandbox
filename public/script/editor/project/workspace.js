import H12 from "@library/h12";
import { Dispatcher } from "@library/h12/dispatcher";

class Workspace extends H12 {
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