import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher";

class Menu extends H12 {
    constructor() {
        super();
    }
    main(args) {
        
    }
    build(options) {

        const items = [];
        
        for(const title in options) {

            let nested = "";
            let button = "";
            const option = options[title];

            if(typeof(option) === "object") {
                nested = this.build(option);
                button = <>
                    <button>{ title }</button>
                </>;
            }
            else if(typeof(option) === "function") {
                button = <>
                    <button onclick={ option }>{ title }</button>
                </>;
            }

            const template = <>
                <div class="menu-hover py-1 px-2 min-w-32 hover:bg-zinc-600 hover:bg-opacity-40">
                    { button }
                    { nested }
                </div>
            </>;
            items.push(template);

        }

        return <>
            <div class="py-1 rounded-sm bg-zinc-800 border-2 border-zinc-700 z-20">{ ... items }</div>
        </>;

    }
    render() {

        const options = {
            "Open": {
                "Project": () => { console.log("Open Graph Set"); },
            },
            "New Project": () => {
                dispatcher.emit("show-creator");
            },
            "New File": {
                "Graph Set": () => { console.log("Open Graph Set"); },
            },
            "Export": {
                "Graph Set": () => { console.log("Open Graph Set"); },
            },
            "Import": {
                "Graph Set": () => { console.log("Open Graph Set"); },
            }
        };
        
        return <>
            <div class="flex flex-row p-1 relative z-20 bg-zinc-800">
                <div class="text-zinc-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-zinc-600 hover:bg-opacity-40 menu">
                    <label>File</label>
                    { this.build(options) }
                </div>
            </div>
        </>;

    }
};

export { Menu };