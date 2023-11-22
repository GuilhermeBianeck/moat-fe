class URLConsts {
    static #PROTOCOL = window.location.protocol;
    static #HOSTNAME = window.location.hostname;
    static #RPC_PORT = 9000;

    constructor() {
        throw ("URLConsts cannot be instantiated.");
    }

    static get RPC_BASE_URL() {
        return `${this.#PROTOCOL}//${this.#HOSTNAME}:${this.#RPC_PORT}`;
    }
}

export default URLConsts;