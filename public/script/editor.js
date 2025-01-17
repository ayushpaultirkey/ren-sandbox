import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";

import { Menu } from "../editor/control/menu";
import { Project } from "./editor/project";
import { Button, InputBox } from "../editor/control";
import { Creator } from "./editor/creator";

class Editor extends H12 {
    constructor() {
        super();
    }
    main(args) {
        
    }
    render() {
        return <>
            <div class="w-full h-full overflow-hidden bg-zinc-700 relative flex flex-col">
                <Menu args></Menu>
                <Project args></Project>
                <Creator args></Creator>
            </div>
        </>;
    }
};

export { Editor };