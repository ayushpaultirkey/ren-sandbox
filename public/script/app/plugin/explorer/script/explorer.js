import { readDirectory } from "@adapter/fs.js";
import { Workspace } from "@project/workspace.js";
import { dispatcher } from "@event/dispatcher.js";

class Explorer extends Workspace {

    #handleOnLoad;

    constructor() {
        super();
        this.activeGraphUUID = null;
        this.#handleOnLoad = this.load.bind(this);
    }
    main(args) {

        this.load();
        dispatcher.on("file-written", this.#handleOnLoad);

    }
    render() {

        return <>
            <div class="project-workspace">
                <div class="bg-zinc-800 p-2 w-full relative overflow-hidden border-2 border-zinc-950 flex flex-col space-y-1">
                    {files}
                </div>
            </div>
        </>

    }
    async load() {

        const { files: uiFiles } = this.key;
        uiFiles("");

        const files = await readDirectory();
        for(const file of files) {

            const fileExtension = file.name.split(".").pop();
            const fileName = file.name.split(".").slice(0, -1).join(".");

            const data = [
                ["Type", file.type],
                ["Name", fileName],
                ["Extension", `.${fileExtension}`]
            ]

            uiFiles(<>
                <div class="primary-btn flex flex-col p-2 rounded-md" onclick={ () => this.openFile(fileName, file.name) }>
                    {
                        ... data.map(([ title, value ]) => {
                            return <>
                                <div class="space-x-1">
                                    <label class="font-bold inline-block min-w-16">{ title }:</label>
                                    <label>{ value }</label>
                                </div>
                            </>
                        })
                    }
                </div>
            </>, "x++");
        }

    }
    destroy() {
        
        this.dispatcher.off("file-written", this.#handleOnLoad);
        super.destroy();

    }
    openFile(name, path) {

        dispatcher.emit("open-workspace", name, path);

    }
}

export { Explorer };