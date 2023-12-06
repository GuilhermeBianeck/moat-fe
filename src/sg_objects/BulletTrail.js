class BulletTrail {
    // Class variables.
    #xPos;
    #yPos;
    #size;
    #scaleFactor;

    #TRAIL_SIZE_MULTIPLIER = 0.006;
    #TRAIL_LIFESPAN = 200;             // How long the trail will show in milliseconds.

    #markedForDestruct;

    #creationTime;
    #destructionTime;

    constructor(xPos, yPos, creationTime) {
        this.#xPos = xPos;
        this.#yPos = yPos;
        
        this.#creationTime = creationTime;
        this.#destructionTime = this.#creationTime + this.#TRAIL_LIFESPAN;

        this.#scaleFactor = 1.0;
        this.#size = 3;

        this.#markedForDestruct = false;
    }

    draw = (context, timestamp) => {
        context.fillStyle = "yellow";

        let timeUntilDestruct = this.#destructionTime - timestamp;
        this.#scaleFactor = this.#TRAIL_SIZE_MULTIPLIER * timeUntilDestruct;

        let x = this.#xPos;
        let y = this.#yPos;

        let radius = this.#size * this.#scaleFactor;

        if (!(radius < 0)) {
            context.arc(x, y, radius, 0, 2 * Math.PI);

            context.fill();
            context.closePath();
        } else {
            this.#markedForDestruct = true;
        }
    }

    getScaleFactor = () => {
        return this.#scaleFactor;
    }

    isMarkedForDestruct = () => {
        return this.#markedForDestruct;
    }
}

export default BulletTrail;