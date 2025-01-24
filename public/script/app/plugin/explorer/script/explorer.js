import "./../style/main.css";
import { readDirectory } from "@adapter/fs.js";
import { Workspace } from "@project/workspace.js";
import { dispatcher } from "@event/dispatcher.js";

class Explorer extends Workspace {

    #onLoadHandler;

    constructor() {
        super();
        this.#onLoadHandler = this.load.bind(this);
    }
    main(args) {

        this.load();
        dispatcher.on("file-written", this.#onLoadHandler);

    }
    render() {

        return <>
            <div class="project-workspace bg-zinc-800">
                <div class="explorer-container">
                    <table class="explorer-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th class="table-fit">Extension</th>
                                <th class="table-fit">Type</th>
                            </tr>
                        </thead>
                        <tbody id="files"></tbody>
                    </table>
                </div>
            </div>
        </>

    }
    async load() {
        
        const { files: uiFiles } = this.element;
        while(uiFiles.firstChild) {
            uiFiles.removeChild(uiFiles.lastChild);
        }

        const files = await readDirectory();

        for(const file of files) {

            const fileExtension = file.name.split(".").pop();
            const fileName = file.name;
            const fileType = file.type;

            const filePath = file.name;
            
            uiFiles.append(<>
                <row alias="tr" onclick={ () => { this.openFile(fileName, filePath) } }>
                    <data alias="th">{ fileName }</data>
                    <data alias="th">.{ fileExtension }</data>
                    <data alias="th">{ fileType }</data>
                </row>
            </>);

        };

    }
    destroy() {
        
        this.dispatcher.off("file-written", this.#onLoadHandler);
        super.destroy();

    }
    openFile(name, path) {
        dispatcher.emit("open-workspace", name, path);
    }
}

export { Explorer };