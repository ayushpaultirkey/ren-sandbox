import { IObject } from "../object.js";
import { IProperty } from "../property.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "../type/types.js";


class IPropertyManager extends IObject {

    static meta = {
        className: "IObject.PropertyManager",
        displayName: "Property Manager"
    }

    /** @type {Map<string, IProperty>} */
    #properties = new Map();

    constructor({ uuid = crypto.randomUUID(), outer = null, name = "Property Manager" } = {}) {
        super({ uuid, outer, name });
    }

    main(properties = {}) {
        try {
            for(const name in properties) {
                const property = properties[name];

                const type = property.type;
                const value = property.value;
                const custom = property.custom;

                this.addProperty(name, type, value, custom);
            }
        }
        catch(error) {
            console.error(error);
        }
    }

    get properties() {
        return this.#properties;
    }

    addProperty(name, type, value = null, custom = {}) {
        try {

            if(!name) {
                throw new Error(`PropertyManager: Property name is required`);
            }
            if(this.#properties.has(name)) {
                throw new Error(`PropertyManager: Property "${name}" already exists`);
            }
    
            const finalType = PRIMITIVE_TYPES[type] || USER_DEFINED_TYPES[type];
            if(!finalType) {
                throw new Error(`PropertyManager: Invalid type "${type}"`);
            }
    
            const property = new IProperty({
                uuid: name,
                outer: this,
                name: name,
                type: finalType,
                value: value,
                custom: custom
            });
            this.#properties.set(name, property);

        }
        catch(error) {
            console.error(error);
        };

    }
    removeProperty(name) {
        return this.#properties.delete(name);
    }
    getProperty(name) {
        try {
            if(!this.#properties.has(name)) {
                throw new Error(`PropertyManager: Property "${name}" does not exist`);
            }
            return this.#properties.get(name);
        }
        catch(error) {
            console.error(error);
        };
    }
    setProperty(name, value) {
        try {
            if(!this.#properties.has(name)) {
                throw new Error(`PropertyManager: Property "${name}" does not exist`);
            }
            const property = this.getProperty(name);
            property.value = value;
        }
        catch(error) {
            console.error(error);
        };
    }


    export() {

        const properties = this.#properties;
        const data = {};

        for(const [uuid, property] of properties) {

            const exportData = property.export();
            if(!exportData) continue;

            data[uuid] = exportData;

        }

        return data;

    }

}


export { IPropertyManager };