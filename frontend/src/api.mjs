export async function fetchPredictions(date, maxAttempts = 6, baseDelay = 2000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(`/api/predict?date=${date}`);
        if (response.ok) {
          const data = await response.json();
          return data.predictions || data;
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed.`);
      }
  
      const delay = baseDelay * attempt;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  
    throw new Error("Backend did not respond after retries.");
  }
  