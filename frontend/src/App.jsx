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

  async function handleGetPredictions(date) {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${'http://127.0.0.1:8000'}/predict?date=${date}`);
      const data = await response.json();
  
      if (data.predictions) {
        setPredictions(data.predictions);
      } else {
        setPredictions(data);
      }
    } catch (err) {
      console.error(err);
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
  
        {!loading && error && (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        )}
  
        {!loading && predictions && (
          <Predictions predictions={predictions} />
        )}
      </div>
    </>
  );
  
}
