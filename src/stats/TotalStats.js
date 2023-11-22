class TotalStats {
    #totalHits;
    #totalMisses;
    #totalDisappeared;
    #totalGamesPlayed;

    constructor() {
        this.#totalHits = 0;
        this.#totalMisses = 0;
        this.#totalDisappeared = 0;
        this.#totalGamesPlayed = 0;
    }

    setTotalHits = (totalHits) => {
        if (totalHits !== typeof(number))
            totalHits = parseInt(totalHits);

        this.#totalHits = totalHits;
    }

    incTotalHits = (amount) => {
        if (amount !== typeof(number))
            amount = parseInt(amount);

        this.#totalHits = this.#totalHits + amount;
    }

    setTotalMisses = (totalMisses) => {
        if (totalMisses !== typeof(number))
            totalMisses = parseInt(totalMisses);

        this.#totalMisses = totalMisses;
    }

    incTotalMisses = (amount) => {
        if (amount !== typeof(number))
            amount = parseInt(amount);

        this.#totalMisses = this.#totalMisses + amount;
    }

    setTotalDisappeared = (totalDisappeared) => {
        if (totalDisappeared !== typeof(number))
            totalDisappeared = parseInt(totalDisappeared);

        this.#totalDisappeared = totalDisappeared;
    }

    incTotalDisappeared = (amount) => {
        if (amount !== typeof(number))
            amount = parseInt(amount);

        this.#totalDisappeared = this.#totalDisappeared + amount;
    }

    setTotalGamesPlayed = (totalGamesPlayed) => {
        if (totalGamesPlayed !== typeof(number))
            totalGamesPlayed = parseInt(totalGamesPlayed);

        this.#totalGamesPlayed = totalGamesPlayed;
    }

    incTotalGamesPlayed = (amount) => {
        if (amount !== typeof(number))
            amount = parseInt(amount);

        this.#totalGamesPlayed = this.#totalGamesPlayed + amount;
    }

    getTotalHits = () => {
        return this.#totalHits;
    }

    getTotalMisses = () => {
        return this.#totalMisses;
    }

    getTotalDisappeared = () => {
        return this.#totalDisappeared;
    }

    getTotalGamesPlayed = () => {
        return this.#totalGamesPlayed;
    }

    /**
     * Calculates and returns the total accuracy.
     * Can return NaN if the stats are empty.
     * 
     * @returns Accuracy rounded to the nearest integer.
     */
    getTotalAccuracy = () => {
        if (this.#totalHits === 0 && this.#totalMisses === 0)
            return 0;

        let accuracy = (this.#totalHits / (this.#totalMisses + this.#totalHits)
                * 100).toFixed();
        
        return accuracy;
    }
}

export default TotalStats;