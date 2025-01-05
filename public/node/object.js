class IObject {

    #uuid = null;
    #name = null;
    #outer = null;

    constructor({ uuid, name, outer }) {
        this.#uuid = uuid || crypto.randomUUID();
        this.#name = name || null;
        this.#outer = outer || null;
    }

    getUUID() {
        return this.#uuid;
    }
    getName() {
        return this.#name;
    }
    getOuter() {
        return this.#outer;
    }
    
    main() {
        
    }

}

export { IObject };