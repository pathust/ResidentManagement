export const householdsAPI = {
	getAll: async (params = {}) => {
		const queryParams = new URLSearchParams({
			pageSize: params.pageSize || 100,
			pageIndex: params.pageIndex || 0,
		});
	
		const response = await fetch(`/api/households?${queryParams}`, {
			method: "GET",
		});
	
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể tải danh sách hộ khẩu");
		}
	
		return response.json();
	},
  
	getMembers: async (householdId) => {
		const response = await fetch(`/api/households/${householdId}/members`, {
			method: "GET",
		});
	
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể tải thông tin thành viên");
		}
	
		return response.json();
	},
  
	addOne: async (data) => {
		const response = await fetch("/api/households", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
	
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể thêm hộ khẩu");
		}
	
		return response.json();
	},
  
	addMember: async (householdId, memberData) => {
		const response = await fetch(`/api/households/${householdId}/members`, {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(memberData),
		});
	
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể thêm thành viên");
		}
	
		return response.json();
	},
  
	removeMember: async (householdId, membershipId) => {
		const response = await fetch(`/api/households/${householdId}/members/${membershipId}`, {
			method: "DELETE",
		});
	
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể xóa thành viên");
		}
	
		return response.json();
	},

	inforChange: async (householdId, payload) => {
		console.log("Payload for info change:", payload);
		const response = await fetch(`/api/households/${householdId}`, {
			method: "PUT",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể thay đổi thông tin hộ khẩu");
		}
		return response.json();
	},
  
	headChange: async (payload) => {
		const response = await fetch("/api/households/head-changes", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
	
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể đổi chủ hộ");
		}
	
		return response.json();
	},

	addressChange: async (payload) => {
		console.log("Payload for address change:", payload);
		const response = await fetch("/api/households/address-changes", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể thay đổi địa chỉ hộ khẩu");
		}
		return response.json();
	},
  
	splits: async (payload) => {
		const response = await fetch("/api/households/splits", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
	
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Không thể tách hộ khẩu");
		}
	
		return response.json();
	},
  };