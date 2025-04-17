export default async function handler(req, res) {
    try {
      const apiUrl = process.env.FLY_API_URL;
      const response = await fetch(`${apiUrl}/dates`, {
        headers: {
          'x-api-key': process.env.API_KEY
        }
      });
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch dates' });
    }
  }
  