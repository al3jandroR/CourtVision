const API_URL = 'http://127.0.0.1:8000';

export async function fetchPredictions() {
    try {
        const response = await fetch(`${API_URL}/predict-today`);
        if (!response.ok) throw new Error('Failed to fetch predictions');
        const data = await response.json();
        return data.predictions;
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return null;
    }
}
