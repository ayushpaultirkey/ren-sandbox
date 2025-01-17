import H12 from "@library/h12.js";
import { dispatcher } from "@script/dispatcher.js";
import { Button } from "../../../editor/control";

class ActionBar extends H12 {
    constructor() {
        super();
    }
    main() {

    }
    render() {

        return <>
            <div class="p-1 px-2">
                <control args alias={ Button } title="main.ren"></control>
            </div>
        </>

    }

}

export { ActionBar };