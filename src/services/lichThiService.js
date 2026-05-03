import axiosInstance from './axiosConfig';

export const lichThiService = {
  // Lấy lịch thi theo mã sinh viên
  getLichThiByMaSV: async (maSV) => {
    try {
      const response = await axiosInstance.get(`/api/lich-thi/${maSV}`);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch thi'
      };
    }
  },

  // Lấy lịch thi theo mã sinh viên, học kỳ và năm học
  getLichThiByMaSVAndHocKy: async (maSV, maHocKy, namHoc = null) => {
    try {
      const params = { maHocKy };
      if (namHoc) {
        params.namHoc = namHoc;
      }
      
      const response = await axiosInstance.get(`/api/lich-thi/${maSV}/hoc-ky`, { params });
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch thi'
      };
    }
  }
};
