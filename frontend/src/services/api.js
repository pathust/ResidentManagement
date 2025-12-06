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

    return response.json();
  },
};

export const feeManagementAPI = {
  // Events
  getEvents: async () => {
    const response = await fetch('/api/fees/events', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  getEventById: async (id) => {
    const response = await fetch(`/api/fees/events/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
  },

  createEvent: async (data) => {
    const response = await fetch('/api/fees/events', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  updateEvent: async (id, data) => {
    const response = await fetch(`/api/fees/events/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  deleteEvent: async (id) => {
    const response = await fetch(`/api/fees/events/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return response.json();
  },

  // Payments
  getPayments: async () => {
    const response = await fetch('/api/fees/payments', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
  },

  getPaymentById: async (id) => {
    const response = await fetch(`/api/fees/payments/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch payment');
    return response.json();
  },

  createPayment: async (data) => {
    const response = await fetch('/api/fees/payments', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
  },

  updatePayment: async (id, data) => {
    const response = await fetch(`/api/fees/payments/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update payment');
    return response.json();
  },

  // Fee Types
  getFeeTypes: async () => {
    const response = await fetch('/api/fees/types', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch fee types');
    return response.json();
  },

  getFeeTypeById: async (id) => {
    const response = await fetch(`/api/fees/types/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch fee type');
    return response.json();
  },

  createFeeType: async (data) => {
    const response = await fetch('/api/fees/types', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create fee type');
    return response.json();
  },

  updateFeeType: async (id, data) => {
    const response = await fetch(`/api/fees/types/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update fee type');
    return response.json();
  },

  deleteFeeType: async (id) => {
    const response = await fetch(`/api/fees/types/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete fee type');
    return response.json();
  },
};

export const fundManagementAPI = {
  // Funds
  getFunds: async () => {
    const response = await fetch('/api/funds', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch funds');
    return response.json();
  },

  getFundById: async (id) => {
    const response = await fetch(`/api/funds/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch fund');
    return response.json();
  },

  createFund: async (data) => {
    const response = await fetch('/api/funds', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create fund');
    return response.json();
  },

  updateFund: async (id, data) => {
    const response = await fetch(`/api/funds/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update fund');
    return response.json();
  },

  deleteFund: async (id) => {
    const response = await fetch(`/api/funds/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete fund');
    return response.json();
  },

  // Expenses
  getExpenses: async () => {
    const response = await fetch('/api/funds/expenses', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  },

  createExpense: async (data) => {
    const response = await fetch('/api/funds/expenses', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return response.json();
  },

  updateExpense: async (id, data) => {
    const response = await fetch(`/api/funds/expenses/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update expense');
    return response.json();
  },

  // Transactions
  getTransactions: async () => {
    const response = await fetch('/api/funds/transactions', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  createTransaction: async (data) => {
    const response = await fetch('/api/funds/transactions', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
  },

  // Transfers
  getTransfers: async () => {
    const response = await fetch('/api/funds/transfers', {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch transfers');
    return response.json();
  },

  createTransfer: async (data) => {
    const response = await fetch('/api/funds/transfers', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create transfer');
    return response.json();
  },
};