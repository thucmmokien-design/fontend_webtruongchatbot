import { useState, useEffect } from 'react'
import './DangKyMonHoc.css'

const DangKyMonHoc = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Mock data - Danh sách các học phần được đăng ký
  const [registeredCourses, setRegisteredCourses] = useState([
    {
      stt: 1,
      maHP: 'TH5220',
      tenHP: 'Đa phương tiện',
      soTC: 3,
      tenLop: '23CN3',
      thoiGian: '10/10/2026-03/01/2027',
      tiet: '2-6',
      thu: 3,
      soLuong: 55,
      conTrong: 15,
      giangVien: 'Nguyễn Mạnh Hùng'
    },
    {
      stt: 2,
      maHP: 'TH5223',
      tenHP: 'An ninh mạng',
      soTC: 3,
      tenLop: '23CN3',
      thoiGian: '10/10/2026-03/01/2027',
      tiet: '7-9',
      thu: 3,
      soLuong: 54,
      conTrong: 36,
      giangVien: 'Bùi Hải Phong'
    }
  ]);

  // Mock data - Danh sách các học phần chờ phê duyệt (có thể hủy)
  const [pendingCourses, setPendingCourses] = useState([
    {
      stt: 1,
      maHP: 'TH5220',
      tenHP: 'Lập trình mạng',
      soTC: 3,
      tenLop: '23CN3',
      thoiGian: '10/10/2026-03/01/2027',
      tiet: '4-6',
      thu: 2,
      giangVien: 'Nguyễn Hồng Thanh'
    },
    {
      stt: 2,
      maHP: 'TH5223',
      tenHP: 'Đồ họa và hiện thực ảo',
      soTC: 3,
      tenLop: '23CN3',
      thoiGian: '10/10/2026-03/01/2027',
      tiet: '10-12',
      thu: 4,
      giangVien: 'Nguyễn Quốc Huy'
    }
  ]);

  const handleSelectCourse = (course, isRegistered) => {
    const courseId = `${course.maHP}-${course.tenLop}`;
    
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const isCourseSelected = (course) => {
    const courseId = `${course.maHP}-${course.tenLop}`;
    return selectedCourses.includes(courseId);
  };

  const handleCancelRegistration = () => {
    if (selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất một học phần để hủy');
      return;
    }
    
    const confirmCancel = window.confirm(`Bạn có chắc chắn muốn hủy ${selectedCourses.length} học phần đã chọn?`);
    if (confirmCancel) {
      // Xử lý hủy đăng ký
      alert('Đã hủy đăng ký các học phần đã chọn');
      setSelectedCourses([]);
    }
  };

  const handleConfirmRegistration = () => {
    if (selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất một học phần để xác nhận');
      return;
    }
    
    const confirmRegister = window.confirm(`Bạn có chắc chắn muốn xác nhận đăng ký ${selectedCourses.length} học phần đã chọn?`);
    if (confirmRegister) {
      // Xử lý xác nhận đăng ký
      alert('Đã xác nhận đăng ký các học phần đã chọn');
      setSelectedCourses([]);
    }
  };

  const handleCancelPending = () => {
    if (selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất một học phần để hủy');
      return;
    }
    
    const confirmCancel = window.confirm(`Bạn có chắc chắn muốn hủy ${selectedCourses.length} học phần đang chờ phê duyệt?`);
    if (confirmCancel) {
      // Xử lý hủy học phần chờ phê duyệt
      alert('Đã hủy các học phần chờ phê duyệt đã chọn');
      setSelectedCourses([]);
    }
  };

  const handleConfirmPending = () => {
    if (selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất một học phần để xác nhận');
      return;
    }
    
    const confirmRegister = window.confirm(`Bạn có chắc chắn muốn xác nhận đăng ký ${selectedCourses.length} học phần đã chọn?`);
    if (confirmRegister) {
      // Xử lý xác nhận đăng ký học phần chờ phê duyệt
      alert('Đã xác nhận đăng ký các học phần đã chọn');
      setSelectedCourses([]);
    }
  };

  return (
    <div className="dangky-container">
      <div className="dangky-content">
        
        {/* Danh sách các học phần được đăng ký */}
        <div className="section-header">
          <h3 className="section-title">Danh sách các học phần được đăng ký:</h3>
          <p className="section-note">
            Lưu ý: Sinh viên thực hiện chọn môn và ấy nút xác nhận để đăng ký môn học và có thể chọn sách chọn!
          </p>
        </div>

        <div className="table-wrapper">
          <table className="register-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên học phần</th>
                <th>Số TC</th>
                <th>Tên lớp</th>
                <th>Thời gian</th>
                <th>Tiết</th>
                <th>Thứ</th>
                <th>Số lượng</th>
                <th>Còn trống</th>
                <th>Giảng viên</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {registeredCourses.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">Không có học phần nào được đăng ký</td>
                </tr>
              ) : (
                registeredCourses.map((course) => (
                  <tr key={course.stt}>
                    <td className="text-center">{course.stt}</td>
                    <td className="text-left">{course.maHP} - {course.tenHP}</td>
                    <td className="text-center">{course.soTC}</td>
                    <td className="text-center">{course.tenLop}</td>
                    <td className="text-center">{course.thoiGian}</td>
                    <td className="text-center">{course.tiet}</td>
                    <td className="text-center">{course.thu}</td>
                    <td className="text-center">{course.soLuong}</td>
                    <td className="text-center">{course.conTrong}</td>
                    <td className="text-left">{course.giangVien}</td>
                    <td className="text-center">
                      <button 
                        className={`btn-select ${isCourseSelected(course) ? 'selected' : ''}`}
                        onClick={() => handleSelectCourse(course, true)}
                      >
                        Chọn môn
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="action-buttons">
          <button className="btn-action btn-cancel" onClick={handleCancelRegistration}>
            HỦY THAO TÁC
          </button>
          <button className="btn-action btn-confirm" onClick={handleConfirmRegistration}>
            XÁC NHẬN ĐĂNG KÝ
          </button>
        </div>

        {/* Danh sách các học phần chờ phê duyệt */}
        <div className="section-header">
          <h3 className="section-title">Danh sách các học phần chờ phê duyệt (có thể hủy):</h3>
        </div>

        <div className="table-wrapper">
          <table className="register-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên học phần</th>
                <th>Số TC</th>
                <th>Tên lớp</th>
                <th>Thời gian</th>
                <th>Tiết</th>
                <th>Thứ</th>
                <th>Giảng viên</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {pendingCourses.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">Không có học phần nào chờ phê duyệt</td>
                </tr>
              ) : (
                pendingCourses.map((course) => (
                  <tr key={course.stt}>
                    <td className="text-center">{course.stt}</td>
                    <td className="text-left">{course.maHP} - {course.tenHP}</td>
                    <td className="text-center">{course.soTC}</td>
                    <td className="text-center">{course.tenLop}</td>
                    <td className="text-center">{course.thoiGian}</td>
                    <td className="text-center">{course.tiet}</td>
                    <td className="text-center">{course.thu}</td>
                    <td className="text-left">{course.giangVien}</td>
                    <td className="text-center">
                      <button 
                        className={`btn-select ${isCourseSelected(course) ? 'selected' : ''}`}
                        onClick={() => handleSelectCourse(course, false)}
                      >
                        Chọn môn
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="action-buttons">
          <button className="btn-action btn-cancel" onClick={handleCancelPending}>
            HỦY THAO TÁC
          </button>
          <button className="btn-action btn-confirm" onClick={handleConfirmPending}>
            HỦY ĐĂNG KÝ
          </button>
        </div>
      </div>
    </div>
  )
}

export default DangKyMonHoc
