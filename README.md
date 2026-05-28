# smallville-island

Inspired by Stanford Smallville AI Experiment (https://arxiv.org/pdf/2304.03442)

I am trying to build from scratch with different philosophy for fun, using local Ollama model for low cost.

**Architecture:**
- Backend: Node.js + SQLite
- Frontend: PixiJS (lightweight 2D rendering engine)
- Deployment: Local laptop exposed to external IP

**Tech Stack:**
- Backend: Node.js + Express (planned)
- Database: SQLite for agent state, memory, relationships
- Frontend: PixiJS for tile-based map rendering, character sprites, and interactions
- AI: Local Ollama models for agent decision-making and reflection

**Goal:** Create a lightweight, observable AI agent simulation where agents live in a small town, interact with each other, form memories, and make plans — all running locally and cheaply.

---

## Folder Structure

```
smallville-island/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js          # Entry point, Express app setup
│   │   ├── routes/            # API endpoints
│   │   │   ├── agents.js      # Agent CRUD, state management
│   │   │   ├── world.js       # Map data, locations, objects
│   │   │   └── memory.js      # Memory retrieval and reflection
│   │   ├── db/                # SQLite database
│   │   │   ├── schema.sql     # Database schema
│   │   │   └── migrations/    # Migration scripts
│   │   ├── agents/            # Agent logic
│   │   │   ├── decision-maker.js  # Ollama-based decision loop
│   │   │   ├── memory-stream.js   # Memory storage and retrieval
│   │   │   └── planner.js     # Short-term and long-term planning
│   │   ├── world/             # World data
│   │   │   ├── map.json       # Tilemap data (from Tiled editor)
│   │   │   ├── locations.json # Locations (shops, homes, etc.)
│   │   │   └── objects.json   # Interactive objects
│   │   └── utils/             # Helper functions
│   │       ├── ollama.js      # Ollama API wrapper
│   │       └── logger.js      # Logging utilities
│   ├── package.json
│   └── .env                   # Environment variables
│
├── client/                    # Frontend (PixiJS)
│   ├── src/
│   │   ├── main.js            # PixiJS initialization
│   │   ├── map.js             # Tilemap loading and rendering
│   │   ├── agents.js          # Agent sprite management
│   │   ├── ui.js              # UI overlays, text bubbles
│   │   └── api.js             # API client for backend
│   ├── public/
│   │   ├── tileset.png        # Tile sheet (from Tiled editor)
│   │   ├── agent-sprites.png  # Character spritesheet (4-direction walk cycle)
│   │   ├── map.json           # Tilemap data (from Tiled editor)
│   │   └── index.html         # Entry HTML
│   └── package.json
│
├── shared/                    # Shared types and utilities
│   ├── types.ts               # TypeScript interfaces (agents, memory, world)
│   └── schema.sql             # SQLite schema (shared with server)
│
├── config/                    # Configuration files
│   ├── default.json           # Default settings
│   ├── development.json       # Development-specific settings
│   └── production.json        # Production-specific settings
│
├── scripts/                   # Utility scripts
│   ├── init-db.js             # Database initialization
│   ├── generate-map.js        # Map generation utilities
│   └── migrate-db.js          # Database migration scripts
│
├── docs/                      # Documentation
│   ├── architecture.md        # High-level architecture
│   ├── api.md                 # API documentation
│   └── design.md              # Design decisions and rationale
│
├── README.md                  # This file
└── package.json               # Root package.json (optional, for scripts)
```

**Key Design Principles:**
- **Separation of concerns:** Backend handles AI logic and state; frontend handles visualization and user interaction
- **Shared types:** `/shared/types.ts` defines common interfaces (agents, memory, world) used by both backend and frontend
- **Database schema:** `/shared/schema.sql` contains the SQLite schema; server uses it for migrations
- **Map data:** Tilemap and location data stored as JSON (editable in Tiled editor)
- **Sprites:** Simple sprite sheets for characters and tiles (can be hand-drawn or generated)