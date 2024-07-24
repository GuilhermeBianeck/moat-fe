class URLConsts {
  // static #PROTOCOL = 'http'
  // static #HOSTNAME = 'aim-api.codermatt.com';
  // static #RPC_PORT = 80;

  static #PROTOCOL = process.env.REACT_APP_RPC_PROTOCOL;
  static #HOSTNAME = process.env.REACT_APP_RPC_HOSTNAME;
  static #RPC_PORT = process.env.REACT_APP_RPC_PORT;

  constructor() {
    throw new Error("URLConsts cannot be instantiated.");
  }

  static get RPC_BASE_URL() {
    return `${this.#PROTOCOL}://${this.#HOSTNAME}:${this.#RPC_PORT}`;
  }
}

export default URLConsts;
