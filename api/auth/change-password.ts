import { updatePasswordServer } from '../../server/google-sheets.js'

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { ten_dang_nhap, current_password, new_password } = req.body

    if (!ten_dang_nhap || !current_password || !new_password) {
      return res.status(400).json({ error: 'Tên đăng nhập, mật khẩu hiện tại và mật khẩu mới là bắt buộc' })
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
    }

    await updatePasswordServer('nguoi_dung', ten_dang_nhap, current_password, new_password)
    res.json({ success: true, message: 'Đổi mật khẩu thành công' })
  } catch (error) {
    console.error('Error changing password:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(400).json({
      error: 'Failed to change password',
      message: errorMessage,
    })
  }
}

