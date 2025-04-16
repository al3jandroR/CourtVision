export default async function handler(req, res) {
    const { date } = req.query;
  
    const response = await fetch(`https://backend-dry-butterfly-4692.fly.dev/predict?date=${date}`, {
      headers: {
        "x-api-key": process.env.API_KEY
      }
    });
  
    const data = await response.json();
    res.status(response.status).json(data);
  }
  