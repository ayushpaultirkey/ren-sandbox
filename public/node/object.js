class IObject {

    #uuid = null;
    #name = null;
    #outer = null;
    #classId = null;

    constructor({ uuid = crypto.randomUUID(), name = "IObject", classId = "IObject", outer = null } = {}) {
        this.#uuid = uuid;
        this.#name = name;
        this.#outer = outer;
        this.#classId = classId;
    }
    getClassId() {
        return this.#classId;
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