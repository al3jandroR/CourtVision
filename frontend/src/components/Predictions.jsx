import { useEffect, useState } from 'react';
import { fetchPredictions } from '../api';

export default function Predictions() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleGetPredictions() {
        setLoading(true);
        setError(null);
    
        const data = await fetchPredictions();
        if (data) {
            setPredictions(data);
        } else {
            setError("Failed to load predictions. Try again.");
        }
    
        setLoading(false);
    }
    
    if (loading) return <p>Loading predictions...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <button 
                onClick={handleGetPredictions}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
                🔮 Get Today’s Predictions
            </button>

            {loading && <p>Loading predictions...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4">
                {predictions.map((game, index) => (
                    <div key={index} className="p-4 border rounded">
                        <p><strong>{game.Matchup}</strong></p>
                        <p>🏆 Winner: {game.Predicted_Winner}</p>
                        <p>📊 Home: {game.Home_Prob}, Away: {game.Away_Prob}</p>
                        <p>🚑 Home Injuries: {Array.isArray(game.Home_Injuries) ? game.Home_Injuries.join(', ') : game.Home_Injuries}</p>
                        <p>🚑 Away Injuries: {Array.isArray(game.Away_Injuries) ? game.Away_Injuries.join(', ') : game.Away_Injuries}</p>
                    </div>
                ))}
            </div>
        </div>

    );
}
