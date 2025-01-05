class IObject {

    #uuid = null;
    #name = null;
    #outer = null;

    constructor({ uuid = crypto.randomUUID(), name = "IObject", outer = null } = {}) {
        this.#uuid = uuid;
        this.#name = name;
        this.#outer = outer;
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

}

export { IObject };