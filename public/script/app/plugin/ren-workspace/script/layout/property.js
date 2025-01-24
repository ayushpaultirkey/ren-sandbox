import H12 from "@library/h12.js";


class Property extends H12 {

    constructor() {
        super();
    }

    main(args) {

    }

    render() {

        return <>
            <div class={ `property-container ${this.args.class || ""}` }>
                { this.template() }
                <div id="dynamic" class="hidden">
                    {tabs}
                </div>
            </div>
        </>;

    }

    template() {
        return "";
    }

    add(tab) {

        if(!tab) return;
        this.set("{tabs}++", tab);

        this.element.dynamic.classList.remove("hidden");

    }

    remove(id) {

        this.child[id].destroy();

    }

    switchTab(id) {

        const childs = this.child;
        for(const childId in childs) {

            const child = childs[childId];
            
            if(child instanceof PropertyTab) {
                if(child.id === id) {
                    child.root.classList.remove("hidden");
                }
                else {
                    child.root.classList.add("hidden");
                };
            };
            
        };

    }

}

class PropertyTab extends H12 {

    constructor() {
        super();
        this.title = "";
        this.class = "";
    }

    main(args) {
        
    }

    render() {

        const newTitle = this.args.title || this.title || "Title";
        const newClass = this.args.class || this.class || "";

        return <>
            <div class={ `property-tab ${newClass}` }>

                <div class="property text-2xl">
                    <label class="!text-sm !font-normal">{ newTitle }</label>
                </div>

                <div class="seperator"></div>

                { this.template() }

            </div>
        </>;
    }
    template() {
        return "";
    }

}

class PropertyMenu extends H12 {

    #target = null;
    get target() {
        return this.#target;
    }

    constructor() {
        super();
        this.class = "";
    }

    main(args) {

    }

    setTarget(target) {
        this.#target = target;
    }
    switchTab(id) {
        this.#target.switchTab(id);
    }

    render() {

        const newClass = this.args.class || this.class || "";

        return <>
            <div class={ `property-menu ${newClass}` }>
                { this.template() }
                <div id="dynamic" class="!hidden">
                    {dynamic}
                </div>
            </div>
        </>;
    }

    template() {
        return "";
    }

    add(menu) {

        if(!menu) return;
        this.set("{dynamic}++", menu);

        this.element.dynamic.classList.remove("hidden");

    }
    remove(id) {
        this.child[id].destroy();
    }
    
}

export { Property, PropertyTab, PropertyMenu };