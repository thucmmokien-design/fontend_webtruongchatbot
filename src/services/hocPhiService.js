import axiosConfig from './axiosConfig'

export const hocPhiService = {
  // Lấy thông tin học phí của sinh viên
  getHocPhiByMaSV: async (maSV) => {
    try {
      const response = await axiosConfig.get(`/api/hoc-phi/${maSV}`)
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy thông tin học phí:', error)
      return { 
        success: false, 
        result: null, 
        message: 'Lỗi khi lấy thông tin học phí', 
        code: 500 
      }
    }
  }
}
