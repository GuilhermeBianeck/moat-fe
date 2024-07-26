class Score {
  #playerScore;
  #xPos;
  #yPos;
  #fontStyle;
  #shadowColor;
  #increaseColor;
  #decreaseColor;
  #normalColor;
  #lastUpdateTime;
  #animationDuration;
  #isIncreasing;

  constructor(xPos, yPos, fontStyle, shadowColor = "#1f1f1f", normalColor = "white", increaseColor = "green", decreaseColor = "red", animationDuration = 1000) {
    console.log("Score constructor called!");

    this.#playerScore = 0;
    this.#xPos = xPos;
    this.#yPos = yPos;
    this.#fontStyle = fontStyle;
    this.#shadowColor = shadowColor;
    this.#normalColor = normalColor;
    this.#increaseColor = increaseColor;
    this.#decreaseColor = decreaseColor;
    this.#animationDuration = animationDuration;
    this.#lastUpdateTime = performance.now();
    this.#isIncreasing = true;
  }

  draw = (context) => {
    let message = this.#playerScore + " POINTS";

    // Draw drop shadow
    context.font = this.#fontStyle;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = this.#shadowColor;
    context.fillText(message, this.#xPos + 2, this.#yPos + 2);

    // Calculate animation effect
    const elapsedTime = performance.now() - this.#lastUpdateTime;
    const animationProgress = Math.min(elapsedTime / this.#animationDuration, 1);
    const scale = 1 + 0.5 * Math.sin(animationProgress * Math.PI); // Simple scaling animation

    // Set color based on increase or decrease
    const color = this.#isIncreasing ? this.#increaseColor : this.#decreaseColor;
    context.fillStyle = animationProgress < 1 ? color : this.#normalColor;

    // Draw the score with the animation effect
    context.save();
    context.translate(this.#xPos, this.#yPos);
    context.scale(scale, scale);
    context.translate(-this.#xPos, -this.#yPos);

    context.fillText(message, this.#xPos, this.#yPos);

    context.restore();
  };

  increaseScore = (value) => {
    this.#playerScore += value;
    this.#lastUpdateTime = performance.now(); // Reset the animation timer
    this.#isIncreasing = true;
  };

  decreaseScore = (value) => {
    this.#playerScore = Math.max(0, this.#playerScore - value);
    this.#lastUpdateTime = performance.now(); // Reset the animation timer
    this.#isIncreasing = false;
  };

  getPlayerScore = () => {
    return this.#playerScore;
  };
}

export default Score;
