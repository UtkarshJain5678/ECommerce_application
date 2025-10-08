import type { NextApiRequest, NextApiResponse } from 'next';

interface RevalidateRequestBody {
  paths: string[]; // Array of paths to revalidate
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Enforce POST method for security and body content
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed. Use POST.' });
  }

  // 2. Check for the Secret Token
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { paths }: RevalidateRequestBody = req.body;
  const revalidatedPaths: string[] = [];
  const failedPaths: string[] = [];

  // 3. Validate paths array
  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ message: 'Missing or invalid array of paths in request body.' });
  }

  // 4. Perform Revalidation for each path
  for (const path of paths) {
    try {
      await res.revalidate(path);
      revalidatedPaths.push(path);
    } catch (err) {
      console.error(`Revalidation FAILED for: ${path}`, err);
      failedPaths.push(path);
    }
  }

  // 5. Send Summary Response
  if (failedPaths.length > 0) {
    // Log success for the admin to check
    console.log(`Revalidation success for: ${revalidatedPaths.join(', ')}`);
    return res.status(500).json({
      message: 'Some paths failed to revalidate.',
      revalidated: revalidatedPaths,
      failed: failedPaths,
    });
  }
  
  // Successful revalidation of all paths
  return res.json({ revalidated: true, paths: revalidatedPaths });
}