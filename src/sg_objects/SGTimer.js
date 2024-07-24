class SGTimer {
  xPos;
  yPos;
  fontStyle;

  constructor(xPos, yPos, fontStyle) {
    console.log("SGTimer constructor called!");

    this.xPos = xPos;
    this.yPos = yPos;
    this.fontStyle = fontStyle;
  }

  drawTimer = (context, currentTime) => {
    // Draw drop shadow.
    context.font = this.fontStyle;
    context.textAlign = "right";
    context.textBaseLine = "middle";
    context.fillStyle = "#525005";
    context.fillText(currentTime, this.xPos + 2, this.yPos + 2);

    context.fillStyle = "yellow";
    context.font = this.fontStyle;
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillText(currentTime, this.xPos, this.yPos);
  };
}

export default SGTimer;
