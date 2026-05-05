import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ThanhToan.css'
import { studentService } from '../services/studentService'
import { thanhToanService } from '../services/thanhToanService'

const ThanhToan = () => {
  const navigate = useNavigate();
  const [hocKy, setHocKy] = useState('');
  const [namHoc, setNamHoc] = useState('');
  const [maSV, setMaSV] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

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

  // Load thông tin thanh toán khi chọn học kỳ và năm học
  useEffect(() => {
    console.log('useEffect triggered:', { maSV, hocKy, namHoc });
    if (maSV && hocKy && namHoc) {
      loadPaymentInfo();
    } else {
      setPaymentData(null);
    }
  }, [maSV, hocKy, namHoc]);

  const loadPaymentInfo = async () => {
    setLoading(true);
    try {
      // Tạo mã học kỳ theo format: năm + HK + số (ví dụ: 24HK2)
      const year = namHoc.split('-')[0].slice(-2);
      const maHocKy = `${year}HK${hocKy}`;
      
      console.log('Loading payment info:', { maSV, maHocKy, namHoc });
      
      const result = await thanhToanService.getThanhToanByHocKy(maSV, maHocKy, namHoc);
      
      console.log('Payment API response:', result);
      
      if (result.code === 200 && result.result) {
        console.log('Payment data:', result.result);
        setPaymentData(result.result);
      } else {
        console.log('No payment data or error:', result);
        setPaymentData(null);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin thanh toán:', error);
      setPaymentData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 đ';
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  return (
    <div className="thanhtoan-container">
      <div className="thanhtoan-content">
        
        {/* Filters */}
        <div className="payment-filters">
          <div className="filters-group">
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

          <div className="button-group">
            <button 
              className="btn-back" 
              onClick={() => navigate('/dashboard/tai-chinh')}
            >
              TÀI CHÍNH
            </button>
            <button 
              className="btn-print-invoice" 
              onClick={() => window.print()}
            >
              IN HÓA ĐƠN
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Đang tải thông tin thanh toán...</div>
        ) : !hocKy || !namHoc ? (
          <div className="no-data">Vui lòng chọn học kỳ và năm học để xem thông tin thanh toán</div>
        ) : !paymentData ? (
          <div className="no-data">Không có thông tin thanh toán</div>
        ) : (
          <>
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
                  {paymentData.chiTietMonHoc && paymentData.chiTietMonHoc.length > 0 ? (
                    paymentData.chiTietMonHoc.map((course, index) => (
                      <tr key={index}>
                        <td className="text-center">{paymentData.namHoc}</td>
                        <td className="text-center">{paymentData.hocKy}</td>
                        <td className="text-left">{course.tenHocPhan}</td>
                        <td className="text-center">{course.soTinChi}</td>
                        <td className="text-right">{formatCurrency(course.soTienNop)}</td>
                        <td className="text-right">{formatCurrency(course.mienGiam)}</td>
                        <td className="text-right">{formatCurrency(course.soTienThucNop)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">Không có khoản cần thanh toán</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Amount - Centered */}
            <div className="total-amount-section">
              <span className="total-label">Tổng tiền cần thanh toán:</span>
              <span className="total-value">{formatCurrency(paymentData.tongThucNop)}</span>
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
                  <p style={{ marginLeft: '20px' }}>Ví dụ: V3HAU{maSV}</p>
                  <p><strong>• Ngân hàng: BIDV</strong></p>
                  
                  <div className="note-section">
                    <div className="note-title">Lưu ý:</div>
                    <p>Cần kiểm tra kỹ thông tin tên tài khoản nhận trùng khớp với tên sinh viên.</p>
                    <p>Số tiền cần nộp sinh viên xem trên trang tin chỉ hoặc sau tên tài khoản.</p>
                    <p>Ví dụ: HD {formatCurrency(paymentData.tongThucNop)}_Nguyen Van A.</p>
                    <p>Số tiền phải nộp là: {formatCurrency(paymentData.tongThucNop)}</p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="qr-section">
                {paymentData.qrCodeUrl ? (
                  <>
                    <div className="qr-image-container">
                      <img 
                        src={paymentData.qrCodeUrl} 
                        alt="QR Code thanh toán" 
                        className="qr-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="qr-placeholder" style={{ display: 'none' }}>
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📱</div>
                          <div>Không thể tải mã QR</div>
                        </div>
                      </div>
                    </div>
                    <div className="qr-text">Quét QR để thanh toán học phí</div>
                    
                    {paymentData.thongTinChuyenKhoan && (
                      <div className="bank-info">
                        <div className="bank-info-row">
                          <span className="bank-info-label">Ngân hàng:</span>
                          <span className="bank-info-value">{paymentData.thongTinChuyenKhoan.nganHang}</span>
                        </div>
                        <div className="bank-info-row">
                          <span className="bank-info-label">Số tài khoản:</span>
                          <span className="bank-info-value">{paymentData.thongTinChuyenKhoan.soTaiKhoan}</span>
                        </div>
                        <div className="bank-info-row">
                          <span className="bank-info-label">Tên tài khoản:</span>
                          <span className="bank-info-value">{paymentData.thongTinChuyenKhoan.tenTaiKhoan}</span>
                        </div>
                        <div className="bank-info-row">
                          <span className="bank-info-label">Số tiền:</span>
                          <span className="bank-info-value highlight">{formatCurrency(paymentData.thongTinChuyenKhoan.soTien)}</span>
                        </div>
                        <div className="bank-info-row">
                          <span className="bank-info-label">Nội dung:</span>
                          <span className="bank-info-value">{paymentData.thongTinChuyenKhoan.noiDung}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="qr-placeholder">
                      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📱</div>
                        <div>Mã QR sẽ hiển thị tại đây</div>
                      </div>
                    </div>
                    <div className="qr-text">Quét QR để thanh toán học phí</div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ThanhToan
