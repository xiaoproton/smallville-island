const express = require('express');
const router = express.Router();

// Get world config
router.get('/config', (req, res) => {
    const objects = [];
    const tileSize = 32;
    const objs = [
        // Trees (5)
        { x: 5, y: 5, type: 'tree' },
        { x: 15, y: 10, type: 'tree' },
        { x: 8, y: 8, type: 'tree' },
        { x: 17, y: 3, type: 'tree' },
        { x: 4, y: 8, type: 'tree' },
        // Rocks (3)
        { x: 8, y: 8, type: 'rock' },
        { x: 14, y: 5, type: 'rock' },
        { x: 12, y: 12, type: 'rock' },
        // Bushes (4)
        { x: 6, y: 14, type: 'bush' },
        { x: 3, y: 12, type: 'bush' },
        { x: 16, y: 16, type: 'bush' },
        { x: 10, y: 3, type: 'bush' },
        // Twigs (3)
        { x: 7, y: 17, type: 'twigs' },
        { x: 13, y: 7, type: 'twigs' },
        { x: 18, y: 8, type: 'twigs' },
        // Berries (2)
        { x: 11, y: 9, type: 'berries' },
        { x: 2, y: 15, type: 'berries' },
        // Shells (2, near coast edges)
        { x: 1, y: 2, type: 'shells' },
        { x: 18, y: 18, type: 'shells' },
    ];
    objs.forEach(p => objects.push({ x: p.x, y: p.y, type: p.type }));
    res.json({ mapWidth: 20, mapHeight: 20, tileSize, objects });
});

module.exports = router;