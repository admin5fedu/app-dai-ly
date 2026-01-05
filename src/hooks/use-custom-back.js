import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Custom hook để xử lý navigation back một cách thông minh
 * - Nếu có lịch sử trình duyệt và state.from: dùng navigate(-1) để quay lại trang trước
 * - Nếu không (F5, direct link): dùng location.state.from hoặc fallbackPath làm fallback
 * 
 * @param {string} fallbackPath - Đường dẫn mặc định khi không có state (mặc định: '/products')
 * @returns {Function} handleBack - Function để gọi khi muốn quay lại
 */
export function useCustomBack(fallbackPath = '/products') {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Lấy trang gốc từ state, nếu không có thì dùng fallbackPath
  const originPath = location.state?.from || fallbackPath
  
  const handleBack = () => {
    // Nếu có lịch sử trình duyệt (người dùng đi từ trong app)
    // và có state.from (được navigate từ trong app)
    if (window.history.length > 1 && location.state?.from) {
      navigate(-1) // Quay lại trang trước đó (giữ nguyên scroll, search, v.v.)
    } else {
      // Nếu nhấn F5, copy link, hoặc truy cập trực tiếp, quay về trang originPath
      navigate(originPath, { replace: true })
    }
  }
  
  return { handleBack, originPath, locationState: location.state }
}

