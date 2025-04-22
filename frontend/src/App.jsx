import Header from './components/Header';
import Predictions from './components/Predictions';
import LoadingSpinner from './components/LoadingSpinner';
import { fetchPredictions, fetchAvailableDates } from './api.mjs';
import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      setError(null);
  
      try {
        const dates = await fetchAvailableDates();
        setAvailableDates(dates);
  
        let initialDate = new Date().toISOString().split('T')[0];
        if (!dates.includes(initialDate) && dates.length > 0) {
          initialDate = dates[0];
        }
        setSelectedDate(initialDate);
  
        const data = await fetchPredictions(
          initialDate,
          5,
          2000,
          setRetryAttempt,
          dates,
          setSelectedDate
        );
  
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
  
    loadInitialData();
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
  
        {!loading && availableDates.length > 0 && (
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <select
              value={selectedDate}
              onChange={async (e) => {
                const chosenDate = e.target.value;
                setSelectedDate(chosenDate);
                setLoading(true);
                setError(null);
                setRetryAttempt(0);
  
                try {
                  const data = await fetchPredictions(
                    chosenDate,
                    5,
                    2000,
                    setRetryAttempt,
                    availableDates,
                    setSelectedDate
                  );                  
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
  
        {!loading && predictions && (
          <Predictions predictions={predictions} />
        )}
  
        {!loading && availableDates.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "1rem", color: "#777" }}>
            No prediction dates available. Try again later.
          </p>
        )}
      </div>
      <Footer />
    </>
  );  
}
