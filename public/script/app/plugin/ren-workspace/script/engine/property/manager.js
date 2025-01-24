import H12 from "@library/h12.js";
import { PROPERTY_REGISTRY, UIProperty } from "../property.js";
import { Icon } from "../../../../../control/icon.js";
import { mdiClose, mdiPlus } from "@mdi/js";
import { copyHighlight } from "@script/app/library/utility.js";

class UIPropertyManager extends H12 {

    constructor() {
        super();
    }
    
    main() {
        this.reset();
    }

    render() {

        return <>
            <div class="select-none">
                <div class="flex flex-row space-x-1">
                    <input id="propertyName" class="primary-input w-full" placeholder="Name" />
                    <select id="propertyType" class="primary-select" aria-label="Property Type">
                        {
                            ...
                            Object.keys(PROPERTY_REGISTRY).map(key => {
                                return <><option value={ key }>{ key }</option></>
                            })
                        }
                    </select>
                    <button class="primary-btn" onclick={ this.#addProperty } aria-label="Add Property">
                        <Icon args path={ mdiPlus }></Icon>
                    </button>
                </div>
                <div class="flex flex-col space-y-1 mt-1">
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
        this.set("{properties}", <>
            <label class="text-xs">No Property Manager Found</label>
        </>);
    }

    refresh(ipropertyManager) {
        
        if(this.#ipropertyManager) {
            this.#ipropertyManager.dispatcher.clearAll();
        };

        if(!ipropertyManager) {
            console.error("Invalid property manager");
            return;
        };

        this.#ipropertyManager = ipropertyManager;
        this.#ipropertyManager.dispatcher.on("propertyAdded", () => this.#refreshProperties());
        this.#ipropertyManager.dispatcher.on("propertyRemoved", () => this.#refreshProperties());
        this.#refreshProperties();
    }

    #refreshProperties() {

        const { properties: uiProperties } = this.key;

        uiProperties("");
        for(const id in this.child) {
            const child = this.child[id];
            if(child instanceof UIProperty) {
                child.destroy();
            };
        };

        const properties = this.#ipropertyManager.properties;
        for(const [uuid, property] of properties) {

            const propertyClass = PROPERTY_REGISTRY[property.type];
            if(!propertyClass) continue;

            uiProperties(<>
                <div class="flex flex-col">
                    <label class="text-xs font-semibold" ondblclick={ (e) => { navigator.clipboard.writeText(uuid); copyHighlight(e.target); } }>{ property.custom.name || "no name" } :</label>
                    <div class="w-full flex flex-row space-x-1">
                        <property args alias={ propertyClass } id={ uuid } iobject={ property } class="w-full flex"></property>
                        <button class="primary-btn px-2 pt-[6px]" onclick={ () => { this.#removeProperty(uuid) } } aria-label="Remove">
                            <Icon args width="12px" height="12px" path={ mdiClose }></Icon>
                        </button>
                    </div>
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

        const { propertyName, propertyType } = this.element;
        const name = propertyName.value || "untitled";
        const type = propertyType.value;
        
        this.#ipropertyManager.addProperty(name, type, null, { name: name });
        propertyName.value = "";

    }

    destroy() {
        if(this.#ipropertyManager) {
            this.#ipropertyManager.dispatcher.clearAll();
        }
        super.destroy();
    }
    
}

export { UIPropertyManager };