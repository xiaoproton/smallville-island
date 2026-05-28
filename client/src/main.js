import { Application } from 'pixi.js';
import { loadMap } from './map.js';
import { createAgent } from './agents.js';
import { updateUI } from './ui.js';
import { api } from './api.js';

async function init() {
    const app = new Application();

    await app.init({
        resizeTo: window,
        backgroundColor: 0x1a1a2e
    });

    document.body.appendChild(app.canvas);

    // Load world map
    const world = await loadMap(app);

    // Create agent sprite
    const agent = createAgent(app);

    // Build UI with agent reference
    const ui = updateUI(app, agent);
    ui.updateInfo(agent.x, agent.y);
    ui.addLog('🌴 Smallville Island started!');
    ui.addLog(`📍 Agent at (${Math.round(agent.x)}, ${Math.round(agent.y)})`);
    ui.addLog('▶ Press START to begin AI loop');

    // Game loop
    app.ticker.add((delta) => {
        agent.update(delta);
    });

    console.log('Smallville Island started!');
}

init().catch(console.error);