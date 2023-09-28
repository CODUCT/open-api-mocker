class ExternalJSContainer {
    static _instance;

    paths = []

    constructor() { }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new ExternalJSContainer();
        return this._instance;
    }
}

module.exports = ExternalJSContainer;