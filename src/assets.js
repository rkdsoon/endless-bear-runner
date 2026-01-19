export class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = false;
    }

    async load() {
        const assets = [
            { key: 'background', src: 'assets/background.png' },
            { key: 'witch', src: 'assets/witch-runner.png' },
            { key: 'moon', src: 'assets/moon.png' },
            { key: 'star', src: 'assets/star.png' }
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
            ctx.fillStyle = '#8a9ba8';
            ctx.fillRect(x, y, width, height);
        }
    }
}
