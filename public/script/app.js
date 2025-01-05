import "@style/main.css";
import H12 from "@library/h12";
import {Graph} from "@library/h12/nde/graph";

class App extends H12 {
    constructor() {
        super();
        this.graph = null;
        this.canvas = null;
        this.begin = null;
    }
    main(args) {
        

    }
    render() {
        return <>
            <div class="w-full h-full overflow-auto scroll relative" id="graph">
                <svg width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
                </svg>
            </div>
        </>;
    }
    start() {
        console.log(this.graph.serialize());
        this.begin.onExecute();
    }
};

// Render app
new App().init(".app");