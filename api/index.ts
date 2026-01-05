import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { readSheetServer, writeSheetServer, getSheetNamesServer, updatePasswordServer } from '../server/google-sheets.js'

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Read sheet data
app.post('/api/google-sheets/read', async (req, res) => {
  try {
    const { range } = req.body

    if (!range) {
      return res.status(400).json({ error: 'Range is required' })
    }

    console.log(`Reading sheet with range: ${range}`)
    const data = await readSheetServer(range)
    res.json(data)
  } catch (error) {
    console.error('Error reading sheet:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error stack:', errorStack)
    res.status(500).json({
      error: 'Failed to read sheet',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
    })
  }
})

// Write sheet data
app.post('/api/google-sheets/write', async (req, res) => {
  try {
    const { range, values } = req.body

    if (!range || !values) {
      return res.status(400).json({ error: 'Range and values are required' })
    }

    await writeSheetServer(range, values)
    res.json({ success: true, message: 'Data written successfully' })
  } catch (error) {
    console.error('Error writing sheet:', error)
    res.status(500).json({
      error: 'Failed to write sheet',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// Get sheet names
app.get('/api/google-sheets/sheets', async (_req, res) => {
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
})

// Change password
app.post('/api/auth/change-password', async (req, res) => {
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
})

// Export app for Vercel serverless
export default app

