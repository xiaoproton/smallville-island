// Using relative URL — Vite proxy forwards /api/* to backend
const API_BASE = '/api';
const FETCH_TIMEOUT = 130000; // 130s (slightly longer than backend 120s)

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeout);
        return response;
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
}

export const api = {
    async getAgent(agentId) {
        const response = await fetchWithTimeout(`${API_BASE}/agents/${agentId}`);
        return response.json();
    },

    async decide(agentId, x, y, mapWidth, mapHeight, memory, surroundings) {
        const response = await fetchWithTimeout(`${API_BASE}/agents/${agentId}/decide`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x, y, mapWidth, mapHeight, memory, surroundings })
        });
        return response.json();
    },

    async move(agentId, direction) {
        const response = await fetchWithTimeout(`${API_BASE}/agents/${agentId}/move`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction })
        });
        return response.json();
    },

    async performAction(agentId, action) {
        const response = await fetchWithTimeout(`${API_BASE}/agents/${agentId}/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });
        return response.json();
    },

    async updateMemory(agentId, content) {
        const response = await fetchWithTimeout(`${API_BASE}/agents/${agentId}/memory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        return response.json();
    },

    async getWorldConfig() {
        const response = await fetchWithTimeout(`${API_BASE}/world/config`);
        return response.json();
    }
};