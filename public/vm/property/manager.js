import { IObject } from "../object.js";
import { IProperty } from "../property.js";
import { PRIMITIVE_TYPES, USER_DEFINED_TYPES } from "../types/default.js";


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
            for(const uuid in properties) {

                const property = properties[uuid];

                const type = property.type;
                const value = property.value;
                const custom = property.custom;
                
                this.addProperty(uuid, type, value, custom);

            }
        }
        catch(error) {
            console.error(error);
        }
    }

    get properties() {
        return this.#properties;
    }

    addProperty(uuid, type, value = null, custom = {}) {
        try {

            const newUUID = uuid || crypto.randomUUID();

            if(this.#properties.has(newUUID)) {
                throw new Error(`PropertyManager: Property "${newUUID}" already exists`);
            };
    
            const finalType = PRIMITIVE_TYPES[type] || USER_DEFINED_TYPES[type];
            if(!finalType) {
                throw new Error(`PropertyManager: Invalid type "${type}"`);
            };
    
            const property = new IProperty({
                uuid: newUUID,
                outer: this,
                type: finalType,
                value: value,
                custom: custom
            });
            this.#properties.set(newUUID, property);

            this.dispatcher.emit("propertyAdded", property);

        }
        catch(error) {
            console.error(error);
        };

    }
    removeProperty(uuid) {
        if(this.#properties.delete(uuid)) {
            this.dispatcher.emit("propertyRemoved", uuid);
            return true;
        }
        return false;
    }
    getProperty(uuid) {
        try {
            if(!this.#properties.has(uuid)) {
                throw new Error(`PropertyManager: Property "${uuid}" does not exist`);
            }
            return this.#properties.get(uuid);
        }
        catch(error) {
            console.error(error);
        };
    }
    setProperty(uuid, value) {
        try {
            if(!this.#properties.has(uuid)) {
                throw new Error(`PropertyManager: Property "${uuid}" does not exist`);
            }
            const property = this.getProperty(uuid);
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

        };

        return data;

    }

}


export { IPropertyManager };