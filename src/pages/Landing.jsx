import { useState, useEffect } from 'react'
import './Home.css'
import { NavLink } from 'react-router-dom'
import HeaderPublic from '../components/Header/HeaderPublic.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Menu from '../components/Menu/Menu.jsx'
import { thongBaoService } from '../services/thongBaoService'

const Landing = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  // Lấy thời gian hiện tại theo múi giờ Việt Nam (UTC+7)
  const getVietnamDate = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vietnamTime = new Date(utc + (3600000 * 7)); // UTC+7
    return vietnamTime;
  };

  // Load thông báo từ API
  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const result = await thongBaoService.getAllThongBao();
        
        if (result.code === 200 && result.result) {
          // Lọc chỉ lấy thông báo có phạm vi "Toàn trường"
          const filteredAnnouncements = result.result
            .filter(item => 
              item.phamVi === 'Toàn trường' || 
              item.phamVi === 'Toan Truong'
            )
            .slice(0, 6) // Chỉ lấy 6 thông báo mới nhất
            .map(item => ({
              id: item.maThongBao,
              title: item.tieuDe,
              content: item.noiDung,
              date: formatDate(item.ngayDang),
              link: item.link,
              tag: item.tag,
              isNew: isNewAnnouncement(item.ngayDang)
            }));
          
          setAnnouncements(filteredAnnouncements);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông báo:', error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    loadAnnouncements();
  }, []);

  // Kiểm tra thông báo mới (trong vòng 7 ngày)
  const isNewAnnouncement = (ngayDang) => {
    const announcementDate = new Date(ngayDang);
    const today = getVietnamDate();
    const diffTime = Math.abs(today - announcementDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Format ngày từ ISO string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
              {loadingAnnouncements ? (
                <div style={{textAlign: 'center', padding: '20px', color: '#718096'}}>
                  Đang tải thông báo...
                </div>
              ) : announcements.length > 0 ? (
                <>
                  {announcements.map(item => (
                    <div key={item.id} className="announcement-item">
                      {item.isNew && <span className="badge-new">MỚI</span>}
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          <div className="announcement-title">{item.title}</div>
                          <div className="announcement-date">{item.date}</div>
                        </a>
                      ) : (
                        <div>
                          <div className="announcement-title">{item.title}</div>
                          <div className="announcement-date">{item.date}</div>
                        </div>
                      )}
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
                </>
              ) : (
                <div style={{textAlign: 'center', padding: '20px', color: '#718096'}}>
                  Không có thông báo
                </div>
              )}
            </div>
          </div>

          {/* Cột phải - Lịch và Thời khóa biểu */}
          <div className="schedule-section">
            {/* Lịch */}
            <div className="calendar-box">
              <div className="section-header">
                <h4>Tháng {String(getVietnamDate().getMonth() + 1).padStart(2, '0')} Năm {getVietnamDate().getFullYear()}</h4>
              </div>
              <div className="calendar-grid">
                <div className="calendar-day-header">CN</div>
                <div className="calendar-day-header">T2</div>
                <div className="calendar-day-header">T3</div>
                <div className="calendar-day-header">T4</div>
                <div className="calendar-day-header">T5</div>
                <div className="calendar-day-header">T6</div>
                <div className="calendar-day-header">T7</div>
                
                {(() => {
                  const vietnamDate = getVietnamDate();
                  const year = vietnamDate.getFullYear();
                  const month = vietnamDate.getMonth();
                  const today = vietnamDate.getDate();
                  
                  // Lấy ngày đầu tiên của tháng
                  const firstDay = new Date(year, month, 1);
                  const firstDayOfWeek = firstDay.getDay(); // 0 = CN, 1 = T2, ...
                  
                  // Lấy số ngày trong tháng
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  
                  // Tạo mảng các ô lịch
                  const calendarDays = [];
                  
                  // Thêm các ô trống cho những ngày trước ngày 1
                  for (let i = 0; i < firstDayOfWeek; i++) {
                    calendarDays.push(
                      <div key={`empty-${i}`} className="calendar-day empty"></div>
                    );
                  }
                  
                  // Thêm các ngày trong tháng
                  for (let day = 1; day <= daysInMonth; day++) {
                    calendarDays.push(
                      <div 
                        key={day} 
                        className={`calendar-day ${day === today ? 'today' : ''}`}
                      >
                        {day}
                      </div>
                    );
                  }
                  
                  return calendarDays;
                })()}
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
