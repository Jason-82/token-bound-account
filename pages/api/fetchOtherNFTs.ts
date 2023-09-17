import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('YOUR_AWS_LAMBDA_ENDPOINT', {
      method: 'GET',
      // ... any other required configurations for your endpoint ...
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
}