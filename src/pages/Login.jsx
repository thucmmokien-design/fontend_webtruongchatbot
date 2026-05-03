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
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = async(e) => {
    e.preventDefault();
    
    console.log('Attempting login...');
    const response = await authService.login(studentId, password);
    console.log('Login response:', response);
    
    if(response.success){
      setMessage("Đăng nhập thành công");
      
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
        <input
          type="password"
          id="password"
          name="password"
          className="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
          required
        />
      </div>
      <div className="contenNotPassword">
        <NavLink to="/regainPassword">Quên mật khẩu?</NavLink>
      </div>
      <button type="submit" 
              className="btn-login"
              onClick={handleLogin}>
        Đăng Nhập
      </button>
      <p style={{ color: "red" }}>{message}</p>
    </form>
  </div>
);
}

export default Login;
