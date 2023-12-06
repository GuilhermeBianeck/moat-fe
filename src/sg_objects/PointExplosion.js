class PointExplosion {
    points;
    xPos;
    yPos;
    yOffset;
    alpha;
    fontStyle;
    hit = false;

    markedForDestruct;

    creationTime;

    YOFFSET_MULTIPLIER = 0.02;
    TRANSPARENCY_MULTIPLIER = 0.001;

    constructor(points, xPos, yPos, fontStyle, hit, creationTime) {
        this.points = points;
        this.xPos = xPos;
        this.yPos = yPos;

        this.creationTime = creationTime;

        this.yOffset = 0;
        this.alpha = 1.0;
        this.fontStyle = fontStyle;
        this.markedForDestruct = false;

        if (hit === true)
            this.hit = true;
        else
            this.hit = false;
    }

    draw = (context, timestamp) => {
        let objElapsedTime = timestamp - this.creationTime;

        this.yOffset = (this.YOFFSET_MULTIPLIER * objElapsedTime);
        this.alpha = 1 - (this.TRANSPARENCY_MULTIPLIER * objElapsedTime);

        // If point explosion is not visible anymore
        if (this.alpha <= 0.0) {
            this.markedForDestruct = true;

            return;
        }

        if (this.hit === true) {
            context.fillStyle = `rgba(255, 255, 0, ${this.alpha})`;
        } else {
            context.fillStyle = `rgba(139, 0, 0, ${this.alpha})`;
        }

        context.font = this.fontStyle;
        context.textAlign = "center";
        context.textBaseLine = "middle";
        context.fillText(this.points, this.xPos, this.yPos - this.yOffset);
    }

    isMarkedForDestruct = () => {
        return this.markedForDestruct;
    }
}

export default PointExplosion;