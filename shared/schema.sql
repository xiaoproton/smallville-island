-- Shared SQLite schema for smallville-island

-- Config table
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Memory table
CREATE TABLE IF NOT EXISTS memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES config(key) ON DELETE CASCADE
);

-- Insert default config
INSERT OR IGNORE INTO config (key, value) VALUES
    ('ollama_url', 'http://127.0.0.1:11434'),
    ('world_prompt', 'unknown island, you are in survival situation'),
    ('starting_memory', ''),
    ('map_width', '20'),
    ('map_height', '20');