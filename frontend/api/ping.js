export default async function handler(req, res) {
    try {
      const apiUrl = 'https://backend-dry-butterfly-4692.fly.dev';
      const response = await fetch(`${apiUrl}/healthz`);
      const data = await response.text();
  
      res.status(200).json({ status: 'ok', response: data });
    } catch (err) {
      res.status(500).json({ status: 'fail', message: 'Backend may be sleeping' });
    }
  }  