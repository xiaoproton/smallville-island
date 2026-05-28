const { callOllama } = require('../utils/ollama');

async function decideNextAction(agentId, x, y, mapWidth, mapHeight, memory, surroundings) {
    const lastAction = memory || '';

    // Build options: if last action was LOOK, don't offer it again
    const options = ['North', 'South', 'West', 'East'];
    if (lastAction !== 'LOOK') options.push('Look');
    const optionsStr = options.join(' / ');

    const prompt = `You are on an unknown island. You cannot remember how you get here. Now you need to survive.

Nearby: ${surroundings || 'nothing'}
${lastAction ? `Your Last Action: ${lastAction}` : ''}

Options: ${optionsStr}

Pick one:`;

    console.log('\n=== OLLAMA REQUEST ===');
    console.log('Prompt:', prompt);

    const action = await callOllama(prompt);

    console.log('=== OLLAMA RAW RESPONSE ===');
    console.log(`"${action}"`);
    console.log('=======================\n');

    return action;
}

module.exports = { decideNextAction };