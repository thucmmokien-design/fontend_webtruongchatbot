import { useState, useEffect } from 'react'
import './DangKyMonHoc.css'
import { studentService } from '../services/studentService'
import { dangKyMonHocService } from '../services/dangKyMonHocService'

const DangKyMonHoc = () => {
  const [loading, setLoading] = useState(false);
  const [maSV, setMaSV] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);

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

  // Load danh sách lớp học và danh sách đăng ký khi có maSV
  useEffect(() => {
    if (maSV) {
      loadDanhSachLopHoc();
      loadDanhSachDangKy();
    }
  }, [maSV]);

  // Load danh sách lớp học có thể đăng ký
  const loadDanhSachLopHoc = async () => {
    setLoading(true);
    try {
      const result = await dangKyMonHocService.getDanhSachLopHoc();
      console.log('Danh sách lớp học:', result);
      
      const code = result.code || result.Code;
      if (code === 200 && result.result) {
        setAvailableCourses(result.result);
      } else {
        setAvailableCourses([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách lớp học:', error);
      setAvailableCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách đăng ký của sinh viên
  const loadDanhSachDangKy = async () => {
    try {
      const result = await dangKyMonHocService.getDanhSachDangKy(maSV);
      console.log('Danh sách đăng ký:', result);
      
      const code = result.code || result.Code;
      if (code === 200 && result.result) {
        setPendingCourses(result.result);
      } else {
        setPendingCourses([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đăng ký:', error);
      setPendingCourses([]);
    }
  };

  // Kiểm tra xem môn học có trùng lịch với các môn đã chọn không
  const checkScheduleConflict = (course) => {
    // Lấy danh sách các môn đã chọn
    const selectedCoursesData = availableCourses.filter(c => selectedCourses.includes(c.maMo));
    
    // Kiểm tra trùng thứ và trùng tiết
    for (const selected of selectedCoursesData) {
      // Nếu cùng thứ
      if (selected.thu === course.thu) {
        // Kiểm tra trùng tiết
        const isOverlap = !(
          course.tietKetThuc < selected.tietBatDau || 
          course.tietBatDau > selected.tietKetThuc
        );
        
        if (isOverlap) {
          return true; // Có trùng lịch
        }
      }
    }
    
    return false; // Không trùng lịch
  };

  const handleSelectCourse = (maMo) => {
    const course = availableCourses.find(c => c.maMo === maMo);
    
    if (selectedCourses.includes(maMo)) {
      // Bỏ chọn
      setSelectedCourses(selectedCourses.filter(id => id !== maMo));
    } else {
      // Kiểm tra trùng lịch trước khi chọn
      if (checkScheduleConflict(course)) {
        alert(`Không thể chọn môn "${course.tenMon}" vì trùng lịch với môn đã chọn!\n\nThứ ${course.thu}, Tiết ${course.tietBatDau}-${course.tietKetThuc}`);
        return;
      }
      
      setSelectedCourses([...selectedCourses, maMo]);
    }
  };

  const isCourseSelected = (maMo) => {
    return selectedCourses.includes(maMo);
  };

  const handleConfirmRegistration = async () => {
    if (selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất một học phần để đăng ký');
      return;
    }
    
    const confirmRegister = window.confirm(`Bạn có chắc chắn muốn đăng ký ${selectedCourses.length} học phần đã chọn?`);
    if (!confirmRegister) return;

    setLoading(true);
    let successCount = 0;
    let errorMessages = [];

    for (const maMo of selectedCourses) {
      try {
        const result = await dangKyMonHocService.dangKyLopHoc(maSV, maMo);
        const code = result.code || result.Code;
        const message = result.message || result.Message;
        
        if (code === 200) {
          successCount++;
        } else {
          errorMessages.push(message || 'Lỗi không xác định');
        }
      } catch (error) {
        errorMessages.push('Lỗi kết nối');
      }
    }

    setLoading(false);
    
    if (successCount > 0) {
      alert(`Đã đăng ký thành công ${successCount} học phần`);
      setSelectedCourses([]);
      // Reload danh sách
      await loadDanhSachLopHoc();
      await loadDanhSachDangKy();
    }
    
    if (errorMessages.length > 0) {
      alert(`Có lỗi xảy ra:\n${errorMessages.join('\n')}`);
    }
  };

  const handleCancelPending = async () => {
    if (selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất một học phần để hủy');
      return;
    }
    
    const confirmCancel = window.confirm(`Bạn có chắc chắn muốn hủy ${selectedCourses.length} học phần đang chờ phê duyệt?`);
    if (!confirmCancel) return;

    setLoading(true);
    let successCount = 0;
    let errorMessages = [];

    for (const idDangKy of selectedCourses) {
      try {
        const result = await dangKyMonHocService.huyDangKy(idDangKy);
        const code = result.code || result.Code;
        const message = result.message || result.Message;
        
        if (code === 200) {
          successCount++;
        } else {
          errorMessages.push(message || 'Lỗi không xác định');
        }
      } catch (error) {
        errorMessages.push('Lỗi kết nối');
      }
    }

    setLoading(false);
    
    if (successCount > 0) {
      alert(`Đã hủy thành công ${successCount} học phần`);
      setSelectedCourses([]);
      // Reload danh sách
      await loadDanhSachLopHoc();
      await loadDanhSachDangKy();
    }
    
    if (errorMessages.length > 0) {
      alert(`Có lỗi xảy ra:\n${errorMessages.join('\n')}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTiet = (tietBatDau, tietKetThuc) => {
    return `${tietBatDau}-${tietKetThuc}`;
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
                <th>Mã môn</th>
                <th>Tên học phần</th>
                <th>Số TC</th>
                <th>Giảng viên</th>
                <th>Nhịp</th>
                <th>Thời gian</th>
                <th>Tiết</th>
                <th>Thứ</th>
                <th>Phòng</th>
                <th>Sĩ số</th>
                <th>Còn trống</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="13" className="no-data">Đang tải dữ liệu...</td>
                </tr>
              ) : availableCourses.length === 0 ? (
                <tr>
                  <td colSpan="13" className="no-data">Không có học phần nào được đăng ký</td>
                </tr>
              ) : (
                availableCourses.map((course, index) => (
                  <tr key={course.maMo}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{course.maMon}</td>
                    <td className="text-left">{course.tenMon}</td>
                    <td className="text-center">{course.soTinChi}</td>
                    <td className="text-left">{course.tenGV}</td>
                    <td className="text-center">{course.tenNhip}</td>
                    <td className="text-center">{formatDate(course.ngayBatDau)} - {formatDate(course.ngayKetThuc)}</td>
                    <td className="text-center">{formatTiet(course.tietBatDau, course.tietKetThuc)}</td>
                    <td className="text-center">{course.thu}</td>
                    <td className="text-center">{course.phong}</td>
                    <td className="text-center">{course.siSoToiDa}</td>
                    <td className="text-center">{course.soLuongTrong}</td>
                    <td className="text-center">
                      <button 
                        className={`btn-select ${isCourseSelected(course.maMo) ? 'selected' : ''}`}
                        onClick={() => handleSelectCourse(course.maMo)}
                        disabled={course.soLuongTrong === 0}
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
          <button 
            className="btn-action btn-cancel" 
            onClick={() => setSelectedCourses([])}
            disabled={selectedCourses.length === 0}
          >
            HỦY THAO TÁC
          </button>
          <button 
            className="btn-action btn-confirm" 
            onClick={handleConfirmRegistration}
            disabled={selectedCourses.length === 0 || loading}
          >
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
                <th>Giảng viên</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {pendingCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">Không có học phần nào chờ phê duyệt</td>
                </tr>
              ) : (
                pendingCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-left">{course.tenMon}</td>
                    <td className="text-left">{course.tenGV}</td>
                    <td className="text-center">{formatDate(course.ngayDangKy)}</td>
                    <td className="text-center">
                      <span className="status-badge status-pending">{course.trangThai}</span>
                    </td>
                    <td className="text-center">
                      <button 
                        className={`btn-select ${isCourseSelected(course.id) ? 'selected' : ''}`}
                        onClick={() => handleSelectCourse(course.id)}
                      >
                        Chọn
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-action btn-cancel" 
            onClick={() => setSelectedCourses([])}
            disabled={selectedCourses.length === 0}
          >
            HỦY THAO TÁC
          </button>
          <button 
            className="btn-action btn-confirm" 
            onClick={handleCancelPending}
            disabled={selectedCourses.length === 0 || loading}
          >
            HỦY ĐĂNG KÝ
          </button>
        </div>
      </div>
    </div>
  )
}

export default DangKyMonHoc
