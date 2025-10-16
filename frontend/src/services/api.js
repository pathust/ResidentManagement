const API_BASE_URL = 'http://localhost:8080';

export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  },
};

export const householdAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/households`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch households');
    }

    return response.json();
  },
};

export const personAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/persons`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch persons');
    }

    return response.json();
  },
};