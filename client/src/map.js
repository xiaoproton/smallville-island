import { Texture } from 'pixi.js';

async function loadMap(app) {
    // Load tileset (placeholder for now)
    const tileset = await Texture.from('tileset.png');

    // Create map layers
    const mapContainer = new PIXI.Container();

    // Background (sea)
    const sea = new PIXI.Graphics();
    sea.beginFill(0x1e3a5f);
    sea.drawRect(0, 0, 800, 800);
    sea.endFill();
    mapContainer.addChild(sea);

    // Island (grass)
    const island = new PIXI.Graphics();
    island.beginFill(0x2d5a27);
    island.drawRect(100, 100, 600, 600);
    island.endFill();
    mapContainer.addChild(island);

    // Trees
    const treePositions = [
        { x: 150, y: 150 },
        { x: 650, y: 150 },
        { x: 150, y: 650 },
        { x: 650, y: 650 },
        { x: 400, y: 400 }
    ];

    treePositions.forEach(pos => {
        const tree = new PIXI.Graphics();
        tree.beginFill(0x1a472a);
        tree.drawCircle(pos.x, pos.y, 20);
        tree.endFill();
        mapContainer.addChild(tree);
    });

    // Rocks
    const rockPositions = [
        { x: 200, y: 300 },
        { x: 600, y: 500 },
        { x: 300, y: 600 }
    ];

    rockPositions.forEach(pos => {
        const rock = new PIXI.Graphics();
        rock.beginFill(0x4a4a4a);
        rock.drawPolygon([
            pos.x - 15, pos.y + 10,
            pos.x + 15, pos.y + 10,
            pos.x + 10, pos.y - 10,
            pos.x - 10, pos.y - 10
        ]);
        rock.endFill();
        mapContainer.addChild(rock);
    });

    app.stage.addChild(mapContainer);

    return { mapContainer, treePositions, rockPositions };
}

export { loadMap };