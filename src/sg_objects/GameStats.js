class GameStats {
  #misses; // Clicks that did not hit a target.
  #hits; // Targets that have been hit.
  #targetsDisappeared; // Targets that disappeared without being hit.

  constructor() {
    this.resetStats();
  }

  registerHit() {
    this.#hits++;
  }

  registerMiss() {
    this.#misses++;
  }

  registerTargetDisappeared() {
    this.#targetsDisappeared++;
  }

  resetStats() {
    this.#misses = 0;
    this.#hits = 0;
    this.#targetsDisappeared = 0;
  }

  getHits() {
    return this.#hits;
  }

  getMisses() {
    return this.#misses;
  }

  getTargetsDisappeared() {
    return this.#targetsDisappeared;
  }
}

export default GameStats;
