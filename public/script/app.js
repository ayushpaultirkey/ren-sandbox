import "@style/main.css";
import H12 from "@library/h12";
import { Graph } from "@library/h12/nde/graph";

class App extends H12 {
    constructor() {
        super();
        this.num = 0;
    }
    main(args) {
        //const { count } = this.key;
        //count(this.num);
    }
    render() {
        return <>
            <div class="w-full h-full overflow-auto scroll relative">
                <Graph args></Graph>
            </div>
        </>;
    }
    increment() {
        //const { count } = this.key;
        //count(++this.num);
    }
};

// Render app
new App().init(".app");