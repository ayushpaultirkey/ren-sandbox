import H12 from "@library/h12";
import { PROPERTY_REGISTRY, UIProperty } from "../property.js";

class UIPropertyManager extends H12 {

    constructor() {
        super();
    }
    
    main() {
        this.reset();
    }

    render() {

        return <>
            <div>
                <div class="flex flex-row">
                    <input id="prop_name" class="primary-input w-full border-r-0 rounded-r-none" placeholder="Name" />
                    <select id="prop_type" class="primary-select border-r-0 rounded-r-none rounded-l-none">
                        {
                            ...
                            Object.keys(PROPERTY_REGISTRY).map(key => {
                                return <><option value={ key }>{ key }</option></>
                            })
                        }
                    </select>
                    <button class="primary-btn rounded-l-none" onclick={ this.#addProperty }>Add</button>
                </div>
                <div class="flex flex-col">
                    {properties}
                </div>
            </div>
        </>

    }

    /** @type {import("@vm/property/manager").IPropertyManager} */
    #ipropertyManager;

    reset() {
        if(this.#ipropertyManager) {
            this.#ipropertyManager.dispatcher.clearAll();
        }
        this.set("{properties}", "No Property Manager Found");
    }

    refresh(ipropertyManager) {
        if(this.#ipropertyManager) {
            this.#ipropertyManager.dispatcher.clearAll();
        }
        this.#ipropertyManager = ipropertyManager;
        this.#ipropertyManager.dispatcher.on("propertyAdded", () => this.#refreshProperties());
        this.#ipropertyManager.dispatcher.on("propertyRemoved", () => this.#refreshProperties());
        this.#refreshProperties();
    }

    #refreshProperties() {
        const { properties: uiProperties } = this.key;

        uiProperties("");
        for(const child in this.child) {
            this.child[child].destroy();
        }

        const properties = this.#ipropertyManager.properties;
        for(const [uuid, property] of properties) {

            const propertyClass = PROPERTY_REGISTRY[property.type];
            if(!propertyClass) continue;

            uiProperties(<>
                <div class="flex flex-row">
                    <property args alias={ propertyClass } id={ uuid } iobject={ property }>
                        <button class="primary-btn" onclick={ () => { this.#removeProperty(uuid) } }>&times;</button>
                    </property>
                </div>
            </>, "x++");

        }
    }

    #removeProperty(uuid) {

        if(!this.#ipropertyManager) {
            console.error("Property manager not found");
            return;
        }

        this.#ipropertyManager.removeProperty(uuid);

    }
    #addProperty() {

        if(!this.#ipropertyManager) {
            console.error("Property manager not found");
            return;
        }

        const { prop_name, prop_type } = this.element;
        
        this.#ipropertyManager.addProperty(null, prop_name.value, prop_type.value);
        prop_name.value = "";

    }

    destroy() {
        if(this.#ipropertyManager) {
            this.#ipropertyManager.dispatcher.clearAll();
        }
        super.destroy();
    }
    
}

export { UIPropertyManager };