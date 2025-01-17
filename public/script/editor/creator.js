import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher.js";

import { Button, InputBox } from "../../editor/control";

class Creator extends H12 {
    constructor() {
        super();
    }
    main(args) {

        dispatcher.on("show-creator", () => {
            this.show();
        });
        dispatcher.on("hide-creator", () => {
            this.close();
        })
        
    }
    render() {
        return <>
            <div class="absolute bg-zinc-900 bg-opacity-90 w-full h-full items-center top-0 left-0 z-30 hidden">
                <div class="bg-zinc-800 p-10 w-full space-y-1">
                    <label class="text-zinc-400 text-2xl font-semibold">Create New Project:</label>
                    <control args alias={ InputBox } title="Name"></control>
                    <div class="space-x-1">
                        <control args alias={ Button } title="Create" onclick={ this.create.bind(this) }></control>
                        <control args alias={ Button } title="Cancel" onclick={ this.close.bind(this) }></control>
                    </div>
                </div>
            </div>
        </>;
    }
    show() {
        this.root.classList.remove("hidden");
        this.root.classList.add("flex");
    }
    close() {
        this.root.classList.add("hidden");
        this.root.classList.remove("flex");
    }
    create() {
        dispatcher.emit("load-project");
        this.close();
    }
    destroy() {
        dispatcher.clear("show-creator");
        dispatcher.clear("hide-creator");
        super.destroy();
    }
};

export { Creator };