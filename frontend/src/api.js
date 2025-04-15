const API_URL = 'https://courtvision.onrender.com';

export async function fetchPredictions() {
    try {
        const response = await fetch(`${API_URL}/predict`);
        if (!response.ok) throw new Error('Failed to fetch predictions');
        const data = await response.json();

        return data.predictions || data;  
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return null;
    }
}