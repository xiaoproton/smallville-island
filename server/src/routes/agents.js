const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { decideNextAction } = require('../agents/decision-maker');

// Get agent state
router.get('/:agentId', (req, res) => {
    const { agentId } = req.params;

    db.get('SELECT value FROM config WHERE key = ?', [agentId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (!row) {
            res.status(404).json({ error: 'Agent not found' });
            return;
        }

        res.json({
            agentId,
            x: 10, // Default starting position
            y: 10,
            memory: row.value || ''
        });
    });
});

// Get agent decision
router.post('/:agentId/decide', async (req, res) => {
    const { agentId } = req.params;
    const { x, y, mapWidth, mapHeight, memory } = req.body;

    try {
        const action = await decideNextAction(agentId, x, y, mapWidth, mapHeight, memory);
        res.json({ action });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Move agent
router.post('/:agentId/move', (req, res) => {
    const { agentId } = req.params;
    const { direction } = req.body; // N, S, W, E

    // Simple movement logic (no collision detection yet)
    let newX = 10, newY = 10;
    if (direction === 'N') newY--;
    if (direction === 'S') newY++;
    if (direction === 'W') newX--;
    if (direction === 'E') newX++;

    res.json({
        agentId,
        x: newX,
        y: newY
    });
});

// Perform action
router.post('/:agentId/action', (req, res) => {
    const { agentId } = req.params;
    const { action } = req.body; // Search, Look

    res.json({
        agentId,
        action,
        result: `${action} performed.`
    });
});

// Update memory
router.post('/:agentId/memory', (req, res) => {
    const { agentId } = req.params;
    const { content } = req.body;

    db.run('INSERT INTO memory (agent_id, content) VALUES (?, ?)', [agentId, content], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Update config with new memory
        db.run('UPDATE config SET value = ? WHERE key = ?', [content, agentId], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            res.json({ agentId, memory: content });
        });
    });
});

module.exports = router;