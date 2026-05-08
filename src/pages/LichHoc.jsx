import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './LichHoc.css'
import { studentService } from '../services/studentService'
import { lichHocService } from '../services/lichHocService'

const LichHoc = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [hocKy, setHocKy] = useState('2'); // Mặc định Học kỳ 2
  const [namHoc, setNamHoc] = useState('2025-2026'); // Mặc định năm 2025-2026
  const [nhipHoc, setNhipHoc] = useState('');
  const [totalWeeks, setTotalWeeks] = useState(1);
  const [semesterStartDate, setSemesterStartDate] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  // Tính tổng số tuần dựa trên dữ liệu lịch học
  const calculateTotalWeeks = (scheduleData) => {
    if (!scheduleData || scheduleData.length === 0) return 1;

    // Tìm ngày bắt đầu sớm nhất và ngày kết thúc muộn nhất
    let minDate = new Date(scheduleData[0].ngayBatDau);
    let maxDate = new Date(scheduleData[0].ngayKetThuc);

    scheduleData.forEach(item => {
      const startDate = new Date(item.ngayBatDau);
      const endDate = new Date(item.ngayKetThuc);
      
      if (startDate < minDate) minDate = startDate;
      if (endDate > maxDate) maxDate = endDate;
    });

    setSemesterStartDate(minDate);

    // Tính số tuần = (số ngày / 7) + 1
    const diffTime = Math.abs(maxDate - minDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(diffDays / 7);
    
    return weeks;
  };

  // Tính số tuần hiện tại dựa trên ngày bắt đầu học kỳ
  const getCurrentWeekNumber = () => {
    if (!semesterStartDate) return 1;

    const { monday } = getWeekRange(currentWeek);
    const diffTime = Math.abs(monday - semesterStartDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7) + 1;
    
    return Math.max(1, Math.min(weekNumber, totalWeeks));
  };

  // Lấy ngày đầu tuần và cuối tuần
  const getWeekRange = (weekOffset = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (weekOffset * 7));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return { monday, sunday };
  };

  const formatFullDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Tạo danh sách năm học dựa trên năm hiện tại
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Tạo danh sách 5 năm (2 năm trước, năm hiện tại, 2 năm sau)
    for (let i = -2; i <= 2; i++) {
      const year = currentYear + i;
      years.push(`${year}-${year + 1}`);
    }
    
    setAvailableYears(years);
  }, []);

  // Load lịch học chỉ khi đã chọn đủ học kỳ và năm học
  useEffect(() => {
    // Chỉ load khi đã chọn cả học kỳ và năm học
    if (!hocKy || !namHoc) {
      setSchedule([]);
      return;
    }

    const loadSchedule = async () => {
      setLoading(true);
      try {
        const studentInfo = await studentService.getMyInfo();
        
        if (studentInfo.success && studentInfo.data) {
          const maSV = studentInfo.data.maSV;
          const maHocKy = `${namHoc.split('-')[0].slice(-2)}HK${hocKy}`;
          
          const result = await lichHocService.getLichHocByMaSVAndHocKy(maSV, maHocKy, namHoc, nhipHoc);
          
          if (result.success && result.data) {
            setSchedule(result.data);
            
            // Tính tổng số tuần
            if (result.data.length > 0) {
              const weeks = calculateTotalWeeks(result.data);
              setTotalWeeks(weeks);
            }
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
  }, [hocKy, namHoc, nhipHoc]); // Reload khi các filter thay đổi

  // Lọc lịch học theo tuần và thứ
  const getScheduleByDayAndWeek = (thu) => {
    return schedule.filter(item => item.thu === thu);
  };

  // Phân loại ca học
  const getCaHoc = (tietBatDau) => {
    if (tietBatDau >= 1 && tietBatDau <= 6) return 'sang';
    if (tietBatDau >= 7 && tietBatDau <= 12) return 'chieu';
    return 'toi';
  };

  // Format giờ học
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
    <div className="lichhoc-container">
      <div className="lichhoc-content">
        
        <div className="lichhoc-filters">
          <div className="filter-row">
            <label>Chọn học kỳ:</label>
            <select value={hocKy} onChange={(e) => setHocKy(e.target.value)}>
              <option value="">-- chọn học kỳ --</option>
              <option value="1">Học kỳ I</option>
              <option value="2">Học kỳ II</option>
              <option value="3">Học kỳ Hè</option>
            </select>
          </div>

          <div className="filter-row">
            <label>Chọn năm học:</label>
            <select value={namHoc} onChange={(e) => setNamHoc(e.target.value)}>
              <option value="">-- chọn năm học --</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>

          <div className="filter-row">
            <label>Chọn nhịp học:</label>
            <select value={nhipHoc} onChange={(e) => setNhipHoc(e.target.value)}>
              <option value="">-- Tất cả --</option>
              <option value="1">Nhịp 1</option>
              <option value="2">Nhịp 2</option>
            </select>
          </div>

          <div className="filter-actions">
            <button className="btn-view" onClick={() => navigate('/dashboard/lich-thi')}>XEM LỊCH THI</button>
            <button className="btn-print">IN TKB</button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Đang tải lịch học...</div>
        ) : (
          <div className="schedule-table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Ca học</th>
                  <th>Thứ 2</th>
                  <th>Thứ 3</th>
                  <th>Thứ 4</th>
                  <th>Thứ 5</th>
                  <th>Thứ 6</th>
                  <th>Thứ 7</th>
                  <th>Chủ nhật</th>
                </tr>
              </thead>
              <tbody>
                {/* Ca sáng */}
                <tr>
                  <td className="ca-hoc-label">Ca sáng</td>
                  {[2, 3, 4, 5, 6, 7, 8].map(thu => (
                    <td key={`sang-${thu}`} className="schedule-cell">
                      {getScheduleByDayAndWeek(thu)
                        .filter(item => getCaHoc(item.tietBatDau) === 'sang')
                        .map((item, idx) => (
                          <div key={idx} className="schedule-card">
                            <div className="card-title">{item.tenMonHoc}</div>
                            <div className="card-info">Tiết: {item.tietBatDau}-{item.tietKetThuc}</div>
                            <div className="card-info">TG: {formatTimeFromTiet(item.tietBatDau, item.tietKetThuc)}</div>
                            <div className="card-info">Từ: {formatFullDate(new Date(item.ngayBatDau))}</div>
                            <div className="card-info">Đến: {formatFullDate(new Date(item.ngayKetThuc))}</div>
                            {item.phong !== 'Online' && (
                              <div className="card-info">Phòng: {item.phong}</div>
                            )}
                            {item.phong === 'Online' && <div className="card-info">Học online</div>}
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>

                {/* Ca chiều */}
                <tr>
                  <td className="ca-hoc-label">Ca chiều</td>
                  {[2, 3, 4, 5, 6, 7, 8].map(thu => (
                    <td key={`chieu-${thu}`} className="schedule-cell">
                      {getScheduleByDayAndWeek(thu)
                        .filter(item => getCaHoc(item.tietBatDau) === 'chieu')
                        .map((item, idx) => (
                          <div key={idx} className="schedule-card">
                            <div className="card-title">{item.tenMonHoc}</div>
                            <div className="card-info">Tiết: {item.tietBatDau}-{item.tietKetThuc}</div>
                            <div className="card-info">TG: {formatTimeFromTiet(item.tietBatDau, item.tietKetThuc)}</div>
                            <div className="card-info">Từ: {formatFullDate(new Date(item.ngayBatDau))}</div>
                            <div className="card-info">Đến: {formatFullDate(new Date(item.ngayKetThuc))}</div>
                            {item.phong !== 'Online' && (
                              <div className="card-info">Phòng: {item.phong}</div>
                            )}
                            {item.phong === 'Online' && <div className="card-info">Học online</div>}
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>

                {/* Ca tối */}
                <tr>
                  <td className="ca-hoc-label">Ca tối</td>
                  {[2, 3, 4, 5, 6, 7, 8].map(thu => (
                    <td key={`toi-${thu}`} className="schedule-cell">
                      {getScheduleByDayAndWeek(thu)
                        .filter(item => getCaHoc(item.tietBatDau) === 'toi')
                        .map((item, idx) => (
                          <div key={idx} className="schedule-card">
                            <div className="card-title">{item.tenMonHoc}</div>
                            <div className="card-info">Tiết: {item.tietBatDau}-{item.tietKetThuc}</div>
                            <div className="card-info">TG: {formatTimeFromTiet(item.tietBatDau, item.tietKetThuc)}</div>
                            <div className="card-info">Từ: {formatFullDate(new Date(item.ngayBatDau))}</div>
                            <div className="card-info">Đến: {formatFullDate(new Date(item.ngayKetThuc))}</div>
                            {item.phong !== 'Online' && (
                              <div className="card-info">Phòng: {item.phong}</div>
                            )}
                            {item.phong === 'Online' && <div className="card-info">Học online</div>}
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}


      </div>
    </div>
  )
}

export default LichHoc
