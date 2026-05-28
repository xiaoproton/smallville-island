const { callOllama } = require('../utils/ollama');

async function decideNextAction(agentId, x, y, mapWidth, mapHeight, memory) {
    const worldPrompt = await new Promise((resolve, reject) => {
        db.get('SELECT value FROM config WHERE key = ?', ['world_prompt'], (err, row) => {
            if (err) reject(err);
            else resolve(row ? row.value : 'unknown island, you are in survival situation');
        });
    });

    const prompt = `You are in a survival situation on an unknown island.
Current position: x=${x}, y=${y}
Map size: ${mapWidth}x${mapHeight}
Memory: ${memory || 'None'}

Available actions:
- Move North (N): Go to y-1
- Move South (S): Go to y+1
- Move West (W): Go to x-1
- Move East (E): Go to x+1
- Search: Look around for resources
- Look: Observe surroundings

Respond with ONLY one action (N, S, W, E, Search, or Look).`;

    const response = await callOllama(prompt);
    return response.trim().toUpperCase();
}

module.exports = { decideNextAction };