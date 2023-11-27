import React from 'react';
import SGTimer from './sg_objects/SGTimer.js';
import RoundTarget from './sg_objects/RoundTarget.js';
import BulletTrail from './sg_objects/BulletTrail.js';
import Score from './sg_objects/Score.js';
import Sounds from './sg_objects/Sounds.js';
import PointExplosion from './sg_objects/PointExplosion.js';
import TargetExplosion from './sg_objects/TargetExplosion.js';
import GameStats from './sg_objects/GameStats.js';
import './css/ShootingGallery.css';

import Difficulty from './constants/Difficulty.js';

class ShootingGallery extends React.Component {
    #CANVAS_INIT_WIDTH = 600;
    #CANVAS_INIT_HEIGHT = 800;

    #DEF_TARGET_RADIUS = 30;
    #FONT_STR = "apple-kit, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Ubuntu', Arial";
    #DEFAULT_FONT = "bold 18px " + this.#FONT_STR;
    #DEFAULT_FONT_SMALLER = "bold 17px " + this.#FONT_STR;
    #DEFAULT_SCORE_FONT = "bold 17px " + this.#FONT_STR;
    #DEFAULT_TIME_FONT = "bold 17px " + this.#FONT_STR;
    #DEFAULT_POINT_EXPL_FONT = "bold 14px " + this.#FONT_STR;

    #TARG_HIT_SCORE = 20;
    #TARG_MIDDLE_HIT_SCORE = 30;
    #TARG_INNER_HIT_SCORE = 40;
    #TARG_MISS_PENALTY = 40;

    state = {
    }

    // Class variables.
    #canvas;
    #context;

    #canvasContainerDiv;

    #sounds;             // Sounds class.
    #sGTimer;            // SGTimer class.
    #score;              // PlayerScore class.
    #bulletTrail;
    #pointExplosions;    // Set to hold point explosion objects.
    #roundTargets;       // Set to hold round targets.
    #targetExplosions;   // Set to hold target explosion objects.
    #gameStarted;        // Bool indicating if the game has been started.
    #gameEnded;          // Bool indicating if the game has ended.
    #readyToRestart;     // Boolean to indicate whether the game is ready to restart.
    #gameLength;         // Time in seconds for duration of game.
    #difficulty;
    #targetsPerSecond;   // Number of targets to spawn per second.

    #animFrameReqId;     // Animation frame request ID for cancelling animation.

    // Number of ticks expired since game has started.
    // Divide by 60 to get the seconds.
    #gameTicks;

    #gameStats;              // Stats class object for registering hits, etc.

    #handleResizeEvent;
    #prevHeight;
    #prevWidth;

    // Remember that the constructor is called twice.
    constructor(props) {
        console.log("ShootingGallery constructor called!");
        super(props);

        this.#handleResizeEvent = false;
        this.#prevHeight = this.#CANVAS_INIT_HEIGHT;
        this.#prevWidth = this.#CANVAS_INIT_WIDTH;

        this.#canvasContainerDiv = React.createRef();

        this.#canvas = React.createRef();

        this.#gameTicks = 0;

        this.#sounds = new Sounds();
        this.#sounds.setShouldPlayMusic(this.props.playMusic);
        this.#sounds.setShouldPlaySounds(this.props.playSounds);

        this.#gameStats = new GameStats();

        this.#gameLength = 45;     // 45 second gamelength.
        // this.#gameLength = 5;

        this.#gameStarted = false;
        this.#gameEnded = false;
        this.#readyToRestart = false;

        this.#pointExplosions = new Set();
        this.#roundTargets = new Set();
        this.#targetExplosions = new Set();

        this.#animFrameReqId = null;

        this.setDifficulty(props.difficulty);
    }

    // Initialisation should go here.
    componentDidMount = () => {
        this.#initCanvas();

        // Add resize listener.
        console.log("Adding window resize listener.");
        window.addEventListener("resize", this.#resizeEventListener);
    }

    // Destructor
    componentWillUnmount = () => {
        console.log("Cleaning up ShootingGallery before unmount.");

        console.log("Window resize listener removed.");
        window.removeEventListener("resize", this.#resizeEventListener);

        this.#sounds.stopMusic();
    }

    shouldComponentUpdate = (newProps, newState) => {
        // If play music option has changed.
        if (this.props.playMusic !== newProps.playMusic) {
            if (this.#gameStarted === true)
                this.#sounds.setShouldPlayMusic(newProps.playMusic, true);
            else
                this.#sounds.setShouldPlayMusic(newProps.playMusic, false);
        }

        // If play sounds option has changed.
        if (this.props.playSounds !== newProps.playSounds)
            this.#sounds.setShouldPlaySounds(newProps.playSounds);

        return true;
    }

    // Prevents current context from becoming stale and throwing an error.
    componentDidUpdate = (prevProps, prevState) => {
        this.#initCanvas();
    }

    #initCanvas = () => {
        console.log("Initialising canvas.");

        // Check that the browser supports canvas.
        if (this.#canvas.current.getContext) {
            console.log("Getting 2d context.");
            this.#context = this.#canvas.current.getContext("2d");

            // Set the size of the canvas to the containing div size.
            this.#resizeCanvas(this.#canvasContainerDiv.current.clientWidth,
                    this.#canvasContainerDiv.current.clientHeight);

            this.#drawBackground();
        } else {
            // TODO: Do something here to signal that the browser does not support HTML canvas.
            console.log("Canvas not supported!");
        }

        // Draw welcome message.
        if (this.#gameStarted === false)
            this.#drawWelcomeMessage();
        else if (this.#gameEnded === true)
            this.#drawFinishedMessage();

        this.#resetTimerAndScore();
    }

    #resetTimerAndScore = () => {
        this.#sGTimer = new SGTimer(this.#canvas.current.width - 10, 19, this.#DEFAULT_SCORE_FONT);
        this.#score = new Score(this.#canvas.current.width - 10, 45, this.#DEFAULT_SCORE_FONT);
    }

    #resizeEventListener = (evt) => {
        console.log("SG Container div was resized.");
        this.#handleResizeEvent = true;

        this.#initCanvas();
    }

    #resizeCanvas = (width, height) => {
        this.#prevHeight = this.#canvas.current.height;
        this.#prevWidth = this.#canvas.current.width;

        this.#canvas.current.height = height;
        this.#canvas.current.width = width;

        console.log("Resized canvas height: " + this.#canvas.current.height);
        console.log("Resized canvas width: " + this.#canvas.current.width);
    }

    setDifficulty = (value) => {
        let difficulty;
        try {
            difficulty = parseInt(value);
        } catch (error) {
            console.log("Error parsing difficulty!");
            difficulty = Difficulty.DEFAULT_DIFFICULTY;
        }

        let difficulties = Difficulty.getDifficulties();

        this.#difficulty = difficulty;
        this.#targetsPerSecond = difficulties.get(difficulty).tps;
        console.log(difficulties.get(difficulty).name + " difficulty selected.");
    }

    // Note this must be done before any other drawing.
    #drawBackground = () => {
        if (this.#canvas.current !== null) {
            this.#context.fillStyle = "black";
            this.#context.fillRect(0, 0, this.#canvas.current.width, this.#canvas.current.height);
        }
    }

    #drawBackgroundOverlay = () => {
        if (this.#canvas.current !== null) {
            this.#context.fillStyle = "rgba(0,0,0,0.5)";
            this.#context.fillRect(0, 0, this.#canvas.current.width, this.#canvas.current.height);
        }
    }

    #drawWelcomeMessage = () => {
        let message = "CLICK TO CONTINUE";
        this.#drawShadowedText(message, this.#canvas.current.width / 2,
                this.#canvas.current.height / 2, this.#DEFAULT_FONT, "yellow", "#525005");
    }

    #drawFinishedMessage = () => {
        let message = "TIMER EXPIRED";
        let messageYPos = (this.#canvas.current.height / 2) - 50;
        this.#drawShadowedText(message, this.#canvas.current.width / 2, messageYPos,
                this.#DEFAULT_FONT, "yellow", "#525005");

        let scoreMessage = `YOU SCORED ${this.#score.getPlayerScore()} POINTS!`;
        let scrMessageYPos = this.#canvas.current.height / 2;
        this.#drawShadowedText(scoreMessage, this.#canvas.current.width / 2, scrMessageYPos,
                this.#DEFAULT_FONT, "yellow", "#525005");
    }

    #drawShadowedText = (message, x, y, font, colour, shadowColour) => {
        // Draw drop shadow.
        this.#context.font = font;
        this.#context.textAlign = "center";
        this.#context.textBaseLine = "middle";
        this.#context.fillStyle = shadowColour;
        this.#context.fillText(message, x + 2, y + 2);

        // Draw main text.
        this.#context.font = font;
        this.#context.textAlign = "center";
        this.#context.textBaseLine = "middle";
        this.#context.fillStyle = colour;
        this.#context.fillText(message, x, y);
    }

    // Starts the game.
    #beginAnimation = () => {
        console.log("Starting animation!");
        this.#sounds.playMusic();
        this.setDifficulty(this.props.difficulty);

        this.#updateProgress();
    }

    // Reset  the variables and restart the game.
    #restartGame = () => {
        if (this.#readyToRestart === true) {
            this.#sounds.stopMusic();

            this.#gameTicks = 0;
            this.#resetTimerAndScore();

            this.#gameStarted = false;
            this.#gameEnded = false;
            this.#readyToRestart = false;

            this.#pointExplosions = new Set();
            this.#roundTargets = new Set();
            this.#targetExplosions = new Set();

            this.#gameStats = new GameStats();

            this.#animFrameReqId = null;

            this.#gameStarted = true;
            this.#beginAnimation();
        } else {
            console.log("Game is not ready to restart!");
        }
    }

    #finishGame = () => {
        this.#gameEnded = true;

        // End animation.
        if (this.#animFrameReqId != null) {
            console.log("Cancelling animation frame!");
            cancelAnimationFrame(this.#animFrameReqId);
        }

        // Overlay canvas with transparent black rectangle.
        this.#drawBackgroundOverlay();

        // Show finish message and high scores
        this.#drawFinishedMessage();
        this.#sleepSetReadyToStart();

        this.props.setLastGameStats(this.#gameStats);
        console.log(`Hits: ${this.#gameStats.getHits()} Misses: ${this.#gameStats.getMisses()} `
                + `Disappeared: ${this.#gameStats.getTargetsDisappeared()}`);

        // Send score to server.
        this.props.sendScoreToServer(this.#score.getPlayerScore());

        console.log("Exiting finishGame() function!");
    }

    // Sleep for 1 second, then set the game to be able to restart.
    // Avoids the user clicking to restart the game too fast.
    #sleepSetReadyToStart = async () => {
        console.log("Sleeping!");
        await new Promise(r => setTimeout(r, 1000 * 1));
        this.#readyToRestart = true;

        let clickMessage = "CLICK TO PLAY AGAIN";
        let clickMessageYPos = (this.#canvas.current.height / 2) + 50;
        this.#drawShadowedText(clickMessage, this.#canvas.current.width / 2, clickMessageYPos,
                this.#DEFAULT_FONT_SMALLER, "white", "#1f1f1f");

        console.log("Game is now ready to restart!");
    }

    // Updates the animations on the canvas.
    // Gets called 60 times per second.
    #updateProgress = () => {
        this.#gameTicks++;

        // Check that the game time hasn't expired.
        let gameLengthInTicks = this.#gameLength * 60;
        if (gameLengthInTicks < this.#gameTicks) {
            console.log("Game timer has expired!");
            this.#finishGame();

            return;
        }

        // Clear screen.
        this.#drawBackground();

        this.#drawTargetExplosions();
        this.#drawRoundTargets();
        this.#drawBulletTrail();
        this.#drawPointsExplosions();
        this.#sGTimer.drawTimer(this.#context, (this.#gameLength - this.#getGameTime()).toFixed(1));
        this.#score.draw(this.#context);

        // Every 2 seconds, do something.
        if (this.#gameTicks % 120 === 0) {
        }

        // Spawn a target based on targetsPerSecond.
        if (this.#gameTicks % (60 / this.#targetsPerSecond) === 0) {
            this.#createRoundTarget();
        }

        // Finished handling resize event.
        if (this.#handleResizeEvent === true)
            this.#handleResizeEvent = false;

        this.#animFrameReqId = requestAnimationFrame(this.#updateProgress);
    }

    // Returns the game time in seconds.
    #getGameTime = () => {
        let gameTime = this.#gameTicks / 60;

        return gameTime;
    }

    // Returns the target radius based on current canvas size.
    #getTargetRadius = () => {
        let targetRadius = this.#DEF_TARGET_RADIUS * this.#getAvgResizeRatio();

        return targetRadius;
    }

    // Returns the average ratio between canvas size and default canvas size.
    // This is used to resize targets and other elements on the canvas after
    // a resize event.
    #getAvgResizeRatio = () => {
        let heightRatio = this.#getResizeHeightRatio();
        let widthRatio = this.#getResizeWidthRatio();

        let average = (heightRatio + widthRatio) / 2;

        return average;
    }

    #getResizeHeightRatio = () => {
        if (this.#canvas.current !== null)
            return this.#canvas.current.height / this.#CANVAS_INIT_HEIGHT;
    }

    #getResizeWidthRatio = () => {
        if (this.#canvas.current !== null)
            return this.#canvas.current.width / this.#CANVAS_INIT_WIDTH;
    }

    #createRoundTarget = () => {
        if (this.#canvas.current !== null) {
            let targetRadius = this.#getTargetRadius();

            let randX = Math.floor(Math.random() * this.#canvas.current.width);
            let randY = Math.floor(Math.random() * this.#canvas.current.height);

            let coorObj = this.#checkAndReposOffScreenTarget(randX, randY, targetRadius);

            let roundTarget = new RoundTarget(coorObj.xPos, coorObj.yPos, targetRadius);
            this.#roundTargets.add(roundTarget);
        }
    }

    // Checks if the supplied target position is onscreen and recalculates if not.
    #checkAndReposOffScreenTarget = (xPos, yPos, targetRadius) => {
        // Bounds checking
        if (xPos + targetRadius >= this.#canvas.current.width)
            xPos = xPos - targetRadius;

        if (xPos - targetRadius <= 0)
            xPos = xPos + targetRadius;

        if (yPos + targetRadius >= this.#canvas.current.height)
            yPos = yPos - targetRadius;

        if (yPos - targetRadius <= 0)
            yPos = yPos + targetRadius;

        return {xPos, yPos};
    }

    #drawRoundTargets = () => {
        // Loop through round targets set and draw them.
        const myIterator = this.#roundTargets.values();

        for (const roundTarget of myIterator) {
            // Check if the target is marked for destuction
            if (roundTarget.isMarkedForDestruct()) {
                // Was target hit or left to disappear?
                if (!roundTarget.wasTargetHit())
                    this.#gameStats.registerTargetDisappeared();

                this.#roundTargets.delete(roundTarget);
                this.#sounds.playDisappear();

                break;
            }

            // Handle a canvas resize event.
            if (this.#handleResizeEvent === true) {
                console.log("Handling resize!");
                const targetRadius = this.#getTargetRadius();

                // Set the target radius incase the canvas has been resized.
                if (roundTarget.getRadius() !== targetRadius)
                    roundTarget.setRadius(targetRadius);

                // Reposition the targets incase the canvas has been resized.
                let xPos = roundTarget.getXPos();
                let yPos = roundTarget.getYPos();

                // Calculate the difference between previous height ratio and current.
                let prevHeightRatio = this.#prevHeight / this.#CANVAS_INIT_HEIGHT;
                let prevWidthRatio = this.#prevWidth / this.#CANVAS_INIT_WIDTH;

                let heightRatioDiff = prevHeightRatio - this.#getResizeHeightRatio();
                let widthRatioDiff = prevWidthRatio - this.#getResizeWidthRatio();

                let newXPos = ((1 - widthRatioDiff) * xPos);
                let newYPos = ((1 - heightRatioDiff) * yPos);

                roundTarget.setXPos(newXPos);
                roundTarget.setYPos(newYPos);

                // Reposition any targets that may be offscreen after a canvas resize.
                let coorObj = this.#checkAndReposOffScreenTarget
                        (roundTarget.getXPos(), roundTarget.getYPos(), targetRadius);

                roundTarget.setXPos(coorObj.xPos);
                roundTarget.setYPos(coorObj.yPos);
            }

            // Finally, draw the target.
            roundTarget.draw(this.#context);
        }
    }

    #drawPointsExplosions = () => {
        const myIterator = this.#pointExplosions.values();

        for (const pointExplosion of myIterator) {
            if (pointExplosion.isMarkedForDestruct())
                this.#pointExplosions.delete(pointExplosion);
            else
                pointExplosion.draw(this.#context);
        }
    }

    #drawTargetExplosions = () => {
        const myIterator = this.#targetExplosions.values();

        for (const targetExplosion of myIterator) {
            if(targetExplosion.isMarkedForDestruct())
                this.#targetExplosions.delete(targetExplosion);
            else
                targetExplosion.draw(this.#context);
        }
    }

    #drawBulletTrail = () => {
        if (this.#bulletTrail !== undefined && this.#bulletTrail !== null) {
            // Calculate Bullet Trail scale factor.
            let scaleFactor = this.#bulletTrail.getScaleFactor() - 0.1;

            this.#bulletTrail.setScaleFactor(scaleFactor);

            this.#bulletTrail.draw(this.#context);
        }
    }

    // Calculate the x and y position on the canvas.
    #calcClickPosition = (clientX, clientY) => {
        let rect = this.#canvas.current.getBoundingClientRect();
        let x = clientX - rect.left;
        let y = clientY - rect.top;

        let coorObj = {
            xPos: x,
            yPos: y
        };

        return coorObj;
    }

    #handleClick = (event) => {
        if (this.#gameStarted === false) {
            this.#gameStarted = true;
            this.#beginAnimation();

            return;
        }

        // If on end screen.
        if (this.#gameStarted === true && this.#gameEnded === true) {
            this.#restartGame();

            return;
        }

        this.#sounds.playShot();
        let coorObj = this.#calcClickPosition(event.clientX, event.clientY);

        // Collision detection.
        let targetWasHit = false;       // If click hit a target.

        const myIterator = this.#roundTargets.values();

        for (const roundTarget of myIterator) {
            let resultObj = roundTarget.isPosInTarget(coorObj.xPos, coorObj.yPos);

            // Check if any of the target's outer or inner circles were hit.
            if (resultObj.innerTarget === true) {
                targetWasHit = true;

                this.#playerHitTarget(coorObj.xPos, coorObj.yPos, this.#TARG_INNER_HIT_SCORE,
                        roundTarget);
            }
            else if (resultObj.middleTarget === true) {
                targetWasHit = true;

                this.#playerHitTarget(coorObj.xPos, coorObj.yPos, this.#TARG_MIDDLE_HIT_SCORE,
                        roundTarget);
            }
            else if (resultObj.outerTarget === true) {
                targetWasHit = true;

                this.#playerHitTarget(coorObj.xPos, coorObj.yPos, this.#TARG_HIT_SCORE,
                        roundTarget);
            }
        }

        // Create bullet trail.
        this.#bulletTrail = new BulletTrail(coorObj.xPos, coorObj.yPos);

        if (targetWasHit) {
            this.#gameStats.registerHit();
            this.#sounds.playHit();
        } else {
            this.#score.decreaseScore(this.#TARG_MISS_PENALTY);
            this.#gameStats.registerMiss();
            this.#sounds.playMiss();

            // Create point explosion for lost points.
            const pointExplosion = new PointExplosion(this.#TARG_MISS_PENALTY, coorObj.xPos,
                    coorObj.yPos, this.#DEFAULT_POINT_EXPL_FONT, false);
            this.#pointExplosions.add(pointExplosion);
        }
    }

    // Creates a points explosion at the specific point, increments the score,
    // and destroys the target.
    #playerHitTarget = (x, y, score, target) => {
        // Create target explosion.
        const targetExplosion = new TargetExplosion(x, y);
        this.#targetExplosions.add(targetExplosion);

        // Create point explosion.
        const pointExplosion = new PointExplosion(score, x, y, this.#DEFAULT_POINT_EXPL_FONT, true);
        this.#pointExplosions.add(pointExplosion);

        this.#score.increaseScore(score);
        target.destroyTarget();
    }

    render() {
        return (
            <div className="shootingGalleryGame" ref={this.#canvasContainerDiv} >
                <canvas width={this.#CANVAS_INIT_WIDTH} height={this.#CANVAS_INIT_HEIGHT}
                        id="shootingGalleryCanvas" className="RoundBorder"
                        ref={this.#canvas}
                        onClick={(evt) => {
                            evt.preventDefault();
                            this.#handleClick(evt);
                        }}
                ></canvas>
            </div>
        )
    }
}

export default ShootingGallery;