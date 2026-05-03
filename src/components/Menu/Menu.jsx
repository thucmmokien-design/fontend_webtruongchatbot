import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu() {
  return (
    <div className="menu">
      <ul className="listmenu">
        <li>
          <NavLink to="/dashboard/home" className="nav-link">
            <span>Trang Chủ</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/lich-hoc" className="nav-link">
            <span>Lịch học</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/profile" className="nav-link">
            <span>Thông tin cá nhân</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/ket-qua" className="nav-link">
            <span>Kết quả học tập</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/dang-ky" className="nav-link">
            <span>Đăng ký môn học</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/tai-chinh" className="nav-link">
            <span>Tài chính</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/bieu-mau" className="nav-link">
            <span>Biểu mẫu online</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
