import H12 from "@library/h12.js";

class Tab extends H12 {
    constructor() {
        super();
    }
    render() {
        return <>
            <div class="tab" onclick={
                (e) => {
                        this.parent.setActive(this.id);
                    }
                }>
                <button class="h-full">{ this.args.title }</button>
                <button class="text-rose-500" onclick={ (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.parent.closeTab(this.id);
                }}>&times;</button>
            </div>
        </>;
    }
}

class TabManager extends H12 {
    constructor() {
        super();
    }
    main() {

        this.set("{tabs}", "");

    }
    render() {

        return <>
            <div class="tab-container">
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

export { TabManager };