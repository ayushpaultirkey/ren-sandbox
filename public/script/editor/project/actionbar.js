import H12 from "@library/h12.js";
import { dispatcher } from "@script/dispatcher.js";
import { Button } from "../../../editor/control";

class Tab extends H12 {
    constructor() {
        super();
    }
    render() {
        return <>
            <div class="primary-btn">
                <button class="h-full" onclick={ () => { this.parent.setActive(this.id); } }>{ this.args.title }</button>
                <button class="text-rose-500" onclick={ () => { this.parent.closeTab(this.id); } }>&times;</button>
            </div>
        </>;
    }
}

class ActionBar extends H12 {
    constructor() {
        super();
    }
    main() {

        this.set("{tabs}", "");

    }
    render() {

        return <>
            <div class="p-1 px-2 flex flex-row">
                {tabs}
            </div>
        </>

    }
    addTab(uuid, title) {

        this.set("{tabs}++", <>
            <Tab args id={ uuid } title={ title }></Tab>
        </>);

    }
    removeTab(uuid) {
        
        this.child[uuid].destroy();

    }
    setActive(uuid) {

        for(const id in this.child) {

            const tab = this.child[id];

            if(tab instanceof Tab) {
                if(tab.id === uuid) {
                    tab.root.classList.add("active");
                }
                else {
                    tab.root.classList.remove("active");
                };
            };

        };

        this.parent.switchWorkspace(uuid);

    }
    closeTab(uuid) {
        this.child[uuid].destroy();
        this.parent.closeWorkspace(uuid);
    }
}

export { ActionBar };