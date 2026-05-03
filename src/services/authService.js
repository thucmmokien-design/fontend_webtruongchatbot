import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const authService = {
  // Đăng nhập
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      
      // Lấy token từ response.data.result
      const token = response.data.result.token;
      const user = response.data.result.username || username;
      
      // Lưu vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('studentId', user);
      
      return { 
        success: true, 
        token, 
        username: user 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  },

  // Đổi mật khẩu
  changePassword: async (oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/auth/change-password`,
        {
          oldPassword,
          newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return {
        success: true,
        message: response.data.result || 'Đổi mật khẩu thành công'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đổi mật khẩu thất bại'
      };
    }
  },

  // Kiểm tra token
  introspect: async (token) => {
    const response = await axios.post(`${API_URL}/auth/introspect`, {
      token
    });
    return response.data;
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentInfo');
  },

  // Lấy token hiện tại
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  // Lưu thông tin sinh viên
  saveStudentInfo: (info) => {
    localStorage.setItem('studentInfo', JSON.stringify(info));
  },

  // Lấy thông tin sinh viên
  getStudentInfo: () => {
    const info = localStorage.getItem('studentInfo');
    return info ? JSON.parse(info) : null;
  }
};
