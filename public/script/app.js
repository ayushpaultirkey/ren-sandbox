import "@style/main.css";
import H12 from "@library/h12";
import dispatcher from "@library/h12/dispatcher";
import { UIEngine } from "../node-ui/engine";

class App extends H12 {
    constructor() {
        super();
    }
    main(args) {
        
    }
    render() {
        return <>
            <div class="w-full h-full overflow-auto scroll relative" id="graph">
                <engine args alias={ UIEngine }></engine>
            </div>
        </>;
    }
};

// Render app
new App().init(".app");