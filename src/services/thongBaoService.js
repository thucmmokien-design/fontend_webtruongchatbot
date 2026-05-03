import axiosConfig from './axiosConfig'

export const thongBaoService = {
  // Lấy tất cả thông báo
  getAllThongBao: async () => {
    try {
      const response = await axiosConfig.get('/api/thong-bao')
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thông báo:', error)
      return { 
        success: false, 
        result: [], 
        message: 'Lỗi khi lấy danh sách thông báo', 
        Code: 500 
      }
    }
  },

  // Lấy thông báo theo sinh viên
  getThongBaoByMaSV: async (maSV) => {
    try {
      const response = await axiosConfig.get(`/api/thong-bao/sinh-vien/${maSV}`)
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy thông báo cho sinh viên:', error)
      return { 
        success: false, 
        result: [], 
        message: 'Lỗi khi lấy thông báo', 
        Code: 500 
      }
    }
  },

  // Lấy thông báo theo tag
  getThongBaoByTag: async (tag) => {
    try {
      const response = await axiosConfig.get(`/api/thong-bao/tag/${tag}`)
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy thông báo theo tag:', error)
      return { 
        success: false, 
        result: [], 
        message: 'Lỗi khi lấy thông báo', 
        Code: 500 
      }
    }
  },

  // Lấy chi tiết thông báo
  getThongBaoById: async (maThongBao) => {
    try {
      const response = await axiosConfig.get(`/api/thong-bao/${maThongBao}`)
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết thông báo:', error)
      return { 
        success: false, 
        result: null, 
        message: 'Lỗi khi lấy chi tiết thông báo', 
        Code: 500 
      }
    }
  }
}
