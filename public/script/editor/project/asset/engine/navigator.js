import H12 from "@library/h12.js";
import { dispatcher } from "@script/dispatcher.js";
import { Category } from "./nodelist";

class Navigator extends H12 {
    constructor() {
        super();
    }
    main() {

    }
    render() {

        return <>
            <div class="flex flex-row h-full">
                <div>
                    <button class="border-2 border-zinc-900" onclick={ () => this.changeTab("tab_node") }>nodes</button>
                    <button class="border-2 border-zinc-900">stats</button>
                    <button class="border-2 border-zinc-900">run</button>
                </div>
                <div id="tabs" class="border-2 min-w-[225px] max-w-[225px] border-zinc-950 p-1 px-2 text-zinc-400 text-xs">
                    <div class="flex flex-col" id="tab_node">
                        <label class="text-sm font-semibold border-b-2 border-zinc-500">Nodes:</label>
                        <Category args id="category" auto="true"></Category>
                    </div>
                </div>
            </div>
        </>

    }
    changeTab(element) {

        const { tabs } = this.element;
        tabs.childNodes.forEach(tab => {
            tab.classList.remove("flex");
            tab.classList.add("hidden");
        });

        const target = this.element[element];
        if(target) {
            target.classList.remove("hidden");
            target.classList.add("flex");
        }

    }

}

export { Navigator };