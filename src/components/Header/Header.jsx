import './Header.css'
import logo from '../../assets/img/Logo_HAU.png'
import user from '../../assets/icon/user.svg'
import {useNavigate} from 'react-router-dom';
import { authService } from '../../services/authService';
import { studentService } from '../../services/studentService';
import { useState, useEffect } from 'react';

function Header() {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(null);
  
  useEffect(() => {
    // Lấy thông tin từ localStorage trước
    const cachedInfo = authService.getStudentInfo();
    console.log('Cached student info:', cachedInfo);
    if(cachedInfo){
      setStudentInfo(cachedInfo);
    }
    
    // Sau đó fetch thông tin mới từ API
    const fetchStudentInfo = async () => {
      console.log('Fetching student info from API...');
      const response = await studentService.getMyInfo();
      console.log('API response:', response);
      
      if(response.success){
        console.log('Student data:', response.data);
        setStudentInfo(response.data);
        authService.saveStudentInfo(response.data);
      } else {
        console.error('Failed to fetch student info:', response.message);
      }
    };
    
    fetchStudentInfo();
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };
  
  console.log('Current studentInfo state:', studentInfo);
  
  return (
    <header className='header'>
      <div className="innerLeft">
        <div className="logo"><img src={logo} alt="LogoDKKienTruc" /></div>
        <div className="typeSchool">
            <p>ĐẠI HỌC KIẾN TRÚC HÀ NỘI <br/>
            HANOI ARCHITECTURAL UNIVERSITY</p>
        </div>
      </div>
      <div className="innerRight">
        <div className="statusnologin">
            <div className="studentName">{studentInfo?.hoTen || 'Sinh viên'}</div>
            <div className="studentClass">{studentInfo?.tenLop || 'Lớp'}</div>
        </div>
        <div className="avatarStudent">
              <img src={user} alt="avatarnoupload" />
              <p><a href="#" onClick={handleLogout}>Đăng Xuất</a></p>
        </div>
      </div>
    </header>
  )
}

export default Header
