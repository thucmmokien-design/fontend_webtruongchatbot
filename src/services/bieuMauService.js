import axiosConfig from './axiosConfig'

export const bieuMauService = {
  // Lấy tất cả biểu mẫu
  getAllBieuMau: async () => {
    try {
      const response = await axiosConfig.get('/api/bieu-mau')
      console.log('API tất cả biểu mẫu:', response.data);
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách biểu mẫu:', error)
      return { 
        code: 500,
        Message: 'Lỗi khi lấy danh sách biểu mẫu',
        result: []
      }
    }
  },

  // Lấy biểu mẫu theo loại
  getBieuMauByLoai: async (loai) => {
    try {
      const response = await axiosConfig.get(`/api/bieu-mau/loai/${encodeURIComponent(loai)}`)
      console.log(`API biểu mẫu loại ${loai}:`, response.data);
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy biểu mẫu theo loại:', error)
      return { 
        code: 500,
        Message: 'Lỗi khi lấy biểu mẫu theo loại',
        result: []
      }
    }
  },

  // Lấy chi tiết biểu mẫu
  getBieuMauById: async (maBieuMau) => {
    try {
      const response = await axiosConfig.get(`/api/bieu-mau/${maBieuMau}`)
      console.log('API chi tiết biểu mẫu:', response.data);
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết biểu mẫu:', error)
      return { 
        code: 500,
        Message: 'Lỗi khi lấy chi tiết biểu mẫu',
        result: null
      }
    }
  }
}
