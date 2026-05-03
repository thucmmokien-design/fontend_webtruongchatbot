import axiosInstance from './axiosConfig';

export const studentService = {
  // Lấy thông tin sinh viên cơ bản
  getMyInfo: async () => {
    try {
      const response = await axiosInstance.get('/api/sinhvien/me');
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin sinh viên'
      };
    }
  },

  // Cập nhật thông tin sinh viên cơ bản
  updateMyInfo: async (data) => {
    try {
      const response = await axiosInstance.put('/api/sinhvien/me', data);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật thông tin'
      };
    }
  },

  // Lấy thông tin cá nhân chi tiết
  getThongTinCaNhan: async () => {
    try {
      const response = await axiosInstance.get('/api/sinhvien/me/thongtincanhan');
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin cá nhân'
      };
    }
  },

  // Cập nhật thông tin cá nhân chi tiết
  updateThongTinCaNhan: async (data) => {
    try {
      const response = await axiosInstance.put('/api/sinhvien/me/thongtincanhan', data);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật thông tin cá nhân'
      };
    }
  },

  // Lấy thông tin người thân
  getNguoiThan: async () => {
    try {
      const response = await axiosInstance.get('/api/sinhvien/me/nguoithan');
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin người thân'
      };
    }
  },

  // Cập nhật thông tin người thân
  updateNguoiThan: async (data) => {
    try {
      const response = await axiosInstance.put('/api/sinhvien/me/nguoithan', data);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật thông tin người thân'
      };
    }
  },

  // Lấy thông tin người giám hộ
  getNguoiGiamHo: async () => {
    try {
      const response = await axiosInstance.get('/api/sinhvien/me/nguoigiamho');
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin người giám hộ'
      };
    }
  },

  // Cập nhật thông tin người giám hộ
  updateNguoiGiamHo: async (data) => {
    try {
      const response = await axiosInstance.put('/api/sinhvien/me/nguoigiamho', data);
      return {
        success: true,
        data: response.data.result
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật thông tin người giám hộ'
      };
    }
  }
};
