const db = require('../db/database');

async function callOllama(prompt) {
    const config = await new Promise((resolve, reject) => {
        db.get('SELECT value FROM config WHERE key = ?', ['ollama_url'], (err, row) => {
            if (err) reject(err);
            else resolve(row ? row.value : 'http://127.0.0.1:11434');
        });
    });

    const response = await fetch(`${config}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3.2',
            prompt: prompt,
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
}

module.exports = { callOllama };