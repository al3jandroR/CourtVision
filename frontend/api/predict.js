export default async function handler(req, res) {
    const { date } = req.query;
    const apiUrl = process.env.FLY_API_URL;
  
    const response = await fetch(`${apiUrl}/predict?date=${date}`, {
      headers: {
        "x-api-key": process.env.API_KEY
      }
    });
  
    const data = await response.json();
    res.status(response.status).json(data);
  }
  