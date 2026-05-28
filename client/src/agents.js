import { Graphics, Container } from 'pixi.js';

function createAgent(app) {
    const agent = new Container();

    // Agent body
    const body = new Graphics();
    body.circle(0, 0, 15);
    body.fill(0xff6b6b);
    agent.addChild(body);

    // Agent direction indicator (white triangle pointing down)
    const dir = new Graphics();
    dir.poly([-4, -5, 4, -5, 0, 5]);
    dir.fill(0xffffff);
    agent.addChild(dir);

    // Random spawn within the island area (avoid sea edges)
    const margin = 150;
    const spawnX = margin + Math.random() * (app.screen.width - 2 * margin);
    const spawnY = margin + Math.random() * (app.screen.height - 2 * margin);
    agent.x = spawnX;
    agent.y = spawnY;

    app.stage.addChild(agent);

    return {
        sprite: agent,
        x: agent.x,
        y: agent.y,
        direction: 'south',
        update(delta) {
            // Simple idle animation - breathing effect
            const scale = 1 + Math.sin(Date.now() / 500) * 0.05;
            agent.scale.set(scale);
        }
    };
}

export { createAgent };