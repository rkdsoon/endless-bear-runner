import { AssetLoader } from './assets.js';
import { Game } from './game.js';

const canvas = document.getElementById('game-canvas');
const zoomInput = document.getElementById('zoom');
const zoomValue = document.getElementById('zoom-value');
const gameWrapper = document.getElementById('game-wrapper');

const assets = new AssetLoader();
let game = null;
let animationId = null;

async function init() {
    await assets.load();
    game = new Game(canvas, assets);

    setupControls();
    setupVisibilityHandler();
    gameLoop();
}

function setupControls() {
    const handleJump = (e) => {
        if (e.type === 'keydown' && e.code !== 'Space') return;
        e.preventDefault();
        game.jump();
    };

    document.addEventListener('keydown', handleJump);
    canvas.addEventListener('click', handleJump);

    zoomInput.addEventListener('input', (e) => {
        const size = parseInt(e.target.value);
        canvas.style.width = `${size}px`;
        canvas.style.height = `${Math.round(size * 200 / 360)}px`;
        zoomValue.textContent = `${size}px`;
    });
}

function setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            game.pause();
        } else {
            game.resume();
        }
    });

    window.addEventListener('blur', () => {
        game.pause();
    });
}

function gameLoop() {
    game.update();
    game.render();
    animationId = requestAnimationFrame(gameLoop);
}

init();
