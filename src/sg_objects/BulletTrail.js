class BulletTrail {
    // Class variables.
    #xPos;
    #yPos;
    #size;
    #scaleFactor;

    #TRAIL_SIZE_MULTIPLIER = 0.0009;

    #markedForDestruct;

    #creationTime;

    constructor(xPos, yPos, creationTime) {
        this.#xPos = xPos;
        this.#yPos = yPos;
        
        this.#creationTime = creationTime;

        this.#scaleFactor = 1.0;
        this.#size = 3;

        this.#markedForDestruct = false;
    }

    draw = (context, timestamp) => {
        let objElapsedTime = timestamp - this.#creationTime;

        context.fillStyle = "yellow";

        // Calculate coordinates so that trail is centered with respect to the crosshair.
        this.#scaleFactor = this.#scaleFactor - (this.#TRAIL_SIZE_MULTIPLIER * objElapsedTime);

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