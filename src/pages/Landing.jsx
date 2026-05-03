import './Home.css'
import { NavLink } from 'react-router-dom'
import HeaderPublic from '../components/Header/HeaderPublic.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Menu from '../components/Menu/Menu.jsx'

const Landing = () => {
  const announcements = [
    { id: 1, title: 'Thông báo đánh giá điểm rèn luyện sinh viên hệ chính quy học kỳ I năm học 2025 - 2026', date: '15/01/2026', isNew: true },
    { id: 2, title: 'THÔNG BÁO CẬP NHẬT THỜI KHÓA BIỂU MỚI NHẤT KỲ 2 NĂM HỌC 2025 - 2026', date: '14/01/2026', isNew: true },
    { id: 3, title: 'Kế hoạch thực hiện hoạt động lấy ý kiến phản hồi của người học, cán bộ, giảng viên, nhân viên', date: '12/01/2026', isNew: false },
    { id: 4, title: 'Cảnh báo các hành vi lừa đảo sinh viên và phụ huynh', date: '10/01/2026', isNew: false },
    { id: 5, title: 'Thông báo xét học bổng "Nâng bước đến trường" của Ngân hàng BIDV năm 2025', date: '08/01/2026', isNew: false },
    { id: 6, title: 'Thông báo lịch thi Đợt 5 (buổi tối) HK I năm học 2025-2026', date: '05/01/2026', isNew: false }
  ];

  return(
    <div className="container-fluid">
      <HeaderPublic />
      <Menu />
      <main className="home-container">
        <div className="home-content">
          {/* Cột trái - Thông báo */}
          <div className="announcements-section">
            <div className="section-header">
              <h3>THÔNG BÁO</h3>
            </div>
            <div className="announcements-list">
              {announcements.map(item => (
                <div key={item.id} className="announcement-item">
                  {item.isNew && <span className="badge-new">MỚI</span>}
                  <a href="#">
                    <div className="announcement-title">{item.title}</div>
                    <div className="announcement-date">{item.date}</div>
                  </a>
                </div>
              ))}
              <div style={{textAlign: 'center', marginTop: '30px'}}>
                <NavLink to="/account" style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #4BA7D5 0%, #0093DD 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(75, 167, 213, 0.3)'
                }}>
                  Đăng Nhập để xem đầy đủ
                </NavLink>
              </div>
            </div>
          </div>

          {/* Cột phải - Lịch và Thời khóa biểu */}
          <div className="schedule-section">
            {/* Lịch */}
            <div className="calendar-box">
              <div className="section-header">
                <h4>Tháng 01 Năm 2026</h4>
              </div>
              <div className="calendar-grid">
                <div className="calendar-day-header">CN</div>
                <div className="calendar-day-header">T2</div>
                <div className="calendar-day-header">T3</div>
                <div className="calendar-day-header">T4</div>
                <div className="calendar-day-header">T5</div>
                <div className="calendar-day-header">T6</div>
                <div className="calendar-day-header">T7</div>
                
                {[...Array(31)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`calendar-day ${i + 1 === 24 ? 'today' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Lịch học */}
            <div className="schedule-box">
              <div className="section-header">
                <h4>Lịch Học</h4>
              </div>
              <div className="schedule-list">
                <div style={{
                  textAlign: 'center', 
                  padding: '40px 20px', 
                  color: '#718096',
                  fontSize: '16px'
                }}>
                  <p style={{margin: 0, fontWeight: '500'}}>
                    Vui lòng đăng nhập để xem lịch học của bạn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Landing
