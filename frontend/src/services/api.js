//client service calls for API interactions
//client call frontend

export const authAPI = {
  login: async (username, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  logout: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  },
};

export const householdAPI = {
  getAll: async (token) => {
    const response = await fetch('/api/households', {
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
  getAll: async () => {
    const response = await fetch('/api/persons', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch persons');
    }

    const data = await response.json();

    return data;
  },
  updateOne: async (values) => {
    const response = await fetch(`/api/persons/${values?.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update person');
    }
  
    const data = await response.json();
    return data;
  },

  addOne: async (values) => {
    const response = await fetch(`/api/persons`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add new person');
    }

    return response.json();
  },

  deleteOne: async (id) => {
    const response = await fetch(`/api/persons/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete person');
    }

    return response.status === 204;
  },
};

export const locationAPI = {
  getAllProvinces: async () => {
    const response = await fetch('/api/location/provinces', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch provinces');
    return response.json();
  },
  
  getWardsByProvince: async (provinceId) => {
    const response = await fetch(`/api/location/wards?provinceId=${provinceId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch wards');
    return response.json();
  },

  getAllEthnicities: async () => {
    const response = await fetch('/api/location/ethnicities', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch ethnicities');
    return response.json();
  },

  getWardById: async (wardId) => {
    const response = await fetch(`/api/location/wards/${wardId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch ward');
    return response.json();
  }
};