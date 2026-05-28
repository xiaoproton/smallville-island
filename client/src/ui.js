import { Graphics, Text } from 'pixi.js';

function updateUI(app) {
    const uiContainer = new PIXI.Container();
    uiContainer.zIndex = 100;

    // Info panel
    const infoPanel = new Graphics();
    infoPanel.beginFill(0x000000, 0.7);
    infoPanel.roundRect(10, 10, 200, 100, 10);
    infoPanel.endFill();
    uiContainer.addChild(infoPanel);

    const infoText = new Text({
        text: 'Smallville Island\n\nAgent: Player\nPosition: (400, 400)',
        style: {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xffffff,
            align: 'left'
        }
    });
    infoText.position.set(20, 20);
    uiContainer.addChild(infoText);

    // Action buttons
    const buttons = [
        { label: 'N', x: 400, y: 50 },
        { label: 'S', x: 400, y: 750 },
        { label: 'W', x: 50, y: 400 },
        { label: 'E', x: 750, y: 400 }
    ];

    buttons.forEach(btn => {
        const button = new Graphics();
        button.beginFill(0x4a90e2);
        button.roundRect(btn.x - 25, btn.y - 25, 50, 50, 10);
        button.endFill();

        const buttonLabel = new Text({
            text: btn.label,
            style: {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xffffff,
                align: 'center'
            }
        });
        buttonLabel.anchor.set(0.5);
        buttonLabel.position.set(btn.x, btn.y);
        button.addChild(buttonLabel);

        button.eventMode = 'static';
        button.cursor = 'pointer';
        button.on('pointerdown', () => {
            console.log(`Moving ${btn.label}`);
        });

        uiContainer.addChild(button);
    });

    app.stage.addChild(uiContainer);

    return {
        uiContainer,
        updateInfo: (x, y) => {
            infoText.text = `Smallville Island\n\nAgent: Player\nPosition: (${Math.round(x)}, ${Math.round(y)})`;
        }
    };
}

export { updateUI };