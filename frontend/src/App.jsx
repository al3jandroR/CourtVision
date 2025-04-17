import Header from './components/Header';
import Predictions from './components/Predictions';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchPredictions } from './api.mjs';
import { useState, useEffect } from 'react';

export default function App() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function warmAndFetch() {
      setLoading(true);
      setError(null);

      try {
        await fetch('/api/ping').catch(() => {});
        await new Promise(res => setTimeout(res, 2000));

        const today = new Date().toISOString().split('T')[0];
        const data = await fetchPredictions(today, 5, 2000);

        if (data?.predictions) {
          setPredictions(data.predictions);
        } else if (data) {
          setPredictions(data);
        } else {
          setError("No predictions available.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load predictions.");
      }

      setLoading(false);
    }

    warmAndFetch();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <LoadingSpinner />
            <p style={{ marginTop: "12px", fontSize: "16px", color: "#555" }}>
              Waking the backend... hang tight 👀
            </p>
          </div>
        )}

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
