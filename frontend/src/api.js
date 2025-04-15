const API_URL = import.meta.env.VITE_API_URL;

export async function fetchPredictions(date) {
    try {
      const response = await fetch(`${API_URL}/predict?date=${date}`);
      if (!response.ok) throw new Error('Failed to fetch predictions');
      const data = await response.json();
      return data.predictions || data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  }
  