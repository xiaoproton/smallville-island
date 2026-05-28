const API_BASE = 'http://localhost:3000/api';

export const api = {
    async getAgent(agentId) {
        const response = await fetch(`${API_BASE}/agents/${agentId}`);
        return response.json();
    },

    async decide(agentId, x, y, mapWidth, mapHeight, memory) {
        const response = await fetch(`${API_BASE}/agents/${agentId}/decide`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x, y, mapWidth, mapHeight, memory })
        });
        return response.json();
    },

    async move(agentId, direction) {
        const response = await fetch(`${API_BASE}/agents/${agentId}/move`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction })
        });
        return response.json();
    },

    async performAction(agentId, action) {
        const response = await fetch(`${API_BASE}/agents/${agentId}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });
        return response.json();
    },

    async updateMemory(agentId, content) {
        const response = await fetch(`${API_BASE}/agents/${agentId}/memory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        return response.json();
    },

    async getWorldConfig() {
        const response = await fetch(`${API_BASE}/world/config`);
        return response.json();
    }
};