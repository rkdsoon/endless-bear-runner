export class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = false;
        this.animationFrame = 0;
    }

    async load() {
        const assets = [
            { key: 'background', src: 'assets/background.png' }
        ];

        const promises = assets.map(asset => {
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => {
                    this.images[asset.key] = { image: img, loaded: true };
                    resolve();
                };
                img.onerror = () => {
                    this.images[asset.key] = { image: null, loaded: false };
                    resolve();
                };
                img.src = asset.src;
            });
        });

        await Promise.all(promises);
        this.loaded = true;
    }

    drawBear(ctx, x, y, width, height, isJumping) {
        const frame = Math.floor(this.animationFrame / 8) % 2;

        ctx.save();
        ctx.translate(x + width/2, y + height/2);

        const scale = width / 64;
        ctx.scale(scale, scale);

        ctx.fillStyle = '#d4a574';
        ctx.beginPath();
        ctx.ellipse(0, -8, 12, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b8855a';
        ctx.beginPath();
        ctx.ellipse(-8, -16, 4, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(8, -16, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c2416';
        ctx.beginPath();
        ctx.arc(-4, -8, 2, 0, Math.PI * 2);
        ctx.arc(4, -8, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3d3020';
        ctx.beginPath();
        ctx.arc(0, -4, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#d4a574';
        ctx.beginPath();
        ctx.ellipse(0, 8, 14, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        if (isJumping) {
            ctx.fillStyle = '#c99660';
            ctx.beginPath();
            ctx.ellipse(-18, 4, 4, 8, -0.3, 0, Math.PI * 2);
            ctx.ellipse(18, 4, 4, 8, 0.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#c99660';
            ctx.beginPath();
            ctx.ellipse(-6, 22, 4, 8, 0, 0, Math.PI * 2);
            ctx.ellipse(6, 22, 4, 8, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            const legOffset = frame === 0 ? 2 : -2;

            ctx.fillStyle = '#c99660';
            ctx.beginPath();
            ctx.ellipse(-14, 8, 4, 10, 0, 0, Math.PI * 2);
            ctx.ellipse(14, 8, 4, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#c99660';
            ctx.beginPath();
            ctx.ellipse(-6, 22 + legOffset, 4, 6, 0, 0, Math.PI * 2);
            ctx.ellipse(6, 22 - legOffset, 4, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
        this.animationFrame++;
    }

    drawCup(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x + width/2, y + height/2);
        const scale = Math.min(width / 34, height / 48);
        ctx.scale(scale, scale);

        ctx.fillStyle = '#8a7a6a';
        ctx.fillRect(-15, -22, 30, 3);

        ctx.fillStyle = '#e8d5c0';
        ctx.fillRect(-13, -19, 26, 36);

        ctx.fillStyle = '#c9a882';
        ctx.fillRect(-13, -5, 26, 12);

        ctx.fillStyle = '#f5f0e8';
        ctx.fillRect(-11, -17, 3, 30);

        ctx.restore();
    }

    drawPizza(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x + width/2, y + height/2);
        const scale = Math.min(width / 58, height / 30);
        ctx.scale(scale, scale);

        ctx.fillStyle = '#c9955a';
        ctx.beginPath();
        ctx.moveTo(-26, -12);
        ctx.lineTo(26, -12);
        ctx.lineTo(22, 12);
        ctx.lineTo(-22, 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e8c86d';
        ctx.beginPath();
        ctx.moveTo(-22, -8);
        ctx.lineTo(22, -8);
        ctx.lineTo(18, 8);
        ctx.lineTo(-18, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#c85050';
        ctx.beginPath();
        ctx.arc(-12, -2, 4, 0, Math.PI * 2);
        ctx.arc(4, 0, 4, 0, Math.PI * 2);
        ctx.arc(14, -4, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c2c2c';
        ctx.beginPath();
        ctx.arc(-4, 2, 3, 0, Math.PI * 2);
        ctx.arc(10, 4, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawBin(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x + width/2, y + height/2);
        const scale = Math.min(width / 46, height / 56);
        ctx.scale(scale, scale);

        ctx.fillStyle = '#7a8b98';
        ctx.fillRect(-19, -26, 38, 5);
        ctx.fillRect(-15, -28, 30, 3);

        ctx.fillStyle = '#8a9ba8';
        ctx.fillRect(-17, -21, 34, 42);

        ctx.fillStyle = '#6a7b88';
        ctx.fillRect(-14, -18, 28, 36);

        ctx.fillStyle = '#9aadb8';
        ctx.fillRect(-14, -18, 4, 36);

        ctx.restore();
    }

    draw(ctx, key, x, y, width, height, isJumping = false) {
        if (key === 'bear') {
            this.drawBear(ctx, x, y, width, height, isJumping);
        } else if (key === 'obs_cup') {
            this.drawCup(ctx, x, y, width, height);
        } else if (key === 'obs_pizza') {
            this.drawPizza(ctx, x, y, width, height);
        } else if (key === 'obs_bin') {
            this.drawBin(ctx, x, y, width, height);
        }
    }
}
