class PointExplosion {
    points;
    xPos;
    yPos;
    yOffset;
    alpha;
    fontStyle;
    hit = false;

    markedForDestruct;

    constructor(points, xPos, yPos, fontStyle, hit) {
        this.points = points;
        this.xPos = xPos;
        this.yPos = yPos;

        this.yOffset = 0;
        this.alpha = 1.0;
        this.fontStyle = fontStyle;
        this.markedForDestruct = false;

        if (hit === true)
            this.hit = true;
        else
            this.hit = false;
    }

    // Draw is called 60 times a second.
    draw = (context) => {
        this.yOffset = this.yOffset - 0.1;
        this.alpha = this.alpha - 0.01;

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
        context.fillText(this.points, this.xPos, this.yPos + this.yOffset);
    }

    isMarkedForDestruct = () => {
        return this.markedForDestruct;
    }
}

export default PointExplosion;