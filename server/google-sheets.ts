import { google } from 'googleapis'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Lấy Google Sheets API client với service account authentication
 */
function getSheetsClient() {
  // Hỗ trợ cả VITE_ prefix (cho client) và không có prefix (cho server)
  const getEnv = (key: string, defaultValue: string = '') => {
    return process.env[key] || process.env[`VITE_${key}`] || defaultValue
  }

  const credentials = {
    type: getEnv('GOOGLE_SERVICE_ACCOUNT_TYPE', 'service_account'),
    project_id: getEnv('GOOGLE_SERVICE_ACCOUNT_PROJECT_ID'),
    private_key_id: getEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID'),
    private_key: (getEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY') || '').replace(/\\n/g, '\n'),
    client_email: getEnv('GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL'),
    client_id: getEnv('GOOGLE_SERVICE_ACCOUNT_CLIENT_ID'),
    auth_uri: getEnv('GOOGLE_SERVICE_ACCOUNT_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
    token_uri: getEnv('GOOGLE_SERVICE_ACCOUNT_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
    auth_provider_x509_cert_url: getEnv('GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL', 'https://www.googleapis.com/oauth2/v1/certs'),
    client_x509_cert_url: getEnv('GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL'),
    universe_domain: getEnv('GOOGLE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN', 'googleapis.com'),
  }

  if (!credentials.client_email || !credentials.private_key) {
    console.error('Missing credentials:', {
      hasClientEmail: !!credentials.client_email,
      hasPrivateKey: !!credentials.private_key,
      envKeys: Object.keys(process.env).filter(k => k.includes('GOOGLE')),
    })
    throw new Error('Google Service Account credentials are not configured properly. Please check your .env file.')
  }

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}

/**
 * Đọc dữ liệu từ Google Sheet
 */
export async function readSheetServer(range: string = 'Sheet1') {
  const sheets = getSheetsClient()
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID

  if (!spreadsheetId) {
    console.error('Missing spreadsheet ID. Available env keys:', Object.keys(process.env).filter(k => k.includes('SPREADSHEET')))
    throw new Error('Spreadsheet ID is not configured. Please check your .env file.')
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  return {
    range: response.data.range || range,
    values: response.data.values || [],
  }
}

/**
 * Ghi dữ liệu vào Google Sheet
 */
export async function writeSheetServer(
  range: string,
  values: (string | number | boolean)[][]
) {
  const sheets = getSheetsClient()
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID

  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID is not configured. Please check your .env file.')
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  })
}

/**
 * Lấy danh sách tên các sheets trong spreadsheet
 */
export async function getSheetNamesServer() {
  const sheets = getSheetsClient()
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID

  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID is not configured. Please check your .env file.')
  }

  const response = await sheets.spreadsheets.get({
    spreadsheetId,
  })

  return response.data.sheets?.map((sheet) => sheet.properties?.title || '').filter(Boolean) || []
}

/**
 * Cập nhật mật khẩu của người dùng trong Google Sheet
 * @param sheetName - Tên sheet (ví dụ: 'nguoi_dung')
 * @param tenDangNhap - Tên đăng nhập
 * @param currentPassword - Mật khẩu hiện tại
 * @param newPassword - Mật khẩu mới
 */
export async function updatePasswordServer(
  sheetName: string,
  tenDangNhap: string,
  currentPassword: string,
  newPassword: string
) {
  const sheets = getSheetsClient()
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID

  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID is not configured. Please check your .env file.')
  }

  // Đọc toàn bộ sheet
  const sheetData = await readSheetServer(sheetName)
  const rows = sheetData.values || []

  if (rows.length < 2) {
    throw new Error('Sheet không có dữ liệu')
  }

  // Tìm row của user (giả sử cấu trúc: id, ten_dang_nhap, ten_nguoi_dung, mat_khau, phan_quyen, tg_tao, tg_cap_nhat)
  let userRowIndex = -1
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length >= 4) {
      const username = String(row[1] || '').trim().toLowerCase()
      const password = String(row[3] || '')
      
      if (username === tenDangNhap.trim().toLowerCase()) {
        // Verify mật khẩu hiện tại
        if (password !== currentPassword) {
          throw new Error('Mật khẩu hiện tại không đúng')
        }
        userRowIndex = i
        break
      }
    }
  }

  if (userRowIndex === -1) {
    throw new Error('Không tìm thấy người dùng')
  }

  // Update mật khẩu và thời gian cập nhật
  const row = rows[userRowIndex]
  
  // Đảm bảo row có đủ số columns (7 columns: id, ten_dang_nhap, ten_nguoi_dung, mat_khau, phan_quyen, tg_tao, tg_cap_nhat)
  while (row.length < 7) {
    row.push('')
  }
  
  row[3] = newPassword // mat_khau ở index 3 (column D)
  row[6] = new Date().toISOString() // tg_cap_nhat ở index 6 (column G)

  // Ghi lại toàn bộ sheet
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${sheetName}!A1:G${rows.length}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: rows,
    },
  })

  return { success: true }
}

