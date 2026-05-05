import axiosConfig from './axiosConfig'

export const thanhToanService = {
  // Lấy thông tin thanh toán theo học kỳ
  getThanhToanByHocKy: async (maSV, maHocKy, namHoc) => {
    try {
      const response = await axiosConfig.get(`/api/hoc-phi/${maSV}/thanh-toan`, {
        params: {
          maHocKy,
          namHoc
        }
      })
      console.log('Service response:', response.data);
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thanh toán:', error)
      return { 
        code: 500,
        message: 'Lỗi khi lấy thông tin thanh toán',
        result: null
      }
    }
  }
}
