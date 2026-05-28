const express = require('express');
const router = express.Router();

// Get world config
router.get('/config', (req, res) => {
    res.json({
        mapWidth: 20,
        mapHeight: 20,
        tileSize: 32,
        objects: [
            { x: 5, y: 5, type: 'tree' },
            { x: 15, y: 10, type: 'tree' },
            { x: 10, y: 15, type: 'rock' },
            { x: 8, y: 8, type: 'rock' }
        ]
    });
});

module.exports = router;