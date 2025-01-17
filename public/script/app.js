import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "../editor/dispatcher";
import "./dispatcher";
//import { UIEngine } from "../node-ui/engine";
import { Editor } from "./editor";

class App extends H12 {
    constructor() {
        super();
    }
    main(args) {
        
    }
    render() {
        return <>
            <div class="w-full h-full overflow-hidden">
                <editor args alias={ Editor }></editor>
            </div>
        </>;
    }
};

// Render app
new App().init(".app");