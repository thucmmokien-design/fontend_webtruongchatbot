import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ThanhToan.css'

const ThanhToan = () => {
  const navigate = useNavigate();
  const [hocKy, setHocKy] = useState('');
  const [namHoc, setNamHoc] = useState('');

  // Mock data - sẽ thay bằng API call
  const [unpaidCourses, setUnpaidCourses] = useState([
    {
      namHoc: '2025-2026',
      hocKy: 1,
      tenHocPhan: '',
      soTinChi: '',
      soTienNop: '',
      mucGiam: '',
      soTienThucNop: ''
    }
  ]);

  const [totalAmount, setTotalAmount] = useState(0);

  const formatCurrency = (amount) => {
    if (!amount) return '00.00 đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  return (
    <div className="thanhtoan-container">
      <div className="thanhtoan-content">
        
        {/* Filters */}
        <div className="payment-filters">
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
        </div>

        {/* Unpaid Courses Table */}
        <h3 className="section-title">Chi tiết các khoản cần thanh toán:</h3>
        <div className="table-wrapper">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Năm học</th>
                <th>Học kỳ</th>
                <th>Tên học phần</th>
                <th>Số tín chỉ</th>
                <th>Số tiền nộp</th>
                <th>Mức giảm</th>
                <th>Số tiền thực nộp</th>
              </tr>
            </thead>
            <tbody>
              {unpaidCourses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">Không có khoản cần thanh toán</td>
                </tr>
              ) : (
                unpaidCourses.map((course, index) => (
                  <tr key={index}>
                    <td className="text-center">{course.namHoc}</td>
                    <td className="text-center">{course.hocKy}</td>
                    <td className="text-left">{course.tenHocPhan}</td>
                    <td className="text-center">{course.soTinChi}</td>
                    <td className="text-right">{course.soTienNop}</td>
                    <td className="text-right">{course.mucGiam}</td>
                    <td className="text-right">{course.soTienThucNop}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Payment Summary */}
        <div className="payment-summary">
          {/* Instructions */}
          <div className="payment-instructions">
            <div className="instructions-title">Hướng dẫn nộp học phí:</div>
            <div className="instructions-content">
              <p>Sinh viên quét trực tiếp mã QR thanh toán trên trang tin chỉ</p>
              <p>Hoặc nhập tay tới tài khoản cần thanh toán:</p>
              <p><strong>• Số tài khoản: V3HAU + MSV</strong></p>
              <p style={{ marginLeft: '10px' }}>Ví dụ: V3HAU2355010111</p>
              <p><strong>• Ngân hàng: BIDV</strong></p>
              
              <div className="note-section">
                <div className="note-title">Lưu ý:</div>
                <p>Cần kiểm tra kỹ thông tin tên tài khoản nhận trùng khớp với tên sinh viên.</p>
                <p>Số tiền cần nộp sinh viên xem trên trang tin chỉ hoặc sau tên tài khoản.</p>
                <p>Ví dụ: HD 7840000VND_Nguyen Van A.</p>
                <p>Số tiền phải nộp là: 7840000 VND</p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="qr-section">
            <div className="total-amount">
              Tổng tiền cần thanh toán: <span>{formatCurrency(totalAmount)}</span>
            </div>
            
            <div className="qr-placeholder">
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📱</div>
                <div>Mã QR sẽ hiển thị tại đây</div>
              </div>
            </div>
            
            <div className="qr-text">Quét QR để thanh toán học phí</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThanhToan
