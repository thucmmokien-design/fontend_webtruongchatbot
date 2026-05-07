import axiosConfig from './axiosConfig'

export const dangKyMonHocService = {
  // Lấy danh sách lớp học có thể đăng ký
  getDanhSachLopHoc: async () => {
    try {
      const response = await axiosConfig.get('/api/dang-ky-lop-hoc/danh-sach')
      console.log('API danh sách lớp học:', response.data);
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lớp học:', error)
      return { 
        code: 500,
        message: 'Lỗi khi lấy danh sách lớp học',
        result: []
      }
    }
  },

  // Đăng ký lớp học
  dangKyLopHoc: async (maSV, maMo) => {
    try {
      const response = await axiosConfig.post('/api/dang-ky-lop-hoc/dang-ky', {
        maSV,
        maMo
      })
      console.log('API đăng ký:', response.data);
      return response.data
    } catch (error) {
      console.error('Lỗi khi đăng ký lớp học:', error)
      if (error.response && error.response.data) {
        return error.response.data
      }
      return { 
        code: 500,
        message: 'Lỗi khi đăng ký lớp học',
        result: null
      }
    }
  },

  // Hủy đăng ký lớp học
  huyDangKy: async (idDangKy) => {
    try {
      const response = await axiosConfig.delete(`/api/dang-ky-lop-hoc/huy-dang-ky/${idDangKy}`)
      console.log('API hủy đăng ký:', response.data);
      return response.data
    } catch (error) {
      console.error('Lỗi khi hủy đăng ký:', error)
      return { 
        code: 500,
        message: 'Lỗi khi hủy đăng ký',
        result: null
      }
    }
  },

  // Lấy danh sách đăng ký của sinh viên
  getDanhSachDangKy: async (maSV) => {
    try {
      const response = await axiosConfig.get(`/api/dang-ky-lop-hoc/sinh-vien/${maSV}`)
      console.log('API danh sách đăng ký:', response.data);
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đăng ký:', error)
      return { 
        code: 500,
        message: 'Lỗi khi lấy danh sách đăng ký',
        result: []
      }
    }
  }
}
