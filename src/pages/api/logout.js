// pages/api/logout.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      // Assuming we are using token-based authentication, there's no need to handle server-side session
      // Simply respond with a success message
      res.status(200).json({ message: 'Logout successful' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  