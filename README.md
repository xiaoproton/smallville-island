# smallville-island

Inspired by Stanford Smallville AI Experiment (https://arxiv.org/pdf/2304.03442)

I am trying to build from scratch with different philosophy for fun, using local Ollama model for low cost.

**Architecture:**
- Backend: Node.js + SQLite
- Frontend: PixiJS (lightweight 2D rendering engine)
- Deployment: Local laptop exposed to external IP

**Tech Stack:**
- Backend: Node.js + Express
- Database: SQLite for agent state, memory, relationships
- Frontend: PixiJS for tile-based map rendering, character sprites, and interactions
- AI: Local Ollama models for agent decision-making and reflection

**Goal:** Create a lightweight, observable AI agent simulation where agents live in a small town, interact with each other, form memories, and make plans — all running locally and cheaply.

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Ollama (running locally at `http://127.0.0.1:11434`)
- `qwen3-vl:4b-instruct` model installed in Ollama (or any compatible model)

### Installation

1. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Initialize database:**
   ```bash
   cd ../scripts
   node init-db.js
   ```

3. **Start the server:**
   ```bash
   cd ../server
   npm start
   ```
   Server runs on `http://localhost:3001`

4. **Start the frontend (in another terminal):**
   ```bash
   cd client
   npm install
   npm run dev          # Local only
   # or
   npm run dev:host     # Expose to network (e.g. http://192.168.4.75:5173)
   ```

5. **Open browser:**
   Navigate to `http://localhost:5173` (local) or `http://<your-ip>:5173` (network)

---

## Folder Structure

```
smallville-island/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js          # Entry point, Express app setup
│   │   ├── routes/            # API endpoints
│   │   │   ├── agents.js      # Agent CRUD, state management
│   │   │   └── world.js       # Map data, locations, objects
│   │   ├── db/                # SQLite database
│   │   │   └── database.js    # Database connection
│   │   ├── agents/            # Agent logic
│   │   │   └── decision-maker.js  # Ollama-based decision loop
│   │   └── utils/             # Helper functions
│   │       └── ollama.js      # Ollama API wrapper
│   └── package.json
│
├── client/                    # Frontend (PixiJS)
│   ├── src/
│   │   ├── main.js            # PixiJS initialization
│   │   ├── map.js             # Tilemap loading and rendering
│   │   ├── agents.js          # Agent sprite management
│   │   ├── ui.js              # UI overlays, text bubbles
│   │   └── api.js             # API client for backend
│   ├── public/
│   │   ├── tileset.png        # Tile sheet (grass, tree, rock, water)
│   │   ├── agent-sprites.png  # Character sprite
│   │   └── index.html         # Entry HTML
│   ├── vite.config.js         # Vite configuration
│   └── package.json
│
├── shared/                    # Shared types and utilities
│   └── schema.sql             # SQLite schema (config, memory tables)
│
├── scripts/                   # Utility scripts
│   └── init-db.js             # Database initialization
│
├── docs/                      # Documentation
│   └── architecture.md        # High-level architecture
│
└── README.md                  # This file
```

**Key Design Principles:**
- **Separation of concerns:** Backend handles AI logic and state; frontend handles visualization and user interaction
- **Hardcoded for now:** Simple survival island, no complex world
- **No pathfinding:** Agents can move freely, collision detection can be added later
- **Simple sprite system:** Basic shapes instead of complex sprites
- **Local Ollama:** Low cost, privacy-friendly
- **SQLite:** Lightweight, no external database needed

---

## Current Implementation

### Backend Features

- ✅ Express server on port 3001
- ✅ SQLite database with `config` and `memory` tables
- ✅ Ollama API wrapper (hardcoded URL: `http://127.0.0.1:11434`)
- ✅ Agent decision logic (N/S/W/E/Search/Look)
- ✅ **Look discovery** — Look scans a wider range (200px vs 100px) and feeds spotted objects into the next prompt
- ✅ **Dynamic options** — Look auto-removed from choices when last action was LOOK (prevents repeat loops)
- ✅ Prompt: "You are on an unknown island..." — narrative-driven survival framing
- ✅ `qwen3-vl:4b-instruct` model via Ollama chat API
- ✅ API endpoints:
  - `GET /api/agents/:agentId` — Get agent state
  - `POST /api/agents/:agentId/decide` — Get AI decision (accepts surroundings + memory)
  - `POST /api/agents/:agentId/move` — Move agent
  - `POST /api/agents/:agentId/action` — Perform action
  - `POST /api/agents/:agentId/memory` — Update memory
  - `GET /api/world/config` — Get world configuration

### Frontend Features

- ✅ PixiJS rendering engine
- ✅ Rich survival island map (trees, rocks, bushes, twigs, berries, shells)
- ✅ Agent sprite (red circle with direction indicator)
- ✅ **Full AI loop** — START/STOP button, auto-requests decisions in a loop
- ✅ **AI Decision Log panel** — real-time panel on the right showing prompts, actions, observations
- ✅ **Look discovery feedback** — when AI looks, wider scan results show in the log
- ✅ **Grid coordinates** — status bar shows `(gx, gy)` grid position instead of pixels
- ✅ API client for backend communication

### World Design

- **Map size:** 800x800 pixels, 20x20 grid
- **Island:** 600x600 pixels in center
- **Sea:** Blue background around island
- **Objects (19 total):**
  - 🌲 **Trees** (5) — Dark green circles
  - 🪨 **Rocks** (3) — Grey polygons
  - 🌿 **Bushes** (4) — Lighter green, smaller circles
  - 🪵 **Twigs** (3) — Brown crossed lines
  - 🫐 **Berries** (2) — Small red dots
  - 🐚 **Shells** (2) — Pale ellipses near coast edges

---

## How It Works

1. **User clicks START** in the frontend
2. **Frontend calls** `POST /api/agents/:agentId/decide` with current position and surroundings
3. **Backend queries Ollama** with position, surroundings, and world prompt
4. **Ollama returns decision** (N, S, W, E, Search, Look)
5. **Backend parses response** and returns action to frontend
6. **Frontend moves agent sprite** and updates position display
7. **Loop repeats:** new position is fed back to Ollama for the next decision
8. **User clicks STOP** to break the loop

---

## Next Steps

- [x] Install dependencies and run server
- [x] Start Ollama with `qwen3-vl:4b-instruct` model
- [x] Implement agent movement and AI decision loop
- [x] Implement Look action with wider scan + discovery feedback
- [x] Add varied world objects (bushes, twigs, berries, shells)
- [x] AI Decision Log panel with real-time status
- [ ] Add collision detection (trees, rocks, bushes)
- [ ] Implement Search action (resource gathering)
- [ ] Add memory persistence across sessions
- [ ] Add agent health/hunger system
- [ ] Expose to external IP for remote viewing

---

## License

MIT