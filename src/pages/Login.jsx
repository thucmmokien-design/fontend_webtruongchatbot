import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/img/Logo_Hau_tron.png";
import {NavLink, useNavigate} from 'react-router-dom';
import { useState } from "react";
import { authService } from '../services/authService';
import { studentService } from '../services/studentService';

function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const navigate = useNavigate();
  
  const handleLogin = async(e) => {
    e.preventDefault();
    
    console.log('Attempting login...');
    const response = await authService.login(studentId, password);
    console.log('Login response:', response);
    
    if(response.success){
      setMessage("Đăng nhập thành công!");
      setMessageType("success");
      
      // Lấy thông tin sinh viên
      console.log('Fetching student info after login...');
      const studentInfo = await studentService.getMyInfo();
      console.log('Student info response:', studentInfo);
      
      if(studentInfo.success){
        console.log('Saving student info:', studentInfo.data);
        authService.saveStudentInfo(studentInfo.data);
      } else {
        console.error('Failed to get student info:', studentInfo.message);
      }
      
      setTimeout(() => {
        navigate('/dashboard/home');
      }, 1000);
    } else {
      setMessage(response.message);
      setMessageType("error");
    }
  }
  return (
  <div className="contentfull">
    <div className="innerwarTop">
      <img src={logo} alt="HAU" />
      <span>TRƯỜNG ĐẠI HỌC KIẾN TRÚC HÀ NỘI</span>
    </div>
    <form className="innerwarBottom">
      <h3>ĐĂNG NHẬP</h3>
      <div className="form-group">
        <label htmlFor="studentId">Mã sinh viên</label>
        <input
          type="text"
          id="studentId"
          name="studentId"
          className="manhanvien"
          placeholder="Nhập mã sinh viên"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Mật khẩu</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="contenNotPassword">
        <NavLink to="/regainPassword">Quên mật khẩu?</NavLink>
      </div>
      <button type="submit" 
              className="btn-login"
              onClick={handleLogin}>
        Đăng Nhập
      </button>
      {message && (
        <p className={`message ${messageType}`}>{message}</p>
      )}
    </form>
  </div>
);
}

export default Login;
