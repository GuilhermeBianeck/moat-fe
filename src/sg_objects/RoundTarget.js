class RoundTarget {
  #EXPANSION_RATE = 0.001;
  #CONTRACTION_RATE = 0.001;
  #MIDDLE_CIRCLE_SF = 0.6;
  #INNER_CIRCLE_SF = 0.2;

  #xPos;
  #yPos;
  #radius; // Radius before scalefactor is applied.

  #scaleFactor;
  #maxScaleFactor;
  #markedForDestruct;

  #isExpanding;
  #isContracting;

  #targetHit;

  #creationTimestamp; // When the target was created in ms.

  #timeContractionStarts; // Time the contraction started in ms.
  #expansionTime; // Difference between expansion start and contraction start.

  constructor(xPos, yPos, radius, creationTimeStamp) {
    this.#xPos = xPos;
    this.#yPos = yPos;
    this.#radius = radius;

    this.#scaleFactor = 0.0;
    this.#maxScaleFactor = 1.0;

    this.#markedForDestruct = false;

    this.#isExpanding = true;
    this.#isContracting = false;

    this.#targetHit = false;

    this.#creationTimestamp = creationTimeStamp;
  }

  setRadius = (radius) => {
    if (!(radius < 0)) this.#radius = radius;
  };

  /**
   * Returns the radius before the scale factor or any other transforms are applied.
   */
  getRadius = () => {
    return this.#radius;
  };

  #setScaleFactor = (scaleFactor) => {
    if (scaleFactor <= this.#maxScaleFactor) this.#scaleFactor = scaleFactor;
    else {
      this.#markedForDestruct = true;
    }
  };

  getScaleFactor = () => {
    return this.#scaleFactor;
  };

  getXPos = () => {
    return this.#xPos;
  };

  setXPos = (xPos) => {
    this.#xPos = xPos;
  };

  getYPos = () => {
    return this.#yPos;
  };

  setYPos = (yPos) => {
    this.#yPos = yPos;
  };

  draw = (context, timestamp) => {
    let objElapsedTime = timestamp - this.#creationTimestamp;

    if (this.#isExpanding === true) {
      this.#scaleFactor = this.#EXPANSION_RATE * objElapsedTime;

      if (this.#scaleFactor >= this.#maxScaleFactor) {
        this.#isExpanding = false;
        this.#isContracting = true;

        this.#timeContractionStarts = timestamp;
        this.#expansionTime =
          this.#timeContractionStarts - this.#creationTimestamp;
      }
    } else if (this.#isContracting === true) {
      let timeSinceContraction = timestamp - this.#timeContractionStarts;
      let contractionTimeExpired = this.#expansionTime - timeSinceContraction;

      this.#scaleFactor = this.#CONTRACTION_RATE * contractionTimeExpired;

      if (this.#scaleFactor <= 0) {
        this.#isExpanding = false;
        this.#isContracting = false;

        this.#markedForDestruct = true;
        this.#scaleFactor = 0;
        this.#radius = 0;
      }
    }

    // Draw outer circle.
    context.beginPath();
    context.fillStyle = "#ff0000";
    context.arc(
      this.#xPos,
      this.#yPos,
      this.#radius * this.#scaleFactor,
      0,
      2 * Math.PI
    );
    context.fill();
    context.closePath();

    // Draw middle circle.
    context.beginPath();
    context.fillStyle = "white";
    context.arc(
      this.#xPos,
      this.#yPos,
      this.#radius * this.#MIDDLE_CIRCLE_SF * this.#scaleFactor,
      0,
      2 * Math.PI
    );
    context.fill();
    context.closePath();

    // Draw inner circle.
    context.beginPath();
    context.fillStyle = "blue";
    context.arc(
      this.#xPos,
      this.#yPos,
      this.#radius * this.#INNER_CIRCLE_SF * this.#scaleFactor,
      0,
      2 * Math.PI
    );
    context.fill();
    context.closePath();
  };

  /**
   * Checks if the current position is inside the target object.
   *
   * @param {int} x
   * @param {int} y
   * @returns An object with boolean values depicting whether any of the target's
   * inner or outer circles where hit.
   */
  isPosInTarget = (x, y) => {
    // Calculate the point's distance from the center of the circle.
    let temp = (x - this.#xPos) ** 2 + (y - this.#yPos) ** 2;
    let distance = Math.sqrt(temp);

    let isPosInTargObj = {
      outerTarget: false,
      middleTarget: false,
      innerTarget: false,
    };

    if (distance < this.#radius * this.#INNER_CIRCLE_SF)
      isPosInTargObj.innerTarget = true;
    else if (distance <= this.#radius * this.#MIDDLE_CIRCLE_SF)
      isPosInTargObj.middleTarget = true;
    else if (distance <= this.#radius) isPosInTargObj.outerTarget = true;

    return isPosInTargObj;
  };

  isMarkedForDestruct = () => {
    return this.#markedForDestruct;
  };

  // If the target was hit.
  destroyTarget = () => {
    this.#radius = 0;
    this.#scaleFactor = 0.0;
    this.#targetHit = true;

    this.#markedForDestruct = true;
  };

  wasTargetHit = () => {
    return this.#targetHit;
  };
}

export default RoundTarget;
