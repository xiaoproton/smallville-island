import { Graphics } from 'pixi.js';

function createAgent(app) {
    const agent = new Graphics();

    // Agent body
    agent.beginFill(0xff6b6b);
    agent.drawCircle(400, 400, 15);
    agent.endFill();

    // Agent direction indicator
    const direction = new Graphics();
    direction.beginFill(0xffffff);
    direction.drawRect(-3, -20, 6, 10);
    direction.endFill();
    agent.addChild(direction);

    app.stage.addChild(agent);

    return {
        sprite: agent,
        x: 400,
        y: 400,
        direction: 'south',
        update(delta) {
            // Simple idle animation
            const scale = 1 + Math.sin(Date.now() / 500) * 0.05;
            agent.scale.set(scale);
        }
    };
}

export { createAgent };