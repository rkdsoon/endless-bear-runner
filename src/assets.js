export class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = false;
        this.fallbackColors = {
            bear_run: '#d4a574',
            bear_jump: '#d4a574',
            obs_cup: '#c9a882',
            obs_pizza: '#e8b86d',
            obs_bin: '#8a9ba8'
        };
    }

    async load() {
        const assets = [
            { key: 'bear_run', src: 'assets/bear_run.png' },
            { key: 'bear_jump', src: 'assets/bear_jump.png' },
            { key: 'obs_cup', src: 'assets/obs_cup.png' },
            { key: 'obs_pizza', src: 'assets/obs_pizza.png' },
            { key: 'obs_bin', src: 'assets/obs_bin.png' }
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

    draw(ctx, key, x, y, width, height) {
        const asset = this.images[key];
        if (asset && asset.loaded && asset.image) {
            ctx.drawImage(asset.image, x, y, width, height);
        } else {
            ctx.fillStyle = this.fallbackColors[key] || '#c0b5a8';
            ctx.fillRect(x, y, width, height);
        }
    }
}
