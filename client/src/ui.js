import { Graphics, Text, Container } from 'pixi.js';
import { api } from './api.js';

function createLogPanel(app) {
    const panelContainer = new Container();
    panelContainer.x = app.screen.width - 340;
    panelContainer.y = 10;

    const bg = new Graphics();
    bg.roundRect(0, 0, 330, app.screen.height - 20, 10);
    bg.fill({ color: 0x000000, alpha: 0.7 });
    panelContainer.addChild(bg);

    const title = new Text({
        text: '🤖 AI Decision Log',
        style: { fontFamily: 'Arial', fontSize: 14, fill: 0xffcc00, fontWeight: 'bold' }
    });
    title.position.set(10, 10);
    panelContainer.addChild(title);

    const logText = new Text({
        text: 'Press START to begin\nthe AI loop',
        style: { fontFamily: 'monospace', fontSize: 11, fill: 0xcccccc, wordWrap: true, wordWrapWidth: 310 }
    });
    logText.position.set(10, 35);
    panelContainer.addChild(logText);

    return { panelContainer, logText };
}

function updateUI(app, agent) {
    const uiContainer = new Container();

    // Info panel (top-left)
    const infoBg = new Graphics();
    infoBg.roundRect(10, 10, 240, 60, 10);
    infoBg.fill({ color: 0x000000, alpha: 0.7 });
    uiContainer.addChild(infoBg);

    const infoText = new Text({
        text: '🏝️ Smallville Island\n📍 (400, 400)',
        style: { fontFamily: 'Arial', fontSize: 14, fill: 0xffffff }
    });
    infoText.position.set(20, 20);
    uiContainer.addChild(infoText);

    // Log panel (right side)
    const { panelContainer, logText } = createLogPanel(app);
    uiContainer.addChild(panelContainer);

    // Log entries
    const logEntries = [];
    function addLog(msg, color = '#cccccc') {
        const ts = new Date().toLocaleTimeString();
        logEntries.push({ msg: `[${ts}] ${msg}`, color });
        if (logEntries.length > 30) logEntries.shift();
        logText.text = logEntries.map(e => e.msg).join('\n');
    }

    function updateInfo(x, y) {
        const gx = Math.round(x / 30);
        const gy = Math.round(y / 30);
        infoText.text = `🗺️ Smallville Island\n📍 (${gx}, ${gy})`;
    }

    // Start/Stop button
    const btnContainer = new Container();
    const btnBg = new Graphics();
    btnBg.roundRect(-60, -22, 120, 44, 10);
    btnBg.fill(0x22c55e);
    btnContainer.addChild(btnBg);

    const btnLabel = new Text({
        text: '▶ START',
        style: { fontFamily: 'Arial', fontSize: 16, fill: 0xffffff, fontWeight: 'bold' }
    });
    btnLabel.anchor.set(0.5);
    btnContainer.addChild(btnLabel);

    btnContainer.x = 130;
    btnContainer.y = 100;
    btnContainer.eventMode = 'static';
    btnContainer.cursor = 'pointer';
    uiContainer.addChild(btnContainer);

    // Speed indicator
    const speedText = new Text({
        text: 'Delay: 1.5s',
        style: { fontFamily: 'monospace', fontSize: 11, fill: 0x888888 }
    });
    speedText.position.set(20, 115);
    uiContainer.addChild(speedText);

    // State
    let running = false;
    let stopRequested = false;
    const stepSize = 30;
    let loopDelay = 1500; // ms between AI calls

    // Build surroundings description from map data
    function buildSurroundings(x, y, world, wide = false) {
        const objects = world.objects || [];
        const radius = wide ? 200 : 100;
        const nearby = objects.filter(o => {
            const ox = o.x * stepSize + 50;
            const oy = o.y * stepSize + 50;
            const dist = Math.sqrt((ox - x) ** 2 + (oy - y) ** 2);
            return dist < radius;
        });
        if (nearby.length === 0) return 'nothing nearby';

        const dirName = (dx, dy) => {
            const ns = dy < 0 ? 'North' : dy > 0 ? 'South' : '';
            const ew = dx < 0 ? 'West' : dx > 0 ? 'East' : '';
            if (!ns && !ew) return '';
            if (!ns) return ew;
            if (!ew) return ns;
            return ns + ew.toLowerCase();
        };

        const desc = nearby.map(o => {
            const dx = Math.round((o.x * stepSize + 50 - x) / stepSize);
            const dy = Math.round((o.y * stepSize + 50 - y) / stepSize);
            const dir = dirName(dx, dy);
            return `a ${o.type} to the ${dir}`;
        }).join('; ');
        return desc;
    }

    // Main AI loop
    async function aiLoop(world) {
        addLog('▶ AI loop started', '#22c55e');
        stopRequested = false;
        let lastAction = '';
        let lookResult = '';

        while (!stopRequested) {
            const x = Math.round(agent.x);
            const y = Math.round(agent.y);
            const gx = Math.round(x / 30);
            const gy = Math.round(y / 30);
            const nearby = buildSurroundings(x, y, world, false);

            // Build prompt surroundings — include what Look discovered
            const promptNearby = lookResult
                ? `in sight: ${lookResult}`
                : nearby;

            addLog(`🤔 Asking AI (grid: ${gx},${gy})...`, '#ffcc00');

            try {
                const res = await api.decide('player', x, y, 20, 20, lastAction, promptNearby);

                if (res.error) {
                    addLog(`❌ API error: ${res.error}`, '#ff6666');
                    break;
                }

                const action = (res.action || 'NONE').trim();
                addLog(`🧠 AI → ${action}`, '#22c55e');

                if (action === '') {
                    addLog(`  ⏸️ No action returned, skipping turn`);
                } else if (['N', 'S', 'W', 'E'].includes(action)) {
                    const dx = action === 'E' ? stepSize : action === 'W' ? -stepSize : 0;
                    const dy = action === 'S' ? stepSize : action === 'N' ? -stepSize : 0;
                    agent.sprite.x += dx;
                    agent.sprite.y += dy;
                    agent.x = agent.sprite.x;
                    agent.y = agent.sprite.y;
                    updateInfo(agent.x, agent.y);
                    addLog(`  ✅ Moved ${action} → grid (${Math.round(agent.x / 30)}, ${Math.round(agent.y / 30)})`);
                    lastAction = action === 'N' ? 'North' : action === 'S' ? 'South' : action === 'W' ? 'West' : 'East';
                    lookResult = ''; // cleared on move
                } else if (action === 'SEARCH' || action === 'LOOK') {
                    const found = buildSurroundings(x, y, world, true);
                    if (found !== 'nothing nearby') {
                        addLog(`  👁️ ${action} — spotted: ${found}`);
                        lookResult = found;
                    } else {
                        addLog(`  👁️ ${action} — nothing in sight`);
                        lookResult = '';
                    }
                    lastAction = action;
                } else {
                    addLog(`  ⚠️ Unknown action: ${action}, skipping`, '#888888');
                }
            } catch (err) {
                addLog(`❌ AI error: ${err.message}`, '#ff6666');
                addLog('⏸️ Auto-pausing...');
                break;
            }

            // Wait before next AI call (check for stop)
            await delay(loopDelay);
        }

        running = false;
        btnLabel.text = '▶ START';
        btnBg.fill(0x22c55e);
        addLog('⏹️ AI loop stopped', '#ff6666');
    }

    btnContainer.on('pointerdown', async () => {
        if (running) {
            stopRequested = true;
            btnLabel.text = '⏳ Stopping...';
            btnBg.fill(0xf59e0b);
            addLog('⏹️ Stop requested...');
            return;
        }

        running = true;
        stopRequested = false;
        btnLabel.text = '⏹ STOP';
        btnBg.fill(0xef4444);

        // Fetch world config for surroundings
        try {
            const world = await api.getWorldConfig();
            aiLoop(world);
        } catch (err) {
            addLog(`❌ Failed to get world data: ${err.message}`, '#ff6666');
            running = false;
            btnLabel.text = '▶ START';
            btnBg.fill(0x22c55e);
        }
    });

    app.stage.addChild(uiContainer);

    return { uiContainer, updateInfo, addLog };
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { updateUI };