class URLConsts {
    static #PROTOCOL = window.location.protocol;
    
    // static #HOSTNAME = window.location.hostname;
    static #HOSTNAME = 'aim-api.codermatt.com';

    static #RPC_PORT = 80;

    constructor() {
        throw ("URLConsts cannot be instantiated.");
    }

    static get RPC_BASE_URL() {
        return `${this.#PROTOCOL}//${this.#HOSTNAME}:${this.#RPC_PORT}`;
    }
}

export default URLConsts;