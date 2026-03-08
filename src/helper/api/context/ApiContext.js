class ApiContext {
    constructor(initial = {}) {
        this.store = { ...initial };
    }

    set(key, value) {
        this.store[key] = value;
    }

    get(key) {
        return this.store[key];
    }

    toObject() {
        return { ...this.store };
    }
}

module.exports = { ApiContext };
