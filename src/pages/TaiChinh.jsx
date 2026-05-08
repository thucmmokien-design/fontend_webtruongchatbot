import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './TaiChinh.css'
import { studentService } from '../services/studentService'
import { hocPhiService } from '../services/hocPhiService'

const TaiChinh = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [maSV, setMaSV] = useState('');

  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalUnpaid: 0
  });

  const [tuitionFees, setTuitionFees] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [paidDetails, setPaidDetails] = useState([]);

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

  // Load thông tin học phí khi có mã sinh viên
  useEffect(() => {
    if (!maSV) return;

    const loadHocPhi = async () => {
      setLoading(true);
      try {
        const result = await hocPhiService.getHocPhiByMaSV(maSV);
        
        if (result.code === 200 && result.result) {
          const data = result.result;
          
          // Set summary
          setSummary({
            totalPaid: data.tongTienDaNop || 0,
            totalUnpaid: data.tongTienChuaNop || 0
          });

          // Set danh sách học phí
          const tuitionFeesList = data.danhSachHocPhi || [];
          setTuitionFees(tuitionFeesList);

          // Lọc các học kỳ đã nộp
          const paidSemesters = tuitionFeesList
            .filter(fee => fee.trangThai === 'Đã Nộp' || fee.trangThai === 'Đã nộp')
            .map(fee => ({ namHoc: fee.namHoc, hocKy: fee.hocKy }));

          // Lọc danh sách hóa đơn theo các học kỳ đã nộp
          const filteredInvoices = (data.danhSachHoaDon || []).filter(invoice => 
            paidSemesters.some(semester => 
              semester.namHoc === invoice.namHoc && semester.hocKy === invoice.hocKy
            )
          );

          // Format ngày cho hóa đơn
          const formattedInvoices = filteredInvoices.map(invoice => ({
            ...invoice,
            ngayNop: formatDate(invoice.ngayNop)
          }));
          setInvoices(formattedInvoices);

          // Lọc chi tiết đã nộp theo các học kỳ đã nộp
          const filteredPaidDetails = (data.chiTietDaNop || []).filter(detail => 
            paidSemesters.some(semester => 
              semester.namHoc === detail.namHoc && semester.hocKy === detail.hocKy
            )
          );
          setPaidDetails(filteredPaidDetails);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin học phí:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHocPhi();
  }, [maSV]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  const handlePayment = () => {
    navigate('/dashboard/thanh-toan');
  };

  const handlePrintInvoice = (invoice) => {
    // Link cho năm học 2024-2025
    const link2024_2025 = 'https://drive.google.com/file/d/1b9ItG5bbqcs_zL9lxzBGraNZywtQYTk0/view?usp=drive_link';
    // Link cho các năm học khác
    const linkOther = 'https://drive.google.com/file/d/1PPJ2lxDMgqUDFEydhu5ztxpDZkbI6Ofb/view?usp=drive_link';
    
    // Kiểm tra năm học và mở link tương ứng
    if (invoice.namHoc === '2024-2025') {
      window.open(link2024_2025, '_blank');
    } else {
      window.open(linkOther, '_blank');
    }
  };

  return (
    <div className="taichinh-container">
      <div className="taichinh-content">
        
        {loading ? (
          <div className="loading">Đang tải thông tin học phí...</div>
        ) : (
          <>
            {/* Summary Section */}
            <div className="summary-section">
              <div className="summary-item paid">
                Tổng tiền đã nộp: <span>{formatCurrency(summary.totalPaid)}</span>
              </div>
              <div className="summary-item unpaid">
                Tổng tiền chưa nộp: <span>{formatCurrency(summary.totalUnpaid)}</span>
              </div>
              <button className="btn-payment" onClick={handlePayment}>
                THỰC HIỆN THANH TOÁN
              </button>
            </div>

            {/* Tuition Fees Table */}
            <div className="table-wrapper">
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Năm học</th>
                    <th>Học kỳ</th>
                    <th>Mức học phí</th>
                    <th>Miễn giảm</th>
                    <th>Số tiền phải nộp</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {tuitionFees.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-data">Không có dữ liệu</td>
                    </tr>
                  ) : (
                    tuitionFees.map((fee, index) => (
                      <tr key={index}>
                        <td className="text-center">{fee.namHoc}</td>
                        <td className="text-center">{fee.hocKy}</td>
                        <td className="text-right">{formatCurrency(fee.mucHocPhi)}</td>
                        <td className="text-right">{formatCurrency(fee.mienGiam)}</td>
                        <td className="text-right">{formatCurrency(fee.soTienPhaiNop)}</td>
                        <td className={`text-center ${fee.trangThai === 'Đã Nộp' || fee.trangThai === 'Đã nộp' ? 'status-paid' : 'status-unpaid'}`}>
                          {fee.trangThai}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Invoice Information */}
            <h3 className="section-title">Thông tin hóa đơn:</h3>
            <div className="table-wrapper">
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Năm học</th>
                    <th>Học kỳ</th>
                    <th>Ngày nộp</th>
                    <th>Số phiếu</th>
                    <th>Số tiền đã nộp</th>
                    <th>Hình thức</th>
                    <th>In hóa đơn</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">Không có dữ liệu</td>
                    </tr>
                  ) : (
                    invoices.map((invoice, index) => (
                      <tr key={index}>
                        <td className="text-center">{invoice.namHoc}</td>
                        <td className="text-center">{invoice.hocKy}</td>
                        <td className="text-center">{invoice.ngayNop}</td>
                        <td className="text-center">{invoice.soPhieu}</td>
                        <td className="text-right">{formatCurrency(invoice.soTienDaNop)}</td>
                        <td className="text-center">{invoice.hinhThuc}</td>
                        <td className="text-center">
                          <button 
                            className="btn-invoice" 
                            onClick={() => handlePrintInvoice(invoice)}
                          >
                            In hóa đơn
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paid Details - Chỉ hiển thị khi có học phí đã nộp */}
            {tuitionFees.some(fee => fee.trangThai === 'Đã Nộp' || fee.trangThai === 'Đã nộp') && (
              <>
                <h3 className="section-title">Chi tiết các khoản đã nộp:</h3>
                <div className="table-wrapper">
                  <table className="finance-table">
                    <thead>
                      <tr>
                        <th>Năm học</th>
                        <th>Học kỳ</th>
                        <th>Mã lớp HP</th>
                        <th>Tên học phần</th>
                        <th>Số tín chỉ</th>
                        <th>Số tiền/TC</th>
                        <th>Mức giảm</th>
                        <th>Số tiền thực nộp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paidDetails.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="no-data">Không có dữ liệu</td>
                        </tr>
                      ) : (
                        paidDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className="text-center">{detail.namHoc}</td>
                            <td className="text-center">{detail.hocKy}</td>
                            <td className="text-center">{detail.maLopHP}</td>
                            <td className="text-left">{detail.tenHocPhan}</td>
                            <td className="text-center">{detail.soTinChi}</td>
                            <td className="text-right">{formatCurrency(detail.soTienNop)}</td>
                            <td className="text-right">{formatCurrency(detail.mienGiam)}</td>
                            <td className="text-right">{formatCurrency(detail.soTienThucNop)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TaiChinh
