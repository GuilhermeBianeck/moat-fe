class GameStats {
  #misses; // Targets that have been hit.
  #hits; // Clicks that did not hit a target.
  #targetsDisappeared; // Targets that disappeared without being hit.

  constructor() {
    this.#misses = 0;
    this.#hits = 0;
    this.#targetsDisappeared = 0;
  }

  registerHit = () => {
    this.#hits++;
  };

  registerMiss = () => {
    this.#misses++;
  };

  registerTargetDisappeared = () => {
    this.#targetsDisappeared++;
  };

  resetStats = () => {
    this.#misses = 0;
    this.#hits = 0;
    this.#targetsDisappeared = 0;
  };

  getHits = () => {
    return this.#hits;
  };

  getMisses = () => {
    return this.#misses;
  };

  getTargetsDisappeared = () => {
    return this.#targetsDisappeared;
  };
}

export default GameStats;
