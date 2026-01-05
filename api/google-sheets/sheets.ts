import { getSheetNamesServer } from '../../server/google-sheets.js'

type VercelRequest = {
  method?: string
  body?: any
  query?: Record<string, string>
  headers?: Record<string, string>
}

type VercelResponse = {
  status: (code: number) => VercelResponse
  json: (data: any) => void
  setHeader: (name: string, value: string) => void
  end: () => void
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const sheetNames = await getSheetNamesServer()
    res.json({ sheetNames })
  } catch (error) {
    console.error('Error getting sheet names:', error)
    res.status(500).json({
      error: 'Failed to get sheet names',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

