import H12 from "@library/h12.js";
import { dispatcher } from "@script/dispatcher.js";
import { Button } from "../../../editor/control";

class ActionBar extends H12 {
    constructor() {
        super();
    }
    main() {

        this.set("{tabs}", "");

    }
    render() {

        return <>
            <div class="p-1 px-2">
                {tabs}
            </div>
        </>

    }
    addTab(uuid, title) {

        this.set("{tabs}++", <>
            <button class="primary-btn">{ title }</button>
        </>);

    }
    removeTab(uuid) {
        
        this.child[uuid].destroy();

    }
}

export { ActionBar };