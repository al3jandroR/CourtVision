export default async function handler(req, res) {
    const { date } = req.query;
  
    if (!date) {
      return res.status(400).json({ error: 'Missing required query parameter: date' });
    }
  
    try {
      const apiUrl = process.env.FLY_API_URL;
      const response = await fetch(`${apiUrl}/loadpredict?date=${date}`);
      
      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      console.error('Fetch error:', err);
      res.status(500).json({ error: 'Failed to load predictions' });
    }
  }
  