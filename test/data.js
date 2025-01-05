class Data {
    constructor(uid, outer) {
        this.uid = uid || crypto.randomUUID();
        this.outer = outer;
        this.name = null;
    }
}

export { Data };