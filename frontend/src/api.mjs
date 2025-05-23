export async function fetchPredictions(date, maxAttempts = 6, baseDelay = 2000, setRetryAttempt = () => {}, availableDates = [], setSelectedDate = () => {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    setRetryAttempt(attempt);
    try {
      const response = await fetch(`/api/loadpredict?date=${date}`);

      if (response.status === 404) {
        const fallback = availableDates.find(d => d < date);
        if (fallback) {
          setSelectedDate(fallback);
          return await fetchPredictions(fallback, maxAttempts, baseDelay, setRetryAttempt, availableDates, setSelectedDate);
        } else {
          return { message: `No prediction available for ${date}` };
        }
      }

      if (response.ok) {
        const data = await response.json();
        return data.predictions || data;
      }

    } catch (error) {
      console.error(`Attempt ${attempt} failed.`, error);
    }

    const delay = baseDelay * attempt;
    console.log(`Retrying in ${delay}ms...`);
    await new Promise(res => setTimeout(res, delay));
  }

  throw new Error("Backend did not respond after retries.");
}

export async function fetchAvailableDates() {
    try {
      const response = await fetch('/api/dates');
      const data = await response.json();
      return data.dates || [];
    } catch (error) {
      console.error("Error fetching dates:", error);
      return [];
    }
  }
  