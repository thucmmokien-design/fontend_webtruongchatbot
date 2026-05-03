import axiosInstance from './axiosConfig';

export const lichHocService = {
  // Lấy tất cả lịch học
  getAllLichHoc: async () => {
    try {
      const response = await axiosInstance.get('/api/lichhoc');
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy danh sách lịch học'
      };
    }
  },

  // Lấy lịch học theo mã sinh viên
  getLichHocByMaSV: async (maSV) => {
    try {
      const response = await axiosInstance.get(`/api/lichhoc/sinhvien/${maSV}`);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch học của sinh viên'
      };
    }
  },

  // Lấy lịch học theo mã sinh viên và thứ
  getLichHocByMaSVAndThu: async (maSV, thu) => {
    try {
      const response = await axiosInstance.get(`/api/lichhoc/sinhvien/${maSV}/thu/${thu}`);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch học theo thứ'
      };
    }
  },

  // Lấy lịch học theo thứ
  getLichHocByThu: async (thu) => {
    try {
      const response = await axiosInstance.get(`/api/lichhoc/thu/${thu}`);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch học theo thứ'
      };
    }
  },

  // Lấy lịch học theo lớp học phần
  getLichHocByLopHP: async (maLopHP) => {
    try {
      const response = await axiosInstance.get(`/api/lichhoc/lophocphan/${maLopHP}`);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch học theo lớp học phần'
      };
    }
  },

  // Lấy lịch học theo mã lịch học
  getLichHocById: async (maLichHoc) => {
    try {
      const response = await axiosInstance.get(`/api/lichhoc/${maLichHoc}`);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin lịch học'
      };
    }
  },

  // Lấy lịch học theo mã sinh viên và khoảng thời gian (tuần)
  getLichHocByMaSVAndWeek: async (maSV, ngayBatDau, ngayKetThuc) => {
    try {
      const response = await axiosInstance.get(`/api/lichhoc/sinhvien/${maSV}/tuan`, {
        params: {
          ngayBatDau,
          ngayKetThuc
        }
      });
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch học theo tuần'
      };
    }
  },

  // Lấy lịch học theo mã sinh viên, học kỳ, năm học và nhịp học
  getLichHocByMaSVAndHocKy: async (maSV, maHocKy, namHoc, nhipHoc) => {
    try {
      const params = {
        maHocKy,
        namHoc
      };
      
      // Chỉ thêm nhipHoc vào params nếu có giá trị
      if (nhipHoc) {
        params.nhipHoc = nhipHoc;
      }

      const response = await axiosInstance.get(`/api/lichhoc/sinhvien/${maSV}/hoc-ky`, {
        params
      });
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy lịch học theo học kỳ'
      };
    }
  }
};
