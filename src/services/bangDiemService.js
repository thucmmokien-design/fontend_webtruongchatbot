import axiosConfig from './axiosConfig'

export const bangDiemService = {
  // Lấy bảng điểm của sinh viên (tất cả môn học)
  getBangDiemByMaSV: async (maSV) => {
    try {
      const response = await axiosConfig.get(`/api/bang-diem/${maSV}`)
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy bảng điểm:', error)
      return { success: false, result: [], message: 'Lỗi khi lấy bảng điểm', code: 500 }
    }
  },

  // Lấy bảng điểm theo học kỳ
  getBangDiemByMaSVAndHocKy: async (maSV, maHocKy, namHoc) => {
    try {
      const response = await axiosConfig.get(`/api/bang-diem/${maSV}/hoc-ky`, {
        params: {
          maHocKy,
          namHoc
        }
      })
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy bảng điểm theo học kỳ:', error)
      return { success: false, result: [], message: 'Lỗi khi lấy bảng điểm', code: 500 }
    }
  }
}
