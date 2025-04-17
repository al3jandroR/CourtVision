export default async function handler(req, res) {
    try {
      const apiUrl = 'https://backend-dry-butterfly-4692.fly.dev';
      const response = await fetch(`${apiUrl}/dates`);
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (err) {
      console.error("Failed to fetch dates:", err);
      res.status(500).json({ error: "Unable to fetch available dates" });
    }
  }
  