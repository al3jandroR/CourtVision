export default async function handler(req, res) {
    try {
      const apiUrl = 'https://backend-dry-butterfly-4692.fly.dev';
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
  