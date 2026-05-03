import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './DoiMatKhau.css';
import logo from '../assets/img/Logo_Hau_tron.png';

const DoiMatKhau = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu mới không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (oldPassword === newPassword) {
      setMessage('Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }

    // Call API đổi mật khẩu
    try {
      setMessage('Đang xử lý...');
      const response = await authService.changePassword(oldPassword, newPassword);
      
      if (response.success) {
        setMessage('Đổi mật khẩu thành công! Đang chuyển hướng...');
        
        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Chuyển về trang profile sau 2 giây
        setTimeout(() => {
          navigate('/dashboard/profile');
        }, 2000);
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage('Lỗi kết nối. Vui lòng thử lại!');
      console.error('Change password error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/profile');
  };

  return (
    <div className="doi-mat-khau-container">
      <div className="doi-mat-khau-header">
        <img src={logo} alt="HAU Logo" className="logo-dmk" />
        <h1>TRƯỜNG ĐẠI HỌC KIẾN TRÚC HÀ NỘI</h1>
      </div>

      <div className="doi-mat-khau-box">
        <h2>ĐỔI MẬT KHẨU</h2>

        <form onSubmit={handleChangePassword}>
          <div className="form-group-dmk">
            <label>Mật khẩu cũ:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu cũ"
              required
            />
          </div>

          <div className="form-group-dmk">
            <label>Nhập mật khẩu mới:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>

          <div className="form-group-dmk">
            <label>Nhập lại mật khẩu:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
          </div>

          {message && (
            <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}

          <div className="button-group-dmk">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              HỦY THAY ĐỔI
            </button>
            <button type="submit" className="btn-submit">
              LƯU MẬT KHẨU MỚI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoiMatKhau;
