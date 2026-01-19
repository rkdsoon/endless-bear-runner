export class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = false;
        this.fallbackColors = {
            bear: '#d4a574',
            obs_cup: '#c9a882',
            obs_pizza: '#e8b86d',
            obs_bin: '#8a9ba8',
            background: '#f5f3f0'
        };
    }

    async load() {
        const assets = [
            { key: 'bear', src: 'assets/bear.gif' },
            { key: 'obs_cup', src: 'assets/Cup.png' },
            { key: 'obs_pizza', src: 'assets/Pizza.png' },
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

        this.images['obs_bin'] = { image: null, loaded: false };
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
