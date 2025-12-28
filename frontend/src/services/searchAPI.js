//person search API
export const searchPersons = async (query) => {
    const queryString = query ? `?q=${encodeURIComponent(query)}` : '';

    const response = await fetch(`/api/search/persons${queryString}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch persons');
    }

    const data = await response.json();
    return data;
}