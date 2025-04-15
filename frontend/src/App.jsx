import Header from './components/Header';
import Controls from './components/Controls';
import Predictions from './components/Predictions';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchPredictions } from './api';
import { useState } from 'react';

export default function App() {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGetPredictions() {
    setLoading(true);
    setError(null);

    const data = await fetchPredictions();

    if (data) {
      if (data.predictions) {
        setPredictions(data.predictions);
      } else {
        setPredictions(data);
      }
    } else {
      setError("Failed to load predictions.");
    }
  
    setLoading(false);
  }

  return (
    <>
      <Header />
      <div className="container">
        <Controls onPredict={handleGetPredictions} />
        {loading && <LoadingSpinner />}
        {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
        {predictions && <Predictions predictions={predictions} />}
      </div>
    </>
  );
}
