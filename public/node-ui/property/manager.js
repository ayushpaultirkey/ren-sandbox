import H12 from "@library/h12";
import { IPropertyManager } from "../../node/property/manager";
import { PROPERTY_REGISTRY, UIProperty } from "../property";

class UIPropertyManager extends H12 {

    /** @type {IPropertyManager} */
    #ipropertyManager;
    get ipropertyManager() {
        return this.#ipropertyManager;
    }
    set ipropertyManager(value) {
        if(this.#ipropertyManager) {
            this.#ipropertyManager.dispatcher.clearAll();
        }
        this.#ipropertyManager = value;
        this.#ipropertyManager.dispatcher.on("propertyAdded", () => this.refresh());
        this.#ipropertyManager.dispatcher.on("propertyRemoved", () => this.refresh());
        this.refresh();
    }

    constructor() {
        super();
    }
    
    refresh() {
        
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
                        <button class="text-red-500 text-xs px-2 pb-1" onclick={ () => { this.removeProperty(uuid) } }>&times;</button>
                    </property>
                </div>
            </>, "x++");

        }

    }
    removeProperty(uuid) {

        if(!this.#ipropertyManager) {
            console.error("Property manager not found");
            return;
        }

        this.#ipropertyManager.removeProperty(uuid);

    }
    addProperty() {

        if(!this.#ipropertyManager) {
            console.error("Property manager not found");
            return;
        }

        const { box, type } = this.element;
        
        this.#ipropertyManager.addProperty(null, box.value, type.value);
        box.value = "";

    }
    render() {

        return <>
            <div class="w-full h-full flex flex-col overflow-hidden">
                <label>{ this.args.title || "Properties" }:</label>
                <div class="w-full flex flex-row overflow-hidden bg-zinc-300 text-xs text-zinc-800">
                    <input type="text" id="box" class="w-full bg-transparent" />
                    <select id="type" class="bg-transparent hover:bg-zinc-400">
                        {
                            ... Object.keys(PROPERTY_REGISTRY).map(key => {
                                return <><option value={ key }>{ key }</option></>
                            })
                        }
                    </select>
                    <button class="px-1 hover:bg-zinc-400" onclick={ this.addProperty }>Add</button>
                </div>
                <div class="flex flex-col">
                    {properties}
                </div>
            </div>
        </>

    }
    destroy() {
        if(this.#ipropertyManager) {
            this.#ipropertyManager.dispatcher.clearAll();
        }
        super.destroy();
    }
    
}

export { UIPropertyManager };