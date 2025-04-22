import Header from './components/Header';
import Predictions from './components/Predictions';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchPredictions, fetchAvailableDates } from './api.mjs';
import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function loadDatesAndFetch() {
      setLoading(true);
      setError(null);

      try {
        const today = new Date().toISOString().split('T')[0];
        const data = await fetchPredictions(today, 5, 2000, setRetryAttempt);

        if (data?.predictions) {
          setPredictions(data.predictions);
        } else if (data) {
          setPredictions(data);
        } else {
          setError("No predictions available.");
        }

        const dates = await fetchAvailableDates();
        setAvailableDates(dates);

        if (dates.includes(today)) {
          setSelectedDate(today);
        } else if (dates.length > 0) {
          setSelectedDate(dates[0]);
        } else {
          setSelectedDate('');
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load predictions.");
      }

      setLoading(false);
    }

    loadDatesAndFetch();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <LoadingSpinner />
            <p style={{ marginTop: "12px", fontSize: "16px", color: "#555" }}>
              {retryAttempt > 1
                ? "Waking the backend... hang tight!"
                : "Loading predictions..."}
            </p>
          </div>
        )}

        {!loading && error && (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        )}

        {!loading && predictions && (
          <Predictions predictions={predictions} />
        )}

        {!loading && availableDates.length > 0 && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <select
              value={selectedDate}
              onChange={async (e) => {
                const chosenDate = e.target.value;
                setSelectedDate(chosenDate);
                setLoading(true);
                setError(null);
                setRetryAttempt(0);

                try {
                  const data = await fetchPredictions(chosenDate, 5, 2000, setRetryAttempt);
                  if (data?.predictions) {
                    setPredictions(data.predictions);
                  } else if (data) {
                    setPredictions(data);
                  } else {
                    setError("No predictions available.");
                  }
                } catch (err) {
                  setError("Failed to load predictions.");
                }
                setLoading(false);
              }}
            >
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
          </select>
          </div>
        )}

        {!loading && availableDates.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "1rem", color: "#777" }}>
            No prediction dates available. Try again later.
          </p>
        )}
      </div>
    </>
  );
}
