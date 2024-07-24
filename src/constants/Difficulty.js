class Difficulty {
  static #difficulties;
  static #DEFAULT_DIFFICULTY;
  static #MAX_DIFFICULTY;
  static #MIN_DIFFICULTY;

  constructor() {
    throw "Constants class cannot be instantiated!";
  }

  static #initCheck() {
    if (this.#difficulties === undefined) this.#initDifficulties();
  }

  static #initDifficulties = () => {
    const easy = {
      name: "Easy",
      tps: 1.5, // Targets Per Second
      default: false,
    };

    const normal = {
      name: "Normal",
      tps: 2.0,
      default: true,
    };

    const hard = {
      name: "Hard",
      tps: 2.5,
      default: false,
    };

    const nightmare = {
      name: "Nightmare",
      tps: 3.0,
      default: false,
    };

    this.#difficulties = new Map();
    this.#difficulties.set(0, easy);
    this.#difficulties.set(1, normal);
    this.#difficulties.set(2, hard);
    this.#difficulties.set(3, nightmare);

    let minDifficulty = Number.MAX_SAFE_INTEGER;
    let maxDifficulty = 0;
    let defaultDifficulty = null;

    if (this.#difficulties.size <= 0) throw "Difficulties have not been set!";

    this.#difficulties.forEach((value, key) => {
      if (key < minDifficulty) minDifficulty = key;

      if (key > maxDifficulty) maxDifficulty = key;

      if (value.default === true) defaultDifficulty = key;

      Object.freeze(this.#difficulties.get(key));
    });

    this.#MIN_DIFFICULTY = minDifficulty;
    this.#MAX_DIFFICULTY = maxDifficulty;

    // Get default difficulty. If not set, use first entry.
    if (defaultDifficulty !== null)
      this.#DEFAULT_DIFFICULTY = defaultDifficulty;
    else this.#DEFAULT_DIFFICULTY = this.#difficulties.entries().next().key();

    Object.freeze(this.#difficulties);
  };

  static get MIN_DIFFICULTY() {
    this.#initCheck();

    return this.#MIN_DIFFICULTY;
  }

  static get MAX_DIFFICULTY() {
    this.#initCheck();

    return this.#MAX_DIFFICULTY;
  }

  static get DEFAULT_DIFFICULTY() {
    this.#initCheck();

    return this.#DEFAULT_DIFFICULTY;
  }

  static getDifficulties() {
    this.#initCheck();

    return this.#difficulties;
  }
}

export default Difficulty;
