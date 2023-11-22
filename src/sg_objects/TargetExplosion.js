class TargetExplosion {
    #MAX_PARTICLE_SIZE = 6;
    #MIN_PARTICLE_SIZE = 2;
    #MIN_PARTICLE_SPEED = 1;
    #MAX_PARTICLE_SPEED = 3;

    //#PARTICLE_FADE_RATE = 0.01;
    #PARTICLE_FADE_RATE = 0.015;

    #particles;

    #markedForDestruct;

    constructor(xPos, yPos, numOfParticles = 10) {
        this.#initParticles(xPos, yPos, numOfParticles);

        this.#markedForDestruct = false;
    }

    #initParticles = (xPos, yPos, numOfParticles) => {
        this.#particles = [];

        for (let i = 0; i < numOfParticles; i++) {
            const partObj = {
                x: xPos,
                y: yPos,
                angle: this.#getRandomAngle(),
                size: this.#getRandomParticleSize(),
                speed: this.#getRandomParticleSpeed(),
                red: this.#getRandomColourElem(),
                green: this.#getRandomColourElem(),
                blue: this.#getRandomColourElem(),
                alpha: 1.0,
                rotation: 0
            };

            this.#particles.push(partObj);
        }
    }

    #getRandomParticleSize = () => {
        let size = Math.random() * (this.#MAX_PARTICLE_SIZE - this.#MIN_PARTICLE_SIZE)
                + this.#MIN_PARTICLE_SIZE;

        return size;
    }

    #getRandomParticleSpeed = () => {
        let speed = Math.random() * (this.#MAX_PARTICLE_SPEED - this.#MIN_PARTICLE_SPEED)
                + this.#MIN_PARTICLE_SPEED;

        return speed;
    }

    #getRandomAngle = () => {
        let angle = Math.random() * 360;

        return angle;
    }

    // Returns an integer between 0 and 255 inclusive;
    #getRandomColourElem = () => {
        let colour = Math.floor(Math.random() * 256);

        return colour;
    }

    #degreesToRadians = (angle) => {
        return angle * (Math.PI / 180);
    }

    isMarkedForDestruct = () => {
        return this.#markedForDestruct;
    }

    draw = (context) => {
        let areAllParticlesInvisible = true;

        // Loop through particle objects and draw them.
        for (let i = 0; i < this.#particles.length; i++) {
            const particle = this.#particles[i];

            // If particle is invisible then do not process.
            if (particle.alpha <= 0 )
                break;

            let fillStyleStr =
                    `rgba(${particle.red},${particle.green},${particle.blue},${particle.alpha})`;
            context.fillStyle = fillStyleStr;

            // Move transformation matrix to center of particle
            context.translate(particle.x, particle.y);
            context.rotate(this.#degreesToRadians(particle.rotation));
            context.translate(-particle.x, -particle.y);

            let x1 = particle.x - (particle.size / 2);
            let y1 = particle.y - (particle.size / 2);
            let width = particle.size;
            let height = particle.size;
            context.fillRect(x1, y1, width, height);

            // Reset the context
            context.resetTransform();

            // After drawing particle, increment it's position.
            const angleRads = this.#degreesToRadians(particle.angle);
            particle.x = particle.x + (particle.speed * Math.cos(angleRads));
            particle.y = particle.y + (particle.speed * Math.sin(angleRads));

            // Decrease alpha value.
            particle.alpha = particle.alpha - this.#PARTICLE_FADE_RATE;

            // Increase rotation
            particle.rotation = particle.rotation + 2;

            areAllParticlesInvisible = false;
        }

        // If all particles are invisible then mark object for destruction.
        if (areAllParticlesInvisible) {
            this.#markedForDestruct = true;
        }
    }
}

export default TargetExplosion;