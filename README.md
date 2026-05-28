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
- `llama3.2` model installed in Ollama

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

4. **Start the frontend (in another terminal):**
   ```bash
   cd client
   npm install
   npm run dev
   ```

5. **Open browser:**
   Navigate to `http://localhost:5173`

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

- ✅ Express server on port 3000
- ✅ SQLite database with `config` and `memory` tables
- ✅ Ollama API wrapper (hardcoded URL: `http://127.0.0.1:11434`)
- ✅ Agent decision logic (N/S/W/E/Search/Look)
- ✅ API endpoints:
  - `GET /api/agents/:agentId` — Get agent state
  - `POST /api/agents/:agentId/decide` — Get AI decision
  - `POST /api/agents/:agentId/move` — Move agent
  - `POST /api/agents/:agentId/action` — Perform action
  - `POST /api/agents/:agentId/memory` — Update memory
  - `GET /api/world/config` — Get world configuration

### Frontend Features

- ✅ PixiJS rendering engine
- ✅ Simple survival island map (sea, island, trees, rocks)
- ✅ Agent sprite (red circle with direction indicator)
- ✅ UI overlays (info panel, action buttons)
- ✅ API client for backend communication

### World Design

- **Map size:** 800x800 pixels
- **Island:** 600x600 pixels in center
- **Trees:** 5 green circles
- **Rocks:** 3 gray polygons
- **Sea:** Blue background around island

---

## How It Works

1. **User clicks action button** (e.g., "N")
2. **Frontend sends move request** to `/api/agents/:agentId/move`
3. **Backend updates agent position** (simple coordinate change)
4. **Frontend updates agent sprite position**
5. **Optional:** Agent decides next action using Ollama
6. **Backend calls Ollama API** with current position and memory
7. **Ollama returns decision** (N, S, W, E, Search, Look)
8. **Frontend displays decision** and updates UI

---

## Next Steps

- [ ] Install dependencies and run server
- [ ] Start Ollama with `llama3.2` model
- [ ] Implement actual agent movement (not just coordinate updates)
- [ ] Add collision detection (trees, rocks)
- [ ] Implement Search and Look actions
- [ ] Add memory persistence
- [ ] Expose to external IP for remote viewing

---

## License

MIT