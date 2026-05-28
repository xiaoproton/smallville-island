const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/public')));

// Database
const db = new sqlite3.Database('./smallville.db');

// Initialize database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES config(key) ON DELETE CASCADE
    )`);

    // Insert default config
    db.run(`INSERT OR IGNORE INTO config (key, value) VALUES
        ('ollama_url', 'http://127.0.0.1:11434'),
        ('world_prompt', 'unknown island, you are in survival situation'),
        ('starting_memory', ''),
        ('map_width', '20'),
        ('map_height', '20')`);
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/agents', require('./routes/agents'));
app.use('/api/world', require('./routes/world'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});