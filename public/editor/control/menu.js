import "@style/main.css";
import H12 from "@library/h12";
import { dispatcher } from "@script/dispatcher";

class MenuItem extends H12 {

    constructor() {
        super();
    }

    #build(options) {

        const items = [];
        
        for(const title in options) {

            let nested = "";
            let button = "";
            const option = options[title];

            if(typeof(option) === "object") {
                nested = this.#build(option);
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
                <div class="menu-nested py-1 px-2 min-w-32 hover:bg-zinc-600 hover:bg-opacity-40">
                    { button }
                    { nested }
                </div>
            </>;
            items.push(template);

        }

        return <>
            <div class="py-1 rounded-sm bg-zinc-800 border-2 border-zinc-900 z-20">{ ... items }</div>
        </>;

    }
    render() {

        return <>
            <div class="text-zinc-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-zinc-600 hover:bg-opacity-40 menu">
                <label>{ this.args.title || "Title" }</label>
                { this.#build(this.args.options || {}) }
            </div>
        </>;

    }
}

class Menu extends H12 {
    constructor() {
        super();
    }
    main(args) {

        this.set("{menu}", "");

        dispatcher.on("add-menu", (id, title, options = {}) => {
            if(this.child[id]) return;
            this.set("{menu}++", <>
                <><item args alias={ MenuItem } id={ id } title={ title } options={ options }></item></>
            </>);
        });
        dispatcher.on("remove-menu", (id) => {
            this.child[id].destroy();
        });
        
    }
    
    render() {
        return <>
            <div class="editor-menu">
                {menu}
            </div>
        </>;
    }

    destroy() {
        dispatcher.clear("add-menu");
        dispatcher.clear("remove-menu");
        super.destroy();
    }

};

export { Menu };