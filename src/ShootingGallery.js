import React, { Component, createRef } from "react";
import SGTimer from "./sg_objects/SGTimer";
import RoundTarget from "./sg_objects/RoundTarget";
import BulletTrail from "./sg_objects/BulletTrail";
import Score from "./sg_objects/Score";
import Sounds from "./sg_objects/Sounds";
import PointExplosion from "./sg_objects/PointExplosion";
import TargetExplosion from "./sg_objects/TargetExplosion";
import GameStats from "./sg_objects/GameStats";
import "./css/ShootingGallery.css";
import Difficulty from "./constants/Difficulty";

/**
 * The main class representing the ShootingGallery Game logic.
 */

class ShootingGallery extends Component {
  CANVAS_INIT_WIDTH = 600;
  CANVAS_INIT_HEIGHT = 800;

  DEF_TARGET_RADIUS = 30;
  FONT_STR = "apple-kit, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Ubuntu', Arial";
  DEFAULT_FONT = `bold 18px ${this.FONT_STR}`;
  DEFAULT_FONT_SMALLER = `bold 17px ${this.FONT_STR}`;
  DEFAULT_SCORE_FONT = `bold 17px ${this.FONT_STR}`;
  DEFAULT_TIME_FONT = `bold 17px ${this.FONT_STR}`;
  DEFAULT_POINT_EXPL_FONT = `bold 14px ${this.FONT_STR}`;

  TARG_HIT_SCORE = 20;
  TARG_MIDDLE_HIT_SCORE = 30;
  TARG_INNER_HIT_SCORE = 40;
  TARG_MISS_PENALTY = 40;

  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      gameEnded: false,
      readyToRestart: false,
    };

    this.canvasContainerDiv = createRef();
    this.canvas = createRef();

    this.sounds = new Sounds();
    this.sounds.setShouldPlayMusic(props.playMusic);
    this.sounds.setShouldPlaySounds(props.playSounds);

    this.gameStats = new GameStats();
    this.gameLength = 45; // Game duration in seconds

    this.pointExplosions = new Set();
    this.roundTargets = new Set();
    this.targetExplosions = new Set();

    this.setDifficulty(props.difficulty);

    this.animFrameReqId = null;
    this.elapsedTime = 0;
    this.lastTargetDrawn = 0;

    this.startTimestamp = undefined;
    this.previousTimestamp = undefined;
    this.handleResizeEvent = false;
  }

  componentDidMount() {
    this.initCanvas();
    window.addEventListener("resize", this.resizeEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventListener);
    this.sounds.stopMusic();
    cancelAnimationFrame(this.animFrameReqId);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.playMusic !== nextProps.playMusic) {
      this.sounds.setShouldPlayMusic(nextProps.playMusic, this.state.gameStarted);
    }
    if (this.props.playSounds !== nextProps.playSounds) {
      this.sounds.setShouldPlaySounds(nextProps.playSounds);
    }
    return true;
  }

  componentDidUpdate() {
    this.initCanvas();
  }

  setDifficulty = (value) => {
    const difficulty = parseInt(value, 10) || Difficulty.DEFAULT_DIFFICULTY;
    const difficulties = Difficulty.getDifficulties();
    this.difficulty = difficulty;
    this.targetsPerSecond = difficulties.get(difficulty).tps;
  };

  initCanvas = () => {
    if (this.canvas.current.getContext) {
      this.context = this.canvas.current.getContext("2d");
      this.resizeCanvas(this.canvasContainerDiv.current.clientWidth, this.canvasContainerDiv.current.clientHeight);
      this.drawBackground();
      if (!this.state.gameStarted) this.drawWelcomeMessage();
      else if (this.state.gameEnded) this.drawFinishedMessage();
      this.resetTimerAndScore();
    } else {
      console.error("Canvas not supported!");
    }
  };

  resizeCanvas = (width, height) => {
    this.prevHeight = this.canvas.current.height;
    this.prevWidth = this.canvas.current.width;
    this.canvas.current.height = height;
    this.canvas.current.width = width;
  };

  resetTimerAndScore = () => {
    this.sGTimer = new SGTimer(this.canvas.current.width - 10, 19, this.DEFAULT_SCORE_FONT);
    this.score = new Score(this.canvas.current.width / 2, 45, this.DEFAULT_SCORE_FONT);
  };

  resizeEventListener = () => {
    this.handleResizeEvent = true;
    this.initCanvas();
  };

  drawBackground = () => {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.current.width, this.canvas.current.height);
  };

  drawBackgroundOverlay = () => {
    this.context.fillStyle = "rgba(0,0,0,0.5)";
    this.context.fillRect(0, 0, this.canvas.current.width, this.canvas.current.height);
  };

  drawWelcomeMessage = () => {
    const message = "CLICK TO CONTINUE";
    this.drawShadowedText(message, this.canvas.current.width / 2, this.canvas.current.height / 2, this.DEFAULT_FONT, "yellow", "#525005");
  };

  drawFinishedMessage = () => {
    const message = "TIMER EXPIRED";
    const messageYPos = this.canvas.current.height / 2 - 50;
    this.drawShadowedText(message, this.canvas.current.width / 2, messageYPos, this.DEFAULT_FONT, "yellow", "#525005");
    const scoreMessage = `YOU SCORED ${this.score.getPlayerScore()} POINTS!`;
    const scrMessageYPos = this.canvas.current.height / 2;
    this.drawShadowedText(scoreMessage, this.canvas.current.width / 2, scrMessageYPos, this.DEFAULT_FONT, "yellow", "#525005");
  };

  drawShadowedText = (message, x, y, font, color, shadowColor) => {
    this.context.font = font;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillStyle = shadowColor;
    this.context.fillText(message, x + 2, y + 2);
    this.context.fillStyle = color;
    this.context.fillText(message, x, y);
  };

  beginAnimation = () => {
    this.sounds.playMusic();
    this.setDifficulty(this.props.difficulty);
    this.updateProgress();
  };

  restartGame = () => {
    if (this.state.readyToRestart) {
      this.sounds.stopMusic();
      this.resetTimerAndScore();
      this.setState({ gameStarted: true, gameEnded: false, readyToRestart: false });
      this.pointExplosions.clear();
      this.roundTargets.clear();
      this.targetExplosions.clear();
      this.gameStats = new GameStats();
      this.animFrameReqId = null;
      this.startTimestamp = undefined;
      this.previousTimestamp = undefined;
      this.elapsedTime = 0;
      this.lastTargetDrawn = 0;
      this.beginAnimation();
    } else {
      console.log("Game is not ready to restart!");
    }
  };

  finishGame = () => {
    this.setState({ gameEnded: true });
    cancelAnimationFrame(this.animFrameReqId);
    this.drawBackgroundOverlay();
    this.drawFinishedMessage();
    this.sleepSetReadyToStart();
    this.props.setLastGameStats(this.gameStats);
    this.props.sendScoreToServer(this.score.getPlayerScore());
  };

  sleepSetReadyToStart = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    this.setState({ readyToRestart: true });
    const clickMessage = "CLICK TO PLAY AGAIN";
    const clickMessageYPos = this.canvas.current.height / 2 + 50;
    this.drawShadowedText(clickMessage, this.canvas.current.width / 2, clickMessageYPos, this.DEFAULT_FONT_SMALLER, "white", "#1f1f1f");
  };

  updateProgress = (timestamp) => {
    if (timestamp !== undefined) {
      if (this.startTimestamp === undefined) this.startTimestamp = timestamp;
      this.elapsedTime = timestamp - this.startTimestamp;
    }

    if (this.elapsedTime >= this.gameLength * 1000) {
      this.finishGame();
      return;
    }

    this.drawBackground();
    this.drawTargetExplosions(timestamp);
    this.drawRoundTargets(timestamp);
    this.drawBulletTrail(timestamp);
    this.drawPointsExplosions(timestamp);
    this.sGTimer.drawTimer(this.context, (this.gameLength - this.getGameTime()).toFixed(1));
    this.score.draw(this.context);

    if (this.elapsedTime - this.lastTargetDrawn > 1000 / this.targetsPerSecond) {
      this.createRoundTarget(timestamp);
      this.lastTargetDrawn = this.elapsedTime;
    }

    if (this.handleResizeEvent) this.handleResizeEvent = false;

    this.animFrameReqId = requestAnimationFrame(this.updateProgress);
    this.previousTimestamp = timestamp;
  };

  getGameTime = () => this.elapsedTime / 1000;

  getTargetRadius = () => this.DEF_TARGET_RADIUS * this.getAvgResizeRatio();

  getAvgResizeRatio = () => (this.getResizeHeightRatio() + this.getResizeWidthRatio()) / 2;

  getResizeHeightRatio = () => this.canvas.current.height / this.CANVAS_INIT_HEIGHT;

  getResizeWidthRatio = () => this.canvas.current.width / this.CANVAS_INIT_WIDTH;

  createRoundTarget = (timestamp) => {
    const targetRadius = this.getTargetRadius();
    const randX = Math.random() * this.canvas.current.width;
    const randY = Math.random() * this.canvas.current.height;
    const { xPos, yPos } = this.checkAndReposOffScreenTarget(randX, randY, targetRadius);
    this.roundTargets.add(new RoundTarget(xPos, yPos, targetRadius, timestamp));
  };

  checkAndReposOffScreenTarget = (xPos, yPos, targetRadius) => {
    if (xPos + targetRadius >= this.canvas.current.width) xPos -= targetRadius;
    if (xPos - targetRadius <= 0) xPos += targetRadius;
    if (yPos + targetRadius >= this.canvas.current.height) yPos -= targetRadius;
    if (yPos - targetRadius <= 0) yPos += targetRadius;
    return { xPos, yPos };
  };

  drawRoundTargets = (timestamp) => {
    this.roundTargets.forEach((roundTarget) => {
      if (roundTarget.isMarkedForDestruct()) {
        if (!roundTarget.wasTargetHit()) this.gameStats.registerTargetDisappeared();
        this.roundTargets.delete(roundTarget);
        this.sounds.playDisappear();
      } else {
        if (this.handleResizeEvent) this.resizeRoundTarget(roundTarget);
        roundTarget.draw(this.context, timestamp);
      }
    });
  };

  resizeRoundTarget = (roundTarget) => {
    const targetRadius = this.getTargetRadius();
    if (roundTarget.getRadius() !== targetRadius) roundTarget.setRadius(targetRadius);
    const xPos = roundTarget.getXPos();
    const yPos = roundTarget.getYPos();
    const prevHeightRatio = this.prevHeight / this.CANVAS_INIT_HEIGHT;
    const prevWidthRatio = this.prevWidth / this.CANVAS_INIT_WIDTH;
    const newXPos = (1 - (prevWidthRatio - this.getResizeWidthRatio())) * xPos;
    const newYPos = (1 - (prevHeightRatio - this.getResizeHeightRatio())) * yPos;
    roundTarget.setXPos(newXPos);
    roundTarget.setYPos(newYPos);
    const { xPos: finalX, yPos: finalY } = this.checkAndReposOffScreenTarget(newXPos, newYPos, targetRadius);
    roundTarget.setXPos(finalX);
    roundTarget.setYPos(finalY);
  };

  drawPointsExplosions = (timestamp) => {
    this.pointExplosions.forEach((pointExplosion) => {
      if (pointExplosion.isMarkedForDestruct()) {
        this.pointExplosions.delete(pointExplosion);
      } else {
        pointExplosion.draw(this.context, timestamp);
      }
    });
  };

  drawTargetExplosions = (timestamp) => {
    this.targetExplosions.forEach((targetExplosion) => {
      if (targetExplosion.isMarkedForDestruct()) {
        this.targetExplosions.delete(targetExplosion);
      } else {
        targetExplosion.draw(this.context, timestamp);
      }
    });
  };

  drawBulletTrail = (timestamp) => {
    if (this.bulletTrail && !this.bulletTrail.isMarkedForDestruct()) {
      this.bulletTrail.draw(this.context, timestamp);
    } else {
      this.bulletTrail = null;
    }
  };

  calcClickPosition = (clientX, clientY) => {
    const rect = this.canvas.current.getBoundingClientRect();
    return { xPos: clientX - rect.left, yPos: clientY - rect.top };
  };

  handleClick = (event) => {
    const { gameStarted, gameEnded } = this.state;
    if (!gameStarted) {
      this.setState({ gameStarted: true });
      this.beginAnimation();
      return;
    }

    if (gameStarted && gameEnded) {
      this.restartGame();
      return;
    }

    this.sounds.playShot();
    const { xPos, yPos } = this.calcClickPosition(event.clientX, event.clientY);
    let targetWasHit = false;

    this.roundTargets.forEach((roundTarget) => {
      const resultObj = roundTarget.isPosInTarget(xPos, yPos);
      if (resultObj.innerTarget) {
        targetWasHit = true;
        this.playerHitTarget(xPos, yPos, this.TARG_INNER_HIT_SCORE, roundTarget);
      } else if (resultObj.middleTarget) {
        targetWasHit = true;
        this.playerHitTarget(xPos, yPos, this.TARG_MIDDLE_HIT_SCORE, roundTarget);
      } else if (resultObj.outerTarget) {
        targetWasHit = true;
        this.playerHitTarget(xPos, yPos, this.TARG_HIT_SCORE, roundTarget);
      }
    });

    this.bulletTrail = new BulletTrail(xPos, yPos, this.previousTimestamp);

    if (targetWasHit) {
      this.gameStats.registerHit();
      this.sounds.playHit();
    } else {
      this.score.decreaseScore(this.TARG_MISS_PENALTY);
      this.gameStats.registerMiss();
      this.sounds.playMiss();
      this.pointExplosions.add(new PointExplosion(this.TARG_MISS_PENALTY, xPos, yPos, this.DEFAULT_POINT_EXPL_FONT, false));
    }
  };

  playerHitTarget = (x, y, score, target) => {
    this.targetExplosions.add(new TargetExplosion(x, y, this.previousTimestamp));
    this.pointExplosions.add(new PointExplosion(score, x, y, this.DEFAULT_POINT_EXPL_FONT, true, this.previousTimestamp));
    this.score.increaseScore(score);
    target.destroyTarget();
  };

  render() {
    return (
      <div className="shootingGalleryGame" ref={this.canvasContainerDiv}>
        <canvas
          width={this.CANVAS_INIT_WIDTH}
          height={this.CANVAS_INIT_HEIGHT}
          id="shootingGalleryCanvas"
          className="RoundBorder"
          ref={this.canvas}
          onClick={this.handleClick}
        ></canvas>
      </div>
    );
  }
}

export default ShootingGallery;
