import { useState, useEffect } from 'react'
import './Home.css'
import { studentService } from '../services/studentService'
import { lichHocService } from '../services/lichHocService'
import { thongBaoService } from '../services/thongBaoService'

const Home = () => {
  const [schedule, setSchedule] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  
  // Lấy thời gian hiện tại theo múi giờ Việt Nam (UTC+7)
  const getVietnamDate = () => {
    // Tạo date object với múi giờ Việt Nam
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vietnamTime = new Date(utc + (3600000 * 7)); // UTC+7
    return vietnamTime;
  };
  
  const [currentDate, setCurrentDate] = useState(getVietnamDate());

  // Load thông báo
  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const result = await thongBaoService.getAllThongBao();
        
        if (result.code === 200 && result.result) {
          // Lọc chỉ lấy thông báo có phạm vi "Toàn trường" hoặc "Toan Truong"
          const filteredAnnouncements = result.result
            .filter(item => 
              item.phamVi === 'Toàn trường' || 
              item.phamVi === 'Toan Truong'
            )
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
    const today = new Date();
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

  // Lấy thứ hiện tại (Chủ nhật = 0, Thứ 2 = 1, ..., Thứ 7 = 6)
  const getCurrentDayOfWeek = () => {
    const vietnamDate = getVietnamDate();
    const day = vietnamDate.getDay();
    return day === 0 ? 8 : day + 1; // Backend: Thứ 2 = 2, ..., Chủ nhật = 8
  };

  // Format ngày hiện tại
  const formatCurrentDate = () => {
    const vietnamDate = getVietnamDate();
    const day = String(vietnamDate.getDate()).padStart(2, '0');
    const month = String(vietnamDate.getMonth() + 1).padStart(2, '0');
    const year = vietnamDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Lấy tên thứ
  const getDayName = () => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const vietnamDate = getVietnamDate();
    const dayIndex = vietnamDate.getDay(); // 0 = Chủ Nhật, 1 = Thứ Hai, ..., 6 = Thứ Bảy
    
    // Debug: Log ra console để kiểm tra
    console.log('Vietnam Date:', vietnamDate);
    console.log('Day Index:', dayIndex);
    console.log('Day Name:', days[dayIndex]);
    
    return days[dayIndex];
  };

  // Load lịch học theo thời gian thực
  useEffect(() => {
    const loadSchedule = async () => {
      setLoading(true);
      try {
        // Lấy thông tin sinh viên
        const studentInfo = await studentService.getMyInfo();
        
        if (studentInfo.success && studentInfo.data) {
          const maSV = studentInfo.data.maSV;
          const thu = getCurrentDayOfWeek();
          
          // Lấy lịch học theo mã sinh viên và thứ hiện tại
          const result = await lichHocService.getLichHocByMaSVAndThu(maSV, thu);
          
          if (result.success && result.data) {
            // Sắp xếp theo tiết học
            const sortedSchedule = result.data.sort((a, b) => {
              return (a.tietBatDau || 0) - (b.tietBatDau || 0);
            });
            setSchedule(sortedSchedule);
          } else {
            setSchedule([]);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải lịch học:', error);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [currentDate]);

  // Format giờ học từ tiết học
  const formatTimeFromTiet = (tietBatDau, tietKetThuc) => {
    const tietToTime = {
      1: '07:00', 2: '07:50', 3: '08:50', 4: '09:40',
      5: '10:40', 6: '11:30', 7: '13:00', 8: '13:50',
      9: '14:50', 10: '15:40', 11: '16:40', 12: '17:30',
      13: '18:15', 14: '19:05', 15: '20:00', 16: '20:50'
    };
    
    const startTime = tietToTime[tietBatDau] || '00:00';
    const endTime = tietToTime[tietKetThuc + 1] || tietToTime[tietKetThuc] || '00:00';
    
    return `${startTime} - ${endTime}`;
  };

  return (
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
              announcements.map(item => (
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
              ))
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
              <h4>Lịch Học {getDayName()} - {formatCurrentDate()}</h4>
            </div>
            <div className="schedule-list">
              {loading ? (
                <div style={{textAlign: 'center', padding: '20px', color: '#718096'}}>
                  Đang tải lịch học...
                </div>
              ) : schedule.length > 0 ? (
                schedule.map((item, index) => (
                  <div key={index} className="schedule-item">
                    <div className="schedule-time">
                      {formatTimeFromTiet(item.tietBatDau, item.tietKetThuc)}
                    </div>
                    <div className="schedule-details">
                      <div className="schedule-subject">{item.tenMonHoc || 'Môn học'}</div>
                      <div className="schedule-info">
                        Phòng: {item.phong || 'Chưa xác định'} | GV: {item.tenGiangVien || 'Chưa có thông tin'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '20px', color: '#718096'}}>
                  Không có lịch học hôm nay
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
