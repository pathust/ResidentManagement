//client service calls for API interactions
//client call frontend

export const authAPI = {
  login: async (username, password) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  logout: async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return response.json();
  },
};

export const personAPI = {
  getAll: async () => {
    const response = await fetch("/api/persons", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch persons");
    }

    const data = await response.json();

    return data;
  },
  updateOne: async (values) => {
    const response = await fetch(`/api/persons/${values?.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update person");
    }

    const data = await response.json();
    return data;
  },

  addOne: async (values) => {
    const response = await fetch(`/api/persons`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add new person");
    }

    return response.json();
  },

  deleteOne: async (id) => {
    const response = await fetch(`/api/persons/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete person");
    }

    return response.status === 204;
  },
};

export const locationAPI = {
  getAllProvinces: async () => {
    const response = await fetch("/api/location/provinces", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch provinces");
    return response.json();
  },

  getWardsByProvince: async (provinceId) => {
    const response = await fetch(
      `/api/location/wards?provinceId=${provinceId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch wards");
    return response.json();
  },

  getAllEthnicities: async () => {
    const response = await fetch("/api/location/ethnicities", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch ethnicities");
    return response.json();
  },

  getWardById: async (wardId) => {
    const response = await fetch(`/api/location/wards/${wardId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch ward");
    return response.json();
  },
};

export const feeManagementAPI = {
  // Events
  getEvents: async () => {
    const response = await fetch("/api/fees/events", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  },

  getEventById: async (id) => {
    const response = await fetch(`/api/fees/events/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch event");
    return response.json();
  },

  createEvent: async (data) => {
    const response = await fetch("/api/fees/events", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create event");
    return response.json();
  },

  updateEvent: async (id, data) => {
    const response = await fetch(`/api/fees/events/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update event");
    return response.json();
  },

  deleteEvent: async (id) => {
    const response = await fetch(`/api/fees/events/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete event");
    return response.json();
  },

  // Payments
  getPayments: async () => {
    const response = await fetch("/api/fees/payments", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch payments");
    return response.json();
  },

  getPaymentById: async (id) => {
    const response = await fetch(`/api/fees/payments/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch payment");
    return response.json();
  },

  createPayment: async (data) => {
    const response = await fetch("/api/fees/payments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create payment");
    return response.json();
  },

  updatePayment: async (id, data) => {
    const response = await fetch(`/api/fees/payments/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update payment");
    return response.json();
  },

  // Fee Types
  getFeeTypes: async () => {
    const response = await fetch("/api/fees/types", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch fee types");
    return response.json();
  },

  getFeeTypeById: async (id) => {
    const response = await fetch(`/api/fees/types/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch fee type");
    return response.json();
  },

  createFeeType: async (data) => {
    const response = await fetch("/api/fees/types", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create fee type");
    return response.json();
  },

  updateFeeType: async (id, data) => {
    const response = await fetch(`/api/fees/types/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update fee type");
    return response.json();
  },

  deleteFeeType: async (id) => {
    const response = await fetch(`/api/fees/types/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete fee type");
    return response.json();
  },
};

export const fundManagementAPI = {
  // Funds
  getFunds: async () => {
    const response = await fetch("/api/funds", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch funds");
    return response.json();
  },

  getFundById: async (id) => {
    const response = await fetch(`/api/funds/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch fund");
    return response.json();
  },

  createFund: async (data) => {
    const response = await fetch("/api/funds", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create fund");
    return response.json();
  },

  updateFund: async (id, data) => {
    const response = await fetch(`/api/funds/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update fund");
    return response.json();
  },

  deleteFund: async (id) => {
    const response = await fetch(`/api/funds/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete fund");
    return response.json();
  },

  // Expenses
  getExpenses: async () => {
    const response = await fetch("/api/funds/expenses", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch expenses");
    return response.json();
  },

  createExpense: async (data) => {
    const response = await fetch("/api/funds/expenses", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create expense");
    return response.json();
  },

  updateExpense: async (id, data) => {
    const response = await fetch(`/api/funds/expenses/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update expense");
    return response.json();
  },

  getExpenseById: async (id) => {
    const response = await fetch(`/api/funds/expenses/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch expense");
    return response.json();
  },

  deleteExpense: async (id) => {
    const response = await fetch(`/api/funds/expenses/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete expense");
    return response.json();
  },

  // Transactions
  getTransactions: async () => {
    const response = await fetch("/api/funds/transactions", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return response.json();
  },

  createTransaction: async (data) => {
    const response = await fetch("/api/funds/transactions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create transaction");
    return response.json();
  },

  getTransactionById: async (id) => {
    const response = await fetch(`/api/funds/transactions/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch transaction");
    return response.json();
  },

  updateTransaction: async (id, data) => {
    const response = await fetch(`/api/funds/transactions/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update transaction");
    return response.json();
  },

  deleteTransaction: async (id) => {
    const response = await fetch(`/api/funds/transactions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete transaction");
    return response.json();
  },

  // Transfers
  getTransfers: async () => {
    const response = await fetch("/api/funds/transfers", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch transfers");
    return response.json();
  },

  createTransfer: async (data) => {
    const response = await fetch("/api/funds/transfers", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create transfer");
    return response.json();
  },

  getTransferById: async (id) => {
    const response = await fetch(`/api/funds/transfers/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch transfer");
    return response.json();
  },

  updateTransfer: async (id, data) => {
    const response = await fetch(`/api/funds/transfers/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update transfer");
    return response.json();
  },

  deleteTransfer: async (id) => {
    const response = await fetch(`/api/funds/transfers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete transfer");
    return response.json();
  },
};

// Thêm vào cuối file api.js

export const temporaryResidenceAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const paramsString = params.toString() ? `?${params.toString()}` : "";

    const response = await fetch(
      `/api/persons/temporary-residences${paramsString}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch temporary residences");
    }

    const data = await response.json();

    return data;
  },

  getById: async (id) => {
    const response = await fetch(`/api/persons/temporary-residences/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch temporary residence");
    }

    return response.json();
  },

  create: async (data) => {
    const response = await fetch("/api/persons/temporary-residences", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to create temporary residence"
      );
    }

    return response.json();
  },

  end: async (id, data) => {
    const response = await fetch(`/api/persons/temporary-residences/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to end temporary residence");
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`/api/persons/temporary-residences/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete temporary residence");
    }

    return response.status === 200;
  },
};

export const temporaryAbsenceAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const paramsString = params.toString() ? `?${params.toString()}` : "";

    const response = await fetch(
      `/api/persons/temporary-absences${paramsString}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch temporary absences");
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`/api/persons/temporary-absences/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch temporary absence");
    }

    return response.json();
  },

  create: async (data) => {
    const response = await fetch("/api/persons/temporary-absences", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create temporary absence");
    }

    return response.json();
  },

  end: async (id, data) => {
    const response = await fetch(`/api/persons/temporary-absences/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to end temporary absence");
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`/api/persons/temporary-absences/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete temporary absence");
    }

    return response.status === 200;
  },
};

export const deathDeclareAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const paramsString = params.toString() ? `?${params.toString()}` : "";

    const response = await fetch(`/api/persons/death-declares${paramsString}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch death declares");
    }

    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`/api/persons/death-declares/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch death declare");
    }

    return response.json();
  },

  create: async (data) => {
    const response = await fetch("/api/persons/death-declares", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create death declare");
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`/api/persons/death-declares/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete death declare");
    }

    return response.status === 200;
  },
};

export const userManagementAPI = {
  // Funds
  getUsers: async (filters = {}) => {
    // 1. Tạo query string từ filters đầu vào
    const params = new URLSearchParams(filters).toString();

    // 2. Gắn params vào URL
    // Lưu ý: api/users cần khớp với tên folder trong app/api/
    const response = await fetch(`/api/users?${params}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  getUserById: async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch fund");
    return response.json();
  },

  createUser: async (data) => {
    const response = await fetch("/api/users", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create fund");
    return response.json();
  },

  updateUser: async (id, data) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update fund");
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete fund");
    return response.json();
  },
};

export const statsAPI = {
  getPersonOverview: async () => {
    const response = await fetch("/api/stats/overview/persons", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch person overview stats");
    return response.json();
  },

  getHouseholdOverview: async () => {
    const response = await fetch("/api/stats/overview/households", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch household overview stats");
    return response.json();
  },

  getWardPersonStats: async (wardId) => {
    const response = await fetch(`/api/stats/wards/${wardId}/persons`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch ward person stats");
    return response.json();
  },

  getWardHouseholdStats: async (wardId) => {
    const response = await fetch(`/api/stats/wards/${wardId}/households`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch ward household stats");
    return response.json();
  },
};


// ==================== HISTORY APIs ====================
export const historyAPI = {
  // Household Membership History
  getHouseholdMemberships: async (householdId, params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/households/${householdId}/memberships/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch household memberships");
    return response.json();
  },

  getPersonMemberships: async (personId, params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/persons/${personId}/memberships/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch person memberships");
    return response.json();
  },

  // Head Changes
  getHeadChanges: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/households/head-changes/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch head changes");
    return response.json();
  },

  getHeadChangeById: async (id) => {
    const response = await fetch(`/api/households/head-changes/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch head change");
    return response.json();
  },

  // Address Changes
  getAddressChanges: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/households/address-changes/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch address changes");
    return response.json();
  },

  getAddressChangeById: async (id) => {
    const response = await fetch(`/api/households/address-changes/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch address change");
    return response.json();
  },

  // Household Splits
  getSplits: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/households/splits/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch splits");
    return response.json();
  },

  getSplitById: async (id) => {
    const response = await fetch(`/api/households/splits/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch split");
    return response.json();
  },

  // Birth Declares
  getBirthDeclares: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/persons/birth-declares/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch birth declares");
    return response.json();
  },

  getBirthDeclareById: async (id) => {
    const response = await fetch(`/api/persons/birth-declares/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch birth declare");
    return response.json();
  },

  // Death Declares
  getDeathDeclares: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/persons/death-declares/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch death declares");
    return response.json();
  },

  getDeathDeclareById: async (id) => {
    const response = await fetch(`/api/persons/death-declares/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch death declare");
    return response.json();
  },

  // Temporary Residence
  getTemporaryResidences: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/persons/temporary-residences/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch temporary residences");
    return response.json();
  },

  getTemporaryResidenceById: async (id) => {
    const response = await fetch(`/api/persons/temporary-residences/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch temporary residence");
    return response.json();
  },

  // Temporary Absence
  getTemporaryAbsences: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/persons/temporary-absences/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch temporary absences");
    return response.json();
  },

  getTemporaryAbsenceById: async (id) => {
    const response = await fetch(`/api/persons/temporary-absences/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch temporary absence");
    return response.json();
  },

  // Permanent Residence Changes
  getPermanentResidenceChanges: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/persons/permanent-residence-changes/page?${queryParams}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch permanent residence changes");
    return response.json();
  },

  getPermanentResidenceChangeById: async (id) => {
    const response = await fetch(`/api/persons/permanent-residence-changes/${id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch permanent residence change");
    return response.json();
  },
};