export class Game {
    constructor(canvas, assets) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.assets = assets;

        this.width = 360;
        this.height = 200;
        this.groundY = 160;

        this.state = 'WAITING';
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('witchRunnerHighScore') || '0');
        this.frameCount = 0;
        this.startTime = 0;

        this.witch = {
            x: 60,
            y: this.groundY - 64,
            width: 64,
            height: 64,
            hitbox: { x: 10, y: 10, w: 44, h: 44 },
            velocityY: 0,
            gravity: 0.6,
            jumpPower: -11,
            isJumping: false,
            groundY: this.groundY - 64
        };

        this.obstacles = [];
        this.obstacleTypes = [
            { key: 'moon', width: 50, height: 50, hitbox: { x: 5, y: 5, w: 40, h: 40 } },
            { key: 'star', width: 45, height: 45, hitbox: { x: 5, y: 5, w: 35, h: 35 } }
        ];

        this.gameSpeed = 4;
        this.spawnTimer = 0;
        this.spawnInterval = 90;
        this.lastFrameTime = performance.now();
    }

    start() {
        this.state = 'PLAYING';
        this.score = 0;
        this.frameCount = 0;
        this.startTime = performance.now();
        this.obstacles = [];
        this.witch.y = this.witch.groundY;
        this.witch.velocityY = 0;
        this.witch.isJumping = false;
        this.gameSpeed = 4;
        this.spawnTimer = 0;
    }

    pause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
        }
    }

    resume() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.lastFrameTime = performance.now();
        }
    }

    jump() {
        if (this.state === 'WAITING' || this.state === 'GAMEOVER') {
            this.start();
            return;
        }

        if (this.state === 'PLAYING' && !this.witch.isJumping) {
            this.witch.velocityY = this.witch.jumpPower;
            this.witch.isJumping = true;
        }
    }

    update() {
        if (this.state !== 'PLAYING') return;

        this.frameCount++;
        this.score = Math.floor((performance.now() - this.startTime) / 100);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('witchRunnerHighScore', this.highScore.toString());
        }

        this.gameSpeed = 4 + Math.floor(this.score / 100) * 0.5;

        this.witch.velocityY += this.witch.gravity;
        this.witch.y += this.witch.velocityY;

        if (this.witch.y >= this.witch.groundY) {
            this.witch.y = this.witch.groundY;
            this.witch.velocityY = 0;
            this.witch.isJumping = false;
        }

        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnObstacle();
            this.spawnTimer = 0;
            this.spawnInterval = 60 + Math.random() * 40;
        }

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= this.gameSpeed;

            if (obs.x + obs.width < 0) {
                this.obstacles.splice(i, 1);
            }
        }

        this.checkCollisions();
    }

    spawnObstacle() {
        const type = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];
        this.obstacles.push({
            x: this.width,
            y: this.groundY - type.height,
            width: type.width,
            height: type.height,
            key: type.key,
            hitbox: type.hitbox
        });
    }

    checkCollisions() {
        const witchHitbox = {
            x: this.witch.x + this.witch.hitbox.x,
            y: this.witch.y + this.witch.hitbox.y,
            w: this.witch.hitbox.w,
            h: this.witch.hitbox.h
        };

        for (const obs of this.obstacles) {
            const obsHitbox = {
                x: obs.x + obs.hitbox.x,
                y: obs.y + obs.hitbox.y,
                w: obs.hitbox.w,
                h: obs.hitbox.h
            };

            if (witchHitbox.x < obsHitbox.x + obsHitbox.w &&
                witchHitbox.x + witchHitbox.w > obsHitbox.x &&
                witchHitbox.y < obsHitbox.y + obsHitbox.h &&
                witchHitbox.y + witchHitbox.h > obsHitbox.y) {
                this.gameOver();
            }
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';
    }

    render() {
        const bgAsset = this.assets.images['background'];
        if (bgAsset && bgAsset.loaded && bgAsset.image) {
            this.ctx.drawImage(bgAsset.image, 0, 0, this.width, this.height);
        } else {
            this.ctx.fillStyle = '#f5f3f0';
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.fillStyle = '#e8e5df';
            this.ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

            this.ctx.strokeStyle = '#d4cfc5';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.groundY);
            this.ctx.lineTo(this.width, this.groundY);
            this.ctx.stroke();
        }

        this.assets.draw(this.ctx, 'witch', this.witch.x, this.witch.y, this.witch.width, this.witch.height);

        for (const obs of this.obstacles) {
            this.assets.draw(this.ctx, obs.key, obs.x, obs.y, obs.width, obs.height);
        }

        this.ctx.fillStyle = '#8a837a';
        this.ctx.font = '11px monospace';
        this.ctx.textAlign = 'left';

        if (this.state === 'WAITING') {
            this.ctx.fillText('READY', 10, 20);
        } else if (this.state === 'PAUSED') {
            this.ctx.fillText('PAUSED', 10, 20);
        } else if (this.state === 'GAMEOVER') {
            this.ctx.fillText('GAME OVER', 10, 20);
        } else {
            this.ctx.fillText('PLAYING', 10, 20);
        }

        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Score: ${this.score}`, this.width - 10, 20);
        this.ctx.fillText(`High: ${this.highScore}`, this.width - 10, 35);
    }
}
