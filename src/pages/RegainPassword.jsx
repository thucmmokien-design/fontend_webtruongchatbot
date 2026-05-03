import "./RegainPassword.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/img/Logo_Hau_tron.png";
import icon from "../assets/img/mail.png";

function RegainPassword() {
  return (
    <div className="contentfull">
      <div className="innerwarTop">
        <img src={logo} alt="HAU" />
        <span>TRƯỜNG ĐẠI HỌC KIẾN TRÚC HÀ NỘI</span>
      </div>
      <div className="innerwarBottom">
        <h3>LẤY LẠI MẬT KHẨU</h3>
        <div className="contentIcon">
          <img src={icon} alt="AnhHomThu" />
        </div>  
        <h6>Gmail</h6>
        <input type="text" className="email" placeholder="Nhập email để lấy lại mật khẩu"/>
        <button className="btn-login">Gửi Xác Nhận</button>
      </div>
    </div>
  );
}

export default RegainPassword;
