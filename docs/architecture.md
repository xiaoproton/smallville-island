# Smallville Island — Architecture

## Overview

Smallville Island is a lightweight AI agent simulation inspired by the Stanford Smallville experiment. The goal is to create a simple survival island world where an agent makes decisions about where to move and what actions to perform, using a local Ollama model for decision-making.

## Architecture

### Backend (Node.js + Express + SQLite)

**Purpose:** Handle AI decision-making, agent state, and API endpoints.

**Key Components:**

1. **Server (`server/src/server.js`)**
   - Express server on port 3000
   - Serves static files from `client/public`
   - API routes for agents and world

2. **Database (`server/src/db/`)**
   - SQLite database (`smallville.db`)
   - Two tables:
     - `config`: Stores configuration values (Ollama URL, world prompt, etc.)
     - `memory`: Stores agent memories

3. **Agent Logic (`server/src/agents/`)**
   - `decision-maker.js`: Calls Ollama API to decide next action (N/S/W/E/Search/Look)
   - Uses hardcoded Ollama server URL (`http://127.0.0.1:11434`)
   - Hardcoded world prompt: "unknown island, you are in survival situation"

4. **API Routes (`server/src/routes/`)**
   - `/api/agents/:agentId` — Get agent state
   - `/api/agents/:agentId/decide` — Get AI decision
   - `/api/agents/:agentId/move` — Move agent
   - `/api/agents/:agentId/action` — Perform action
   - `/api/agents/:agentId/memory` — Update memory
   - `/api/world/config` — Get world configuration

### Frontend (PixiJS)

**Purpose:** Render the 2D map, agent sprite, and UI overlays.

**Key Components:**

1. **Main Entry (`client/src/main.js`)**
   - Initializes PixiJS application
   - Loads map and creates agent
   - Sets up game loop

2. **Map Rendering (`client/src/map.js`)**
   - Draws sea background
   - Draws island (grass)
   - Draws trees (green circles)
   - Draws rocks (gray polygons)
   - No pathfinding needed — agents can move freely

3. **Agent Sprite (`client/src/agents.js`)**
   - Simple red circle representing the agent
   - White direction indicator
   - Idle animation (scale pulse)

4. **UI (`client/src/ui.js`)**
   - Info panel showing agent position
   - Action buttons (N, S, W, E)
   - Click to move

5. **API Client (`client/src/api.js`)**
   - Fetches data from backend API
   - Handles agent state, decisions, and actions

## Data Flow

1. **User clicks action button** (e.g., "N")
2. **Frontend sends move request** to `/api/agents/:agentId/move`
3. **Backend updates agent position** (simple coordinate change)
4. **Frontend updates agent sprite position**
5. **Optional:** Agent decides next action using Ollama
6. **Backend calls Ollama API** with current position and memory
7. **Ollama returns decision** (N, S, W, E, Search, Look)
8. **Frontend displays decision** and updates UI

## Current Implementation Status

- ✅ Folder structure created
- ✅ Backend server setup
- ✅ SQLite database schema
- ✅ Ollama API wrapper
- ✅ Agent decision logic
- ✅ API endpoints
- ✅ PixiJS frontend setup
- ✅ Simple map rendering (sea, island, trees, rocks)
- ✅ Agent sprite
- ✅ UI overlays
- ✅ API client

## Next Steps

1. Install dependencies and run server
2. Create tileset.png and agent-sprites.png
3. Implement actual agent movement (not just coordinate updates)
4. Add collision detection (trees, rocks)
5. Implement Search and Look actions
6. Add memory persistence
7. Expose to external IP for remote viewing

## Design Decisions

- **Hardcoded everything for now** — simple survival island, no complex world
- **No pathfinding** — agents can move freely, collision detection can be added later
- **Simple sprite system** — basic shapes instead of complex sprites
- **Local Ollama** — low cost, privacy-friendly
- **SQLite** — lightweight, no external database needed