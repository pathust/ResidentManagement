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
  getAll: async (paging = null) => {
    if (!paging) paging = {};
    const params = new URLSearchParams(paging);

    const paramsString = params.toString() ? `?${params.toString()}` : '';

    const response = await fetch(`/api/households${paramsString}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch households');
    }

    const data = await response.json();

    return data;
  },

  getMembers: async (householdId, paging = null) => {
    const response = await fetch(`/api/households/${householdId}/members`, {
      method: 'GET',
      credentials: 'include',
    });

    console.log("Fetching members for household ID:", householdId);

    if (!response.ok) {
      throw new Error('Failed to fetch household members');
    }

    const data = await response.json();
    return data;
  }
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

export const feeAPI = {
  getAll: async () => {
    const response = await fetch('/api/fees', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fees');
    }

    return response.json();
  },
};

export const rewardAPI = {
  getAll: async () => {
    const response = await fetch('/api/rewards', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rewards');
    }

    const data = await response.json();

    return data;
  },
};