/**
 * Google Sheets API Service
 * 
 * LƯU Ý: Service account credentials không thể dùng trực tiếp ở client-side vì lý do bảo mật.
 * Bạn cần tạo một backend API endpoint để xử lý Google Sheets API.
 * 
 * File này cung cấp các hàm helper để gọi đến backend API của bạn.
 */

export interface SheetData {
  range: string
  values: (string | number | boolean)[][]
}

export interface ReadSheetOptions {
  range?: string // Ví dụ: "Sheet1!A1:D10" hoặc "Sheet1"
  sheetName?: string
  startRow?: number
  endRow?: number
  startCol?: string
  endCol?: string
}

export interface WriteSheetOptions {
  range?: string
  values: (string | number | boolean)[][]
  sheetName?: string
}

/**
 * Đọc dữ liệu từ Google Sheet
 * @param options - Các tùy chọn để đọc sheet
 * @returns Promise với dữ liệu từ sheet
 */
export async function readSheet(options: ReadSheetOptions = {}): Promise<SheetData> {
  const { range, sheetName, startRow, endRow, startCol, endCol } = options

  let finalRange = range
  if (!finalRange && sheetName) {
    if (startRow && endRow && startCol && endCol) {
      finalRange = `${sheetName}!${startCol}${startRow}:${endCol}${endRow}`
    } else if (sheetName) {
      finalRange = sheetName
    }
  }

  // TODO: Thay đổi URL này thành backend API endpoint của bạn
  // Ví dụ: const response = await fetch('/api/google-sheets/read', { ... })
  const response = await fetch('/api/google-sheets/read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ range: finalRange }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || errorData.error || `Failed to read sheet: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Ghi dữ liệu vào Google Sheet
 * @param options - Các tùy chọn để ghi vào sheet
 * @returns Promise với kết quả
 */
export async function writeSheet(options: WriteSheetOptions): Promise<void> {
  const { range, values, sheetName } = options

  let finalRange = range
  if (!finalRange && sheetName) {
    // Tính toán range từ số lượng rows và columns
    const numRows = values.length
    const numCols = values[0]?.length || 0
    if (numRows > 0 && numCols > 0) {
      const startCol = 'A'
      const endCol = String.fromCharCode(64 + numCols) // A-Z
      finalRange = `${sheetName}!${startCol}1:${endCol}${numRows}`
    } else {
      finalRange = sheetName
    }
  }

  // TODO: Thay đổi URL này thành backend API endpoint của bạn
  // Ví dụ: const response = await fetch('/api/google-sheets/write', { ... })
  const response = await fetch('/api/google-sheets/write', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ range: finalRange, values }),
  })

  if (!response.ok) {
    throw new Error(`Failed to write sheet: ${response.statusText}`)
  }
}

/**
 * Lấy danh sách các sheets trong spreadsheet
 * @returns Promise với danh sách tên sheets
 */
export async function getSheetNames(): Promise<string[]> {
  // TODO: Thay đổi URL này thành backend API endpoint của bạn
  const response = await fetch('/api/google-sheets/sheets', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get sheet names: ${response.statusText}`)
  }

  const data = await response.json()
  return data.sheetNames || []
}

