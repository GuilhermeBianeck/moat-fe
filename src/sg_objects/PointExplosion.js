class PointExplosion {
  static YOFFSET_MULTIPLIER = 0.02;
  static TRANSPARENCY_MULTIPLIER = 0.001;

  constructor(points, xPos, yPos, fontStyle, hit = false, creationTime) {
    this.points = points;
    this.xPos = xPos;
    this.yPos = yPos;
    this.fontStyle = fontStyle;
    this.hit = hit;
    this.creationTime = creationTime;

    this.yOffset = 0;
    this.alpha = 1.0;
    this.markedForDestruct = false;
  }

  draw = (context, timestamp) => {
    const elapsedTime = timestamp - this.creationTime;

    this.yOffset = PointExplosion.YOFFSET_MULTIPLIER * elapsedTime;
    this.alpha = 1 - PointExplosion.TRANSPARENCY_MULTIPLIER * elapsedTime;

    // If point explosion is not visible anymore
    if (this.alpha <= 0.0) {
      this.markedForDestruct = true;
      return;
    }

    context.fillStyle = this.hit ? `rgba(255, 255, 0, ${this.alpha})` : `rgba(139, 0, 0, ${this.alpha})`;
    context.font = this.fontStyle;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.points, this.xPos, this.yPos - this.yOffset);
  };

  isMarkedForDestruct = () => this.markedForDestruct;
}

export default PointExplosion;
