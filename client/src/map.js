import { Graphics, Container } from 'pixi.js';

async function loadMap(app) {
    const mapContainer = new Container();

    // Background (sea)
    const sea = new Graphics();
    sea.rect(0, 0, app.screen.width, app.screen.height);
    sea.fill(0x1e3a5f);
    mapContainer.addChild(sea);

    // Island (grass)
    const island = new Graphics();
    island.rect(100, 100, app.screen.width - 200, app.screen.height - 200);
    island.fill(0x2d5a27);
    mapContainer.addChild(island);

    const gx = (gridX, gridY) => ({ x: gridX * 30 + 50, y: gridY * 30 + 50 });

    // Trees (dark green circles)
    const trees = [
        [5, 5], [15, 10], [8, 8], [17, 3], [4, 8]
    ];
    trees.forEach(([gridX, gridY]) => {
        const pos = gx(gridX, gridY);
        const tree = new Graphics();
        tree.circle(pos.x, pos.y, 20);
        tree.fill(0x1a472a);
        mapContainer.addChild(tree);
    });

    // Rocks (grey polygons)
    const rocks = [
        [8, 8], [14, 5], [12, 12]
    ];
    rocks.forEach(([gridX, gridY]) => {
        const pos = gx(gridX, gridY);
        const rock = new Graphics();
        rock.poly([
            pos.x - 15, pos.y + 10,
            pos.x + 15, pos.y + 10,
            pos.x + 10, pos.y - 10,
            pos.x - 10, pos.y - 10
        ]);
        rock.fill(0x4a4a4a);
        mapContainer.addChild(rock);
    });

    // Bushes (lighter green, smaller circles)
    const bushes = [
        [6, 14], [3, 12], [16, 16], [10, 3]
    ];
    bushes.forEach(([gridX, gridY]) => {
        const pos = gx(gridX, gridY);
        const bush = new Graphics();
        bush.circle(pos.x, pos.y, 12);
        bush.fill(0x3a7a33);
        mapContainer.addChild(bush);
    });

    // Twigs (brown thin lines)
    const twigs = [
        [7, 17], [13, 7], [18, 8]
    ];
    twigs.forEach(([gridX, gridY]) => {
        const pos = gx(gridX, gridY);
        const twig = new Graphics();
        twig.moveTo(pos.x - 6, pos.y + 2);
        twig.lineTo(pos.x + 6, pos.y - 2);
        twig.stroke({ width: 2, color: 0x8b6914 });
        twig.moveTo(pos.x - 4, pos.y - 4);
        twig.lineTo(pos.x + 4, pos.y + 4);
        twig.stroke({ width: 2, color: 0x8b6914 });
        mapContainer.addChild(twig);
    });

    // Berries (small red dots)
    const berries = [
        [11, 9], [2, 15]
    ];
    berries.forEach(([gridX, gridY]) => {
        const pos = gx(gridX, gridY);
        const berry = new Graphics();
        berry.circle(pos.x - 3, pos.y, 4);
        berry.fill(0xdc2626);
        berry.circle(pos.x + 3, pos.y, 4);
        berry.fill(0xdc2626);
        mapContainer.addChild(berry);
    });

    // Shells (small pale dots near coast)
    const shells = [
        [1, 2], [18, 18]
    ];
    shells.forEach(([gridX, gridY]) => {
        const pos = gx(gridX, gridY);
        const shell = new Graphics();
        shell.ellipse(pos.x, pos.y, 6, 4);
        shell.fill(0xf5e6cc);
        shell.ellipse(pos.x + 4, pos.y - 2, 4, 3);
        shell.fill(0xf5e6cc);
        mapContainer.addChild(shell);
    });

    app.stage.addChild(mapContainer);

    return { mapContainer };
}

export { loadMap };