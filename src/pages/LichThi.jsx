import { useState, useEffect } from 'react'
import './LichThi.css'
import { studentService } from '../services/studentService'
import { lichThiService } from '../services/lichThiService'

const LichThi = () => {
  const [examSchedule, setExamSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hocKy, setHocKy] = useState('');
  const [namHoc, setNamHoc] = useState('');
  const [maSV, setMaSV] = useState('');

  // Load mã sinh viên khi component mount
  useEffect(() => {
    const loadStudentInfo = async () => {
      try {
        const studentInfo = await studentService.getMyInfo();
        if (studentInfo.success && studentInfo.data) {
          setMaSV(studentInfo.data.maSV);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin sinh viên:', error);
      }
    };

    loadStudentInfo();
  }, []);

  // Tự động load lịch thi khi chọn đủ học kỳ và năm học
  useEffect(() => {
    if (maSV && hocKy && namHoc) {
      loadExamSchedule();
    }
  }, [maSV, hocKy, namHoc]);

  const loadExamSchedule = async () => {
    setLoading(true);
    try {
      // Tạo mã học kỳ theo format: năm + HK + số (ví dụ: 24HK2)
      const year = namHoc.split('-')[0].slice(-2); // Lấy 2 số cuối của năm đầu
      const maHocKy = `${year}HK${hocKy}`;
      
      const result = await lichThiService.getLichThiByMaSVAndHocKy(maSV, maHocKy, namHoc);
      
      if (result.success && result.data) {
        // Map data to include stt
        const mappedData = result.data.map((item, index) => ({
          ...item,
          stt: index + 1
        }));
        setExamSchedule(mappedData);
      } else {
        setExamSchedule([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch thi:', error);
      setExamSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="lichthi-container">
      <div className="lichthi-content">
        
        <div className="lichthi-filters">
          <div className="filter-left">
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
          </div>

          <div className="filter-actions">
            <button className="btn-view-exam" onClick={() => window.location.href = '/dashboard/lich-hoc'}>XEM LỊCH HỌC</button>
            <button className="btn-print" onClick={handlePrint}>IN LỊCH THI</button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Đang tải lịch thi...</div>
        ) : !hocKy || !namHoc ? (
          <div className="no-data">Vui lòng chọn học kỳ và năm học để xem lịch thi</div>
        ) : examSchedule.length === 0 ? (
          <div className="no-data">Không có lịch thi</div>
        ) : (
          <div className="exam-table-wrapper">
            <table className="exam-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã HP</th>
                  <th>Tên HP</th>
                  <th>Số TC</th>
                  <th>Ngày thi</th>
                  <th>Giờ thi</th>
                  <th>SBD</th>
                  <th>Phòng thi</th>
                  <th>Hình thức</th>
                </tr>
              </thead>
              <tbody>
                {examSchedule.map((exam, index) => (
                  <tr key={index}>
                    <td className="text-center">{exam.stt || index + 1}</td>
                    <td>{exam.maLopHP || ''}</td>
                    <td className="text-left">{exam.tenMonHoc || ''}</td>
                    <td className="text-center">{exam.soTinChi || ''}</td>
                    <td className="text-center">{formatDate(exam.ngayThi)}</td>
                    <td className="text-center">{exam.gioThi || ''}</td>
                    <td className="text-center">{exam.soBuoiDayDu || ''}</td>
                    <td className="text-center">{exam.phongThi || ''}</td>
                    <td className="text-center">{exam.hinhThuc || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default LichThi
