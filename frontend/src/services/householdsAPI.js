export const householdsAPI = {
	addOne: async (values) => {
		const response = await fetch('/api/households', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values)
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to add new household');
		}

		const data = await response.json();
		return data;
	},

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

	updateOne: async (values) => {
		const response = await fetch(`/api/households/${values?.id}`, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(values)
		});
		
		if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'Failed to update household');
		}
		const data = await response.json();
		return data;
	},

	deleteOne: async (id) => {
		const response = await fetch(`/api/households/${id}`, {
		method: 'DELETE',
		credentials: 'include',
		});
		if (!response.ok) {
			throw new Error('Failed to delete household');
		}
	},



// --- Member section ---
	addMember: async (householdId, memberData) => {
		const response = await fetch(`/api/households/${householdId}/members`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(memberData)
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to add household member');
		}
		const data = await response.json();
		return data;
	},

	getMembers: async (householdId) => {
		const response = await fetch(`/api/households/${householdId}/members`, {
		method: 'GET',
		credentials: 'include',
		});

		if (!response.ok) {
		throw new Error('Failed to fetch household members');
		}

		const data = await response.json();
		return data;
	},

	updateMember: async (householdId, memberId, memberData) => {
		const response = await fetch(`/api/households/${householdId}/members/${memberId}`, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(memberData)
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to update household member');
		}
		const data = await response.json();
		return data;
	},

	removeMember: async (householdId, memberId) => {
		const response = await fetch(`/api/households/${householdId}/members/${memberId}`, {
			method: 'DELETE',
			credentials: 'include',
		});
		if (!response.ok) {
			throw new Error('Failed to remove household member');
		}
	},



	// --- 

	headChange: async (householdId, newHeadId) => {
		try {
			const response = await fetch(`/api/households/head-changes`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					householdId,
					toPersonId: newHeadId
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to change household head');
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error in headChange:', error);
			throw error;
		}
	}
};