/**
 * Authentication API Service
 * Kết nối với Google Sheets để xác thực người dùng
 */

import { readSheet } from './google-sheets'

export type User = {
  id: string
  ten_dang_nhap: string
  ten_nguoi_dung: string
  mat_khau: string
  phan_quyen: string
  tg_tao: string
  tg_cap_nhat: string
}

/**
 * Đăng nhập người dùng
 * @param ten_dang_nhap - Tên đăng nhập
 * @param mat_khau - Mật khẩu
 * @returns Promise với thông tin người dùng nếu đăng nhập thành công
 */
export async function login(ten_dang_nhap: string, mat_khau: string): Promise<User | null> {
  try {
    // Đọc toàn bộ sheet nguoi_dung
    const sheetData = await readSheet({
      sheetName: 'nguoi_dung',
    })

    // Parse dữ liệu từ Google Sheets
    // Giả sử hàng đầu tiên là header: id, ten_dang_nhap, ten_nguoi_dung, mat_khau, phan_quyen, tg_tao, tg_cap_nhat
    const rows = sheetData.values || []
    
    if (rows.length < 2) {
      return null // Không có dữ liệu
    }

    // Tìm người dùng với ten_dang_nhap và mat_khau khớp
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row.length >= 4) {
        const [id, username, name, password, permission, createdAt, updatedAt] = row
        
        if (
          String(username).trim().toLowerCase() === ten_dang_nhap.trim().toLowerCase() &&
          String(password) === mat_khau
        ) {
          return {
            id: String(id || ''),
            ten_dang_nhap: String(username || ''),
            ten_nguoi_dung: String(name || ''),
            mat_khau: String(password || ''),
            phan_quyen: String(permission || ''),
            tg_tao: String(createdAt || ''),
            tg_cap_nhat: String(updatedAt || ''),
          }
        }
      }
    }

    return null // Không tìm thấy người dùng
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Kiểm tra nếu là lỗi kết nối server
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('500')) {
      throw new Error('Không thể kết nối đến server. Vui lòng chạy lệnh: npm run dev:all hoặc npm run dev:server')
    }
    
    throw new Error(errorMessage.includes('Failed to read sheet') 
      ? `Lỗi khi đọc dữ liệu từ Google Sheets: ${errorMessage}` 
      : `Lỗi khi đăng nhập: ${errorMessage}`)
  }
}

/**
 * Đổi mật khẩu người dùng
 * @param ten_dang_nhap - Tên đăng nhập
 * @param currentPassword - Mật khẩu hiện tại
 * @param newPassword - Mật khẩu mới
 */
export async function changePassword(
  ten_dang_nhap: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ten_dang_nhap,
        current_password: currentPassword,
        new_password: newPassword,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || errorData.error || 'Đổi mật khẩu thất bại')
    }

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Đổi mật khẩu thất bại')
    }
  } catch (error) {
    console.error('Change password error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Kiểm tra nếu là lỗi kết nối server
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      throw new Error('Không thể kết nối đến server. Vui lòng chạy lệnh: npm run dev:all hoặc npm run dev:server')
    }
    
    throw new Error(errorMessage)
  }
}
