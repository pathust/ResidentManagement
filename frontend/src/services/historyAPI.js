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
