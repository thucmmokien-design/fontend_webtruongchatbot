import './Header.css'
import logo from '../../assets/img/Logo_HAU.png'
import {NavLink} from 'react-router-dom';

function HeaderPublic() {
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
        <div className="header-login-btn">
          <NavLink to='/account' className="btn-header-login">
            Đăng Nhập
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export default HeaderPublic
