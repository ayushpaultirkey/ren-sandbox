import H12 from "@library/h12";
import { writeFile } from "@adapter/fs";
import { dispatcher } from "@event/dispatcher.js";
import { IGraph } from "@vm/graph";
import { IGraphSet } from "@vm/graphset";

class Creator extends H12 {
    constructor() {
        super();
    }
    main(args) {
        
    }
    render() {
        return <>
            <div class="w-full h-full absolute bg-zinc-900 bg-opacity-90 top-0 left-0 z-30 flex items-center">
                <div class="bg-zinc-800 p-10 w-full space-y-1">
                    <label class="text-zinc-400 text-2xl font-semibold">New Graph Set:</label>
                    <input type="text" id="fileName" class="primary-input w-full" placeholder="Name" />
                    <div class="space-x-1">
                        <button class="primary-btn" onclick={ this.#create }>Create</button>
                        <button class="primary-btn" onclick={ this.destroy }>Cancel</button>
                    </div>
                </div>
            </div>
        </>;
    }
    async #create() {

        const { fileName } = this.element;
        const name = (fileName.value.trim() || "untitled");

        const graphSet = new IGraphSet();
        graphSet.main({ custom: { name: name } });

        const data = JSON.stringify(graphSet.export());
        graphSet.destroy();

        await writeFile(`${name}.ren`, data);
        dispatcher.emit("file-written");
        
        this.destroy();
    
    }
    destroy() {
        super.destroy();
    }
};

export { Creator };