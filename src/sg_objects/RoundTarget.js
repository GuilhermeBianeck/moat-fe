class RoundTarget {
  static EXPANSION_RATE = 0.001;
  static CONTRACTION_RATE = 0.001;
  static MIDDLE_CIRCLE_SF = 0.6;
  static INNER_CIRCLE_SF = 0.2;

  #xPos;
  #yPos;
  #radius; // Radius before scale factor is applied.
  #scaleFactor;
  #maxScaleFactor;
  #markedForDestruct;
  #isExpanding;
  #isContracting;
  #targetHit;
  #creationTimestamp; // When the target was created in ms.
  #timeContractionStarts; // Time the contraction started in ms.
  #expansionTime; // Difference between expansion start and contraction start.

  constructor(xPos, yPos, radius, creationTimestamp) {
    this.#xPos = xPos;
    this.#yPos = yPos;
    this.#radius = radius;
    this.#scaleFactor = 0.0;
    this.#maxScaleFactor = 1.0;
    this.#markedForDestruct = false;
    this.#isExpanding = true;
    this.#isContracting = false;
    this.#targetHit = false;
    this.#creationTimestamp = creationTimestamp;
  }

  setRadius(radius) {
    if (radius >= 0) this.#radius = radius;
  }

  getRadius() {
    return this.#radius;
  }

  getScaleFactor() {
    return this.#scaleFactor;
  }

  getXPos() {
    return this.#xPos;
  }

  setXPos(xPos) {
    this.#xPos = xPos;
  }

  getYPos() {
    return this.#yPos;
  }

  setYPos(yPos) {
    this.#yPos = yPos;
  }

  draw(context, timestamp) {
    const elapsedTime = timestamp - this.#creationTimestamp;

    if (this.#isExpanding) {
      this.#scaleFactor = RoundTarget.EXPANSION_RATE * elapsedTime;
      if (this.#scaleFactor >= this.#maxScaleFactor) {
        this.#isExpanding = false;
        this.#isContracting = true;
        this.#timeContractionStarts = timestamp;
        this.#expansionTime = this.#timeContractionStarts - this.#creationTimestamp;
      }
    } else if (this.#isContracting) {
      const timeSinceContraction = timestamp - this.#timeContractionStarts;
      const contractionTimeRemaining = this.#expansionTime - timeSinceContraction;
      this.#scaleFactor = RoundTarget.CONTRACTION_RATE * contractionTimeRemaining;
      if (this.#scaleFactor <= 0) {
        this.#markedForDestruct = true;
        this.#scaleFactor = 0;
        this.#radius = 0;
      }
    }

    this.#drawCircle(context, "#ff0000", this.#radius * this.#scaleFactor);
    this.#drawCircle(context, "white", this.#radius * RoundTarget.MIDDLE_CIRCLE_SF * this.#scaleFactor);
    this.#drawCircle(context, "blue", this.#radius * RoundTarget.INNER_CIRCLE_SF * this.#scaleFactor);
  }

  #drawCircle(context, color, radius) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(this.#xPos, this.#yPos, radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }

  isPosInTarget(x, y) {
    const distance = Math.hypot(x - this.#xPos, y - this.#yPos);
    return {
      outerTarget: distance <= this.#radius,
      middleTarget: distance <= this.#radius * RoundTarget.MIDDLE_CIRCLE_SF,
      innerTarget: distance <= this.#radius * RoundTarget.INNER_CIRCLE_SF,
    };
  }

  isMarkedForDestruct() {
    return this.#markedForDestruct;
  }

  destroyTarget() {
    this.#radius = 0;
    this.#scaleFactor = 0.0;
    this.#targetHit = true;
    this.#markedForDestruct = true;
  }

  wasTargetHit() {
    return this.#targetHit;
  }
}

export default RoundTarget;
