import H12 from "@library/h12.js";

class Tab extends H12 {
    constructor() {
        super();
    }
    render() {
        return <>
            <div class="tab" onclick={ (e) => { this.parent.setActive(this.id); } }>
                <button class="h-full">{ this.args.title }</button>
                <button onclick={ (e) => { e.stopPropagation(); e.preventDefault(); this.parent.closeTab(this.id); }}>&times;</button>
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

    add(uuid, title) {

        if(!uuid) return;

        this.set("{tabs}++", <>
            <Tab args id={ uuid } title={ title }></Tab>
        </>);

    }

    remove(uuid) {
        this.child[uuid].destroy();
    }

    setActive(uuid) {

        for(const childId in this.child) {

            const tab = this.child[childId];

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