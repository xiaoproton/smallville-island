const db = require('../db/database');
const TIMEOUT_MS = 120000;

async function callOllama(prompt) {
    const config = await new Promise((resolve, reject) => {
        db.get('SELECT value FROM config WHERE key = ?', ['ollama_url'], (err, row) => {
            if (err) reject(err);
            else resolve(row ? row.value : 'http://127.0.0.1:11434');
        });
    });

    const url = `${config}/api/chat`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    console.log(`[Ollama] Chat POST ${url} model=qwen3-vl:4b-instruct timeout=${TIMEOUT_MS}ms`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen3-vl:4b-instruct',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                stream: false,
                options: { num_predict: 20 }
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`HTTP ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        const raw = data.message?.content || '';
        console.log(`[Ollama] Response: "${raw}"`);

        const action = extractAction(raw);
        console.log(`[Ollama] Action: "${action}"`);
        return action;
    } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') {
            console.error(`[Ollama] TIMEOUT after ${TIMEOUT_MS}ms — no response from ${url}`);
        } else {
            console.error(`[Ollama] Error: ${error.message}`);
        }
        return '';
    }
}

function extractAction(text) {
    const map = { NORTH: 'N', SOUTH: 'S', WEST: 'W', EAST: 'E', SEARCH: 'SEARCH', LOOK: 'LOOK' };
    const upper = text.toUpperCase().trim();
    for (const [word, code] of Object.entries(map)) {
        if (upper.includes(word)) return code;
    }
    return '';
}

module.exports = { callOllama, extractAction };