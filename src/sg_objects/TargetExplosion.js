class TargetExplosion {
  static MAX_PARTICLE_SIZE = 6;
  static MIN_PARTICLE_SIZE = 2;
  static MIN_PARTICLE_SPEED = 1;
  static MAX_PARTICLE_SPEED = 3;
  static PARTICLE_FADE_RATE = 0.0002;
  static PARTICLE_ROTATION_MULTIPLIER = 0.4;
  static PARTICLE_SPEED_MULTIPLIER = 0.15;

  #particles = [];
  #markedForDestruct = false;
  #creationTime;

  constructor(xPos, yPos, creationTime, numOfParticles = 10) {
    this.#creationTime = creationTime;
    this.#initParticles(xPos, yPos, numOfParticles);
  }

  #initParticles(xPos, yPos, numOfParticles) {
    this.#particles = Array.from({ length: numOfParticles }, () => ({
      origX: xPos,
      origY: yPos,
      x: xPos,
      y: yPos,
      angle: this.#getRandomAngle(),
      size: this.#getRandomParticleSize(),
      speed: this.#getRandomParticleSpeed(),
      red: this.#getRandomColourElem(),
      green: this.#getRandomGreenColourElem(),
      blue: this.#getRandomColourElem(),
      alpha: 1.0,
      rotation: 0,
    }));
  }

  #getRandomParticleSize() {
    return Math.random() * (TargetExplosion.MAX_PARTICLE_SIZE - TargetExplosion.MIN_PARTICLE_SIZE) + TargetExplosion.MIN_PARTICLE_SIZE;
  }

  #getRandomParticleSpeed() {
    return Math.random() * (TargetExplosion.MAX_PARTICLE_SPEED - TargetExplosion.MIN_PARTICLE_SPEED) + TargetExplosion.MIN_PARTICLE_SPEED;
  }

  #getRandomAngle() {
    return Math.random() * 360;
  }

  #getRandomColourElem() {
    return Math.floor(Math.random() * 128);
  }

  #getRandomGreenColourElem() {
    return Math.floor(Math.random() * 32) + 224;
  }

  #degreesToRadians(angle) {
    return angle * (Math.PI / 180);
  }

  isMarkedForDestruct() {
    return this.#markedForDestruct;
  }

  draw(context, timestamp) {
    const elapsedTime = timestamp - this.#creationTime;
    let areAllParticlesInvisible = true;

    this.#particles.forEach(particle => {
      if (particle.alpha <= 0) return;

      context.fillStyle = `rgba(${particle.red},${particle.green},${particle.blue},${particle.alpha})`;

      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(this.#degreesToRadians(particle.rotation));
      context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      context.restore();

      const angleRads = this.#degreesToRadians(particle.angle);
      const distanceTravelled = particle.speed * TargetExplosion.PARTICLE_SPEED_MULTIPLIER * elapsedTime;
      particle.x = particle.origX + distanceTravelled * Math.cos(angleRads);
      particle.y = particle.origY + distanceTravelled * Math.sin(angleRads);
      particle.alpha = 1 - TargetExplosion.PARTICLE_FADE_RATE * elapsedTime;
      particle.rotation = TargetExplosion.PARTICLE_ROTATION_MULTIPLIER * elapsedTime;

      areAllParticlesInvisible = false;
    });

    if (areAllParticlesInvisible) {
      this.#markedForDestruct = true;
    }
  }
}

export default TargetExplosion;
