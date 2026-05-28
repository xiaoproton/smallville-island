import { createApp } from 'pixi.js';
import { loadMap } from './map.js';
import { createAgent } from './agents.js';
import { updateUI } from './ui.js';
import { api } from './api.js';

const app = createApp({
    width: 800,
    height: 800,
    backgroundColor: 0x1a1a2e
});

app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

// Load world
const world = await loadMap(app);
const agent = createAgent(app);

// UI
const ui = updateUI(app);

// Game loop
app.ticker.add((delta) => {
    // Update agent animation
    agent.update(delta);
});

// Handle window resize
window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

console.log('Smallville Island started!');