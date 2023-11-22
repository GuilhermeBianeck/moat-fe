class BulletTrail {
    // Class variables.
    xPos;
    yPos;
    size;
    scaleFactor;

    markedForDestruct;

    constructor(xPos, yPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        
        this.scaleFactor = 1.0;
        this.size = 10;
        this.markedForDestruct = false;
    }

    draw = (context) => {
        context.fillStyle = "yellow";

        // Calculate coordinates so that trail is centered with respect to the crosshair.
        let x = this.xPos - ((this.size * this.scaleFactor) / 2);
        let y = this.yPos - ((this.size * this.scaleFactor) / 2);

        context.fillRect(x, y, this.size * this.scaleFactor, this.size * this.scaleFactor);
    }

    getScaleFactor = () => {
        return this.scaleFactor;
    }

    setScaleFactor = (scaleFactor) => {
        if (scaleFactor >= 0)
            this.scaleFactor = scaleFactor;
        else
            this.markedForDestruct = true;
    }

    isMarkedForDestruct = () => {
        return this.isMarkedForDestruct;
    }
}

export default BulletTrail;