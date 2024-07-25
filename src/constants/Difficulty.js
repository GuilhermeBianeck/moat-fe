class Difficulty {
  static #difficulties;
  static #DEFAULT_DIFFICULTY;
  static #MAX_DIFFICULTY;
  static #MIN_DIFFICULTY;

  constructor() {
    throw new Error("Constants class cannot be instantiated!");
  }

  static #initCheck() {
    if (!this.#difficulties) {
      this.#initDifficulties();
    }
  }

  static #initDifficulties() {
    const difficulties = [
      { name: "Easy", tps: 1.5, default: false },
      { name: "Normal", tps: 2.0, default: true },
      { name: "Hard", tps: 2.5, default: false },
      { name: "Nightmare", tps: 3.0, default: false },
    ];

    this.#difficulties = new Map();
    let minDifficulty = Number.MAX_SAFE_INTEGER;
    let maxDifficulty = 0;
    let defaultDifficulty = null;

    difficulties.forEach((difficulty, index) => {
      this.#difficulties.set(index, Object.freeze(difficulty));
      if (index < minDifficulty) minDifficulty = index;
      if (index > maxDifficulty) maxDifficulty = index;
      if (difficulty.default) defaultDifficulty = index;
    });

    this.#MIN_DIFFICULTY = minDifficulty;
    this.#MAX_DIFFICULTY = maxDifficulty;
    this.#DEFAULT_DIFFICULTY = defaultDifficulty !== null ? defaultDifficulty : this.#difficulties.keys().next().value;

    Object.freeze(this.#difficulties);
  }

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
