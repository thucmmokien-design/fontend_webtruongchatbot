import { useState, useEffect } from 'react'
import './KetQuaHocTap.css'
import { studentService } from '../services/studentService'
import { bangDiemService } from '../services/bangDiemService'

const KetQuaHocTap = () => {
  const [hocKy, setHocKy] = useState('');
  const [namHoc, setNamHoc] = useState('');
  const [chuyenNganh, setChuyenNganh] = useState('CNTT'); // Mặc định CNTT
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [maSV, setMaSV] = useState('');

  const [stats, setStats] = useState({
    kqhtHe4: 0,
    kqhtHe10: 0,
    stcHocTap: 0,
    stcTichLuy: 0,
    xepLoaiHe4: '',
    xepLoaiHe10: '',
    diemKhenThuong: 0,
    diemRenLuyen: 0
  });

  const [completedCourses, setCompletedCourses] = useState([]);

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

  // Load bảng điểm khi component mount (lấy tất cả môn học)
  useEffect(() => {
    if (!maSV) {
      setCompletedCourses([]);
      return;
    }

    const loadAllBangDiem = async () => {
      setLoading(true);
      try {
        const result = await bangDiemService.getBangDiemByMaSV(maSV);
        
        if (result.code === 200 && result.result) {
          const mappedData = result.result.map((item) => ({
            stt: item.stt || 0,
            maMon: item.maMon || '',
            tenMon: item.tenMon || '',
            soTinChi: item.soTinChi || 0,
            maLopHP: item.maLopHP || '',
            tenGiangVien: item.tenGiangVien || '',
            loaiMon: item.loaiMon || '',
            diemQT: item.diemQT || 0,
            diemThi: item.diemThi || 0,
            diemTong: item.diemTong || 0,
            diemHe4: item.diemHe4 || 0,
            diemHe10: item.diemHe10 || 0,
            xepLoai: item.xepLoai || '',
            hocKy: item.hocKy || '',
            namHoc: item.namHoc || '',
            diemChu: convertDiemToLetter(item.diemHe4)
          }));
          setCompletedCourses(mappedData);
          
          // Tính toán các thông số thống kê
          calculateStats(mappedData);
        } else {
          setCompletedCourses([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải bảng điểm:', error);
        setCompletedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllBangDiem();
  }, [maSV]);

  // Tính toán các thông số thống kê
  const calculateStats = (courses) => {
    if (!courses || courses.length === 0) {
      setStats({
        kqhtHe4: 0,
        kqhtHe10: 0,
        stcHocTap: 0,
        stcTichLuy: 0,
        xepLoaiHe4: '',
        xepLoaiHe10: '',
        diemKhenThuong: 0,
        diemRenLuyen: 0
      });
      return;
    }

    // Tính tổng số tín chỉ
    const totalCredits = courses.reduce((sum, course) => sum + course.soTinChi, 0);
    
    // Tính điểm trung bình hệ 4 (có trọng số theo tín chỉ)
    const totalWeightedHe4 = courses.reduce((sum, course) => 
      sum + (course.diemHe4 * course.soTinChi), 0
    );
    const avgHe4 = totalCredits > 0 ? (totalWeightedHe4 / totalCredits).toFixed(2) : 0;
    
    // Tính điểm trung bình hệ 10 (có trọng số theo tín chỉ)
    const totalWeightedHe10 = courses.reduce((sum, course) => 
      sum + (course.diemHe10 * course.soTinChi), 0
    );
    const avgHe10 = totalCredits > 0 ? (totalWeightedHe10 / totalCredits).toFixed(2) : 0;
    
    // Xếp loại theo hệ 4
    const getXepLoaiHe4 = (diem) => {
      if (diem >= 3.6) return 'Xuất sắc';
      if (diem >= 3.2) return 'Giỏi';
      if (diem >= 2.5) return 'Khá';
      if (diem >= 2.0) return 'Trung bình';
      return 'Yếu';
    };
    
    // Xếp loại theo hệ 10
    const getXepLoaiHe10 = (diem) => {
      if (diem >= 9.0) return 'Xuất sắc';
      if (diem >= 8.0) return 'Giỏi';
      if (diem >= 7.0) return 'Khá';
      if (diem >= 5.0) return 'Trung bình';
      return 'Yếu';
    };

    setStats({
      kqhtHe4: parseFloat(avgHe4),
      kqhtHe10: parseFloat(avgHe10),
      stcHocTap: totalCredits,
      stcTichLuy: totalCredits,
      xepLoaiHe4: getXepLoaiHe4(parseFloat(avgHe4)),
      xepLoaiHe10: getXepLoaiHe10(parseFloat(avgHe10)),
      diemKhenThuong: 0,
      diemRenLuyen: 0
    });
  };

  // Chuyển đổi điểm hệ 4 sang chữ
  const convertDiemToLetter = (diemHe4) => {
    if (diemHe4 >= 3.5) return 'A';
    if (diemHe4 >= 3.0) return 'B+';
    if (diemHe4 >= 2.5) return 'B';
    if (diemHe4 >= 2.0) return 'C+';
    if (diemHe4 >= 1.5) return 'C';
    if (diemHe4 >= 1.0) return 'D';
    return 'F';
  };

  const getGradeClass = (grade) => {
    if (grade === 'A' || grade === 'B+' || grade === 'B') return 'grade-a';
    if (grade === 'F') return 'grade-f';
    return '';
  };

  // Lọc danh sách môn học theo học kỳ và năm học
  const filteredCourses = completedCourses.filter(course => {
    const matchHocKy = !hocKy || course.hocKy.includes(`Học kỳ ${hocKy}`);
    const matchNamHoc = !namHoc || course.namHoc === namHoc;
    const matchSearch = !searchTerm || 
      course.maMon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tenMon.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchHocKy && matchNamHoc && matchSearch;
  });

  // Tính toán lại thông số khi thay đổi filter
  useEffect(() => {
    // Lọc lại courses dựa trên hocKy và namHoc
    const filtered = completedCourses.filter(course => {
      const matchHocKy = !hocKy || course.hocKy.includes(`Học kỳ ${hocKy}`);
      const matchNamHoc = !namHoc || course.namHoc === namHoc;
      return matchHocKy && matchNamHoc;
    });

    if (filtered.length > 0) {
      calculateStats(filtered);
    } else if (hocKy || namHoc) {
      // Nếu có filter nhưng không có kết quả, reset stats
      setStats({
        kqhtHe4: 0,
        kqhtHe10: 0,
        stcHocTap: 0,
        stcTichLuy: 0,
        xepLoaiHe4: '',
        xepLoaiHe10: '',
        diemKhenThuong: 0,
        diemRenLuyen: 0
      });
    }
  }, [hocKy, namHoc, completedCourses]);

  return (
    <div className="ketqua-container">
      <div className="ketqua-content">
        
        <div className="ketqua-filters">
          <div className="filter-note">
            Số tín chỉ tích lũy A/B. Trong đó:<br />
            A: Tổng STC mà TBCHP đạt từ D trở lên<br />
            B: Tổng STC mà sinh viên đã học từ các học phần
          </div>

          <div className="filter-grid">
            <div className="filter-left">
              <div className="filter-row">
                <label>Học kỳ:</label>
                <select value={hocKy} onChange={(e) => setHocKy(e.target.value)}>
                  <option value="">--</option>
                  <option value="1">Học kỳ I</option>
                  <option value="2">Học kỳ II</option>
                  <option value="3">Học kỳ Hè</option>
                </select>
              </div>

              <div className="filter-row">
                <label>Năm học:</label>
                <select value={namHoc} onChange={(e) => setNamHoc(e.target.value)}>
                  <option value="">--</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>

              <div className="filter-row">
                <label>Chuyên ngành:</label>
                <select value={chuyenNganh} onChange={(e) => setChuyenNganh(e.target.value)}>
                  <option value="">--</option>
                  <option value="CNTT">Công nghệ thông tin</option>
                  <option value="KTPM">Kỹ thuật phần mềm</option>
                </select>
              </div>
            </div>

            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">KQHT (Hệ 4):</span>
                <span className="stat-value">{stats.kqhtHe4}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Xếp loại (Hệ 4):</span>
                <span className="stat-value">{stats.xepLoaiHe4}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">KQHT (Hệ 10):</span>
                <span className="stat-value">{stats.kqhtHe10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Xếp loại (Hệ 10):</span>
                <span className="stat-value">{stats.xepLoaiHe10}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">STC Học tập:</span>
                <span className="stat-value">{stats.stcHocTap}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Điểm khen thưởng:</span>
                <span className="stat-value">{stats.diemKhenThuong}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">STC Tích lũy:</span>
                <span className="stat-value">{stats.stcTichLuy}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Điểm rèn luyện:</span>
                <span className="stat-value">{stats.diemRenLuyen}</span>
              </div>
            </div>
          </div>

          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo mã tín HP"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách điểm các HP đã học */}
        <h3 className="section-title">Danh sách điểm các HP đã học:</h3>
        <div className="table-wrapper">
          <table className="result-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã môn</th>
                <th>Tên môn</th>
                <th>STC</th>
                <th>Mã lớp HP</th>
                <th>Loại môn</th>
                <th>Điểm QT</th>
                <th>Điểm thi</th>
                <th>Điểm tổng</th>
                <th>Điểm (Hệ 4)</th>
                <th>Điểm (Hệ 10)</th>
                <th>Xếp loại</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" className="no-data">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="12" className="no-data">Không có dữ liệu</td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.stt}>
                    <td className="text-center">{course.stt}</td>
                    <td>{course.maMon}</td>
                    <td className="text-left">{course.tenMon}</td>
                    <td className="text-center">{course.soTinChi}</td>
                    <td>{course.maLopHP}</td>
                    <td className="text-center">{course.loaiMon}</td>
                    <td className="text-center">{course.diemQT}</td>
                    <td className="text-center">{course.diemThi}</td>
                    <td className="text-center">{course.diemTong}</td>
                    <td className="text-center">{course.diemHe4}</td>
                    <td className="text-center">{course.diemHe10}</td>
                    <td className="text-center">{course.xepLoai}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default KetQuaHocTap
