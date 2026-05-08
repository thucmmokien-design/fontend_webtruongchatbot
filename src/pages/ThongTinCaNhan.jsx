import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { authService } from '../services/authService';
import './ThongTinCaNhan.css';

const ThongTinCaNhan = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Format ngày từ ISO string sang dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchAllInfo = async () => {
      setLoading(true);
      
      // Lấy thông tin cơ bản
      const basicInfo = await studentService.getMyInfo();
      if (basicInfo.success) {
        setStudentInfo(basicInfo.data);
        setFormData(prev => ({ ...prev, ...basicInfo.data }));
      }

      // Lấy thông tin cá nhân chi tiết
      const detailInfo = await studentService.getThongTinCaNhan();
      console.log('Detail Info:', detailInfo);
      if (detailInfo.success) {
        setFormData(prev => ({ 
          ...prev, 
          ...detailInfo.data,
          nganHang: detailInfo.data.tenNganHang || detailInfo.data.nganHang, // Map tenNganHang -> nganHang
          hoKhauTT: detailInfo.data.hoKhauThuongTru || detailInfo.data.hoKhauTT // Map hoKhauThuongTru -> hoKhauTT
        }));
      }

      // Lấy thông tin người thân
      const nguoiThanInfo = await studentService.getNguoiThan();
      console.log('Nguoi Than Info:', nguoiThanInfo);
      if (nguoiThanInfo.success && nguoiThanInfo.data && nguoiThanInfo.data.length > 0) {
        const nguoiThan = nguoiThanInfo.data[0]; // Lấy người thân đầu tiên
        setFormData(prev => ({
          ...prev,
          nguoiThan_hoTen: nguoiThan.hoTen,
          nguoiThan_ngaySinh: nguoiThan.ngaySinh,
          nguoiThan_sdt: nguoiThan.dienThoai || nguoiThan.sdt,
          nguoiThan_cccd: nguoiThan.soCCCD || nguoiThan.cccd,
          nguoiThan_hoKhau: nguoiThan.hoKhauThuongTru || nguoiThan.hoKhau,
          nguoiThan_moiQuanHe: nguoiThan.moiQuanHe
        }));
      }

      // Lấy thông tin người giám hộ
      const giamHoInfo = await studentService.getNguoiGiamHo();
      console.log('Giam Ho Info:', giamHoInfo);
      if (giamHoInfo.success && giamHoInfo.data && giamHoInfo.data.length > 0) {
        const giamHo = giamHoInfo.data[0]; // Lấy người giám hộ đầu tiên
        setFormData(prev => ({
          ...prev,
          giamHo_hoTen: giamHo.hoTen,
          giamHo_ngaySinh: giamHo.ngaySinh,
          giamHo_sdt: giamHo.dienThoai || giamHo.sdt,
          giamHo_cccd: giamHo.soCCCD || giamHo.cccd,
          giamHo_hoKhau: giamHo.hoKhauThuongTru || giamHo.hoKhau,
          giamHo_moiQuanHe: giamHo.moiQuanHe
        }));
      }

      setLoading(false);
    };

    fetchAllInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = async () => {
    setIsEditing(false);
    setMessage('');
    
    // Reload lại tất cả thông tin
    setLoading(true);
    
    // Lấy thông tin cơ bản
    const basicInfo = await studentService.getMyInfo();
    if (basicInfo.success) {
      setStudentInfo(basicInfo.data);
      setFormData(prev => ({ ...prev, ...basicInfo.data }));
    }

    // Lấy thông tin cá nhân chi tiết
    const detailInfo = await studentService.getThongTinCaNhan();
    if (detailInfo.success) {
      setFormData(prev => ({ 
        ...prev, 
        ...detailInfo.data,
        nganHang: detailInfo.data.tenNganHang || detailInfo.data.nganHang,
        hoKhauTT: detailInfo.data.hoKhauThuongTru || detailInfo.data.hoKhauTT
      }));
    }

    // Lấy thông tin người thân
    const nguoiThanInfo = await studentService.getNguoiThan();
    if (nguoiThanInfo.success && nguoiThanInfo.data && nguoiThanInfo.data.length > 0) {
      const nguoiThan = nguoiThanInfo.data[0];
      setFormData(prev => ({
        ...prev,
        nguoiThan_hoTen: nguoiThan.hoTen,
        nguoiThan_ngaySinh: nguoiThan.ngaySinh,
        nguoiThan_sdt: nguoiThan.dienThoai || nguoiThan.sdt,
        nguoiThan_cccd: nguoiThan.soCCCD || nguoiThan.cccd,
        nguoiThan_hoKhau: nguoiThan.hoKhauThuongTru || nguoiThan.hoKhau,
        nguoiThan_moiQuanHe: nguoiThan.moiQuanHe
      }));
    }

    // Lấy thông tin người giám hộ
    const giamHoInfo = await studentService.getNguoiGiamHo();
    if (giamHoInfo.success && giamHoInfo.data && giamHoInfo.data.length > 0) {
      const giamHo = giamHoInfo.data[0];
      setFormData(prev => ({
        ...prev,
        giamHo_hoTen: giamHo.hoTen,
        giamHo_ngaySinh: giamHo.ngaySinh,
        giamHo_sdt: giamHo.dienThoai || giamHo.sdt,
        giamHo_cccd: giamHo.soCCCD || giamHo.cccd,
        giamHo_hoKhau: giamHo.hoKhauThuongTru || giamHo.hoKhau,
        giamHo_moiQuanHe: giamHo.moiQuanHe
      }));
    }

    setLoading(false);
  };

  const handleSave = async () => {
    try {
      setMessage('Đang lưu thông tin...');
      
      // Tách dữ liệu cho từng API
      const thongTinCaNhanData = {
        email: formData.email,
        dienThoai: formData.dienThoai,
        soTaiKhoan: formData.soTaiKhoan,
        nganHang: formData.nganHang,
        soCCCD: formData.soCCCD,
        soBaoHiem: formData.soBaoHiem,
        danToc: formData.danToc,
        tonGiao: formData.tonGiao,
        queQuan: formData.queQuan,
        xa: formData.xa,
        tinhTP: formData.tinhTP,
        quocTich: formData.quocTich,
        hoKhauTT: formData.hoKhauTT,
        noiO: formData.noiO
      };

      const nguoiThanData = {
        hoTen: formData.nguoiThan_hoTen,
        ngaySinh: formData.nguoiThan_ngaySinh,
        sdt: formData.nguoiThan_sdt,
        cccd: formData.nguoiThan_cccd,
        hoKhau: formData.nguoiThan_hoKhau,
        moiQuanHe: formData.nguoiThan_moiQuanHe
      };

      const giamHoData = {
        hoTen: formData.giamHo_hoTen,
        ngaySinh: formData.giamHo_ngaySinh,
        sdt: formData.giamHo_sdt,
        cccd: formData.giamHo_cccd,
        hoKhau: formData.giamHo_hoKhau,
        moiQuanHe: formData.giamHo_moiQuanHe
      };

      // Gọi 3 API cập nhật
      const [detailResult, nguoiThanResult, giamHoResult] = await Promise.all([
        studentService.updateThongTinCaNhan(thongTinCaNhanData),
        studentService.updateNguoiThan(nguoiThanData),
        studentService.updateNguoiGiamHo(giamHoData)
      ]);

      if (detailResult.success && nguoiThanResult.success && giamHoResult.success) {
        setIsEditing(false);
        setMessage('Cập nhật thông tin thành công!');
        
        // Refresh lại thông tin
        const basicInfo = await studentService.getMyInfo();
        if (basicInfo.success) {
          setStudentInfo(basicInfo.data);
          authService.saveStudentInfo(basicInfo.data);
        }
        
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('Có lỗi khi cập nhật một số thông tin');
      }
    } catch (error) {
      setMessage('Lỗi khi cập nhật thông tin. Vui lòng thử lại!');
      console.error('Update error:', error);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải thông tin...</div>;
  }

  return (
    <div className="thong-tin-ca-nhan">

      {message && (
        <div className={`message-box ${message.includes('thành công') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Thông tin cơ bản */}
      <div className="info-box basic-info">
        <div className="info-row">
          <div className="info-col">
            <span className="label">Họ và tên:</span>
            <span className="value">{studentInfo?.hoTen || 'N/A'}</span>
          </div>
          <div className="info-col">
            <span className="label">Hệ đào tạo:</span>
            <span className="value">Đại học - Chính quy</span>
          </div>
        </div>

        <div className="info-row">
          <div className="info-col">
            <span className="label">Ngày sinh:</span>
            <span className="value">{formatDate(studentInfo?.ngaySinh)}</span>
          </div>
          <div className="info-col">
            <span className="label">Chuyên ngành chính:</span>
            <span className="value">Công nghệ thông tin</span>
          </div>
        </div>

        <div className="info-row">
          <div className="info-col">
            <span className="label">Giới tính:</span>
            <span className="value">{studentInfo?.gioiTinh || 'N/A'}</span>
          </div>
          <div className="info-col">
            <span className="label">Khóa học:</span>
            <span className="value">{studentInfo?.tenLop?.substring(0, 2) || '2023'}</span>
          </div>
        </div>

        <div className="info-row">
          <div className="info-col">
            <span className="label">Mã sinh viên:</span>
            <span className="value">{studentInfo?.maSV || 'N/A'}</span>
          </div>
          <div className="info-col">
            <span className="label">Niên khóa:</span>
            <span className="value">
              {studentInfo?.tenLop ? `20${studentInfo.tenLop.substring(0, 2)} - 20${parseInt(studentInfo.tenLop.substring(0, 2)) + 5}` : '2023 - 2028'}
            </span>
          </div>
        </div>

        <div className="info-row">
          <div className="info-col">
            <span className="label">Lớp quản lý:</span>
            <span className="value">{studentInfo?.tenLop || 'N/A'}</span>
          </div>
          <div className="info-col">
            <span className="label">Trạng thái:</span>
            <span className="value" style={{color: studentInfo?.trangThai === 'Đang học' ? '#16a34a' : '#dc2626'}}>
              {studentInfo?.trangThai || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Form thông tin chi tiết */}
      <div className="info-box detail-form">
        <div className="form-section">
          <div className="form-row">
            <label>Email:</label>
            <input 
              type="email"
              name="email"
              value={formData?.email || ''} 
              onChange={handleInputChange}
              placeholder="Nhập email"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>SĐT:</label>
            <input 
              type="text"
              name="dienThoai"
              value={formData?.dienThoai || ''} 
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>STK:</label>
            <input 
              type="text"
              name="soTaiKhoan"
              value={formData?.soTaiKhoan || ''} 
              onChange={handleInputChange}
              placeholder="Nhập số tài khoản"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Ngân hàng:</label>
            <input 
              type="text"
              name="nganHang"
              value={formData?.nganHang || ''} 
              onChange={handleInputChange}
              placeholder="Nhập tên ngân hàng"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Số CCCD:</label>
            <input 
              type="text"
              name="soCCCD"
              value={formData?.soCCCD || ''} 
              onChange={handleInputChange}
              placeholder="Nhập số CCCD"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Số BH:</label>
            <input 
              type="text"
              name="soBaoHiem"
              value={formData?.soBaoHiem || ''} 
              onChange={handleInputChange}
              placeholder="Nhập số bảo hiểm"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Dân tộc:</label>
            <input 
              type="text"
              name="danToc"
              value={formData?.danToc || ''} 
              onChange={handleInputChange}
              placeholder="Nhập dân tộc"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Tôn giáo:</label>
            <input 
              type="text"
              name="tonGiao"
              value={formData?.tonGiao || ''} 
              onChange={handleInputChange}
              placeholder="Nhập tôn giáo"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Quê quán:</label>
            <input 
              type="text"
              name="queQuan"
              value={formData?.queQuan || ''} 
              onChange={handleInputChange}
              placeholder="Nhập quê quán"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Xã:</label>
            <input 
              type="text"
              name="xa"
              value={formData?.xa || ''} 
              onChange={handleInputChange}
              placeholder="Nhập xã"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Tỉnh/ TP:</label>
            <input 
              type="text"
              name="tinhTP"
              value={formData?.tinhTP || ''} 
              onChange={handleInputChange}
              placeholder="Nhập tỉnh/thành phố"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Quốc tịch:</label>
            <input 
              type="text"
              name="quocTich"
              value={formData?.quocTich || ''} 
              onChange={handleInputChange}
              placeholder="Nhập quốc tịch"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Hộ khẩu TT:</label>
            <input 
              type="text"
              name="hoKhauTT"
              value={formData?.hoKhauTT || ''} 
              onChange={handleInputChange}
              placeholder="Nhập hộ khẩu thường trú"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Nơi ở:</label>
            <input 
              type="text"
              name="noiO"
              value={formData?.noiO || ''} 
              onChange={handleInputChange}
              placeholder="Nhập nơi ở hiện tại"
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Cột 2 */}
        <div className="form-section">
          <h3 className="section-title">THÔNG TIN NGƯỜI THÂN</h3>

          <div className="form-row">
            <label>Họ tên:</label>
            <input 
              type="text"
              name="nguoiThan_hoTen"
              value={formData?.nguoiThan_hoTen || ''} 
              onChange={handleInputChange}
              placeholder="Nhập họ tên người thân"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Ngày sinh:</label>
            {isEditing ? (
              <input 
                type="date"
                name="nguoiThan_ngaySinh"
                value={formData?.nguoiThan_ngaySinh?.split('T')[0] || ''} 
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
              />
            ) : (
              <input 
                type="text"
                value={formatDate(formData?.nguoiThan_ngaySinh)}
                disabled
              />
            )}
          </div>

          <div className="form-row">
            <label>SĐT:</label>
            <input 
              type="text"
              name="nguoiThan_sdt"
              value={formData?.nguoiThan_sdt || ''} 
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Số CCCD:</label>
            <input 
              type="text"
              name="nguoiThan_cccd"
              value={formData?.nguoiThan_cccd || ''} 
              onChange={handleInputChange}
              placeholder="Nhập số CCCD"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Hộ khẩu TT:</label>
            <input 
              type="text"
              name="nguoiThan_hoKhau"
              value={formData?.nguoiThan_hoKhau || ''} 
              onChange={handleInputChange}
              placeholder="Nhập hộ khẩu thường trú"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Mối quan hệ:</label>
            <input 
              type="text"
              name="nguoiThan_moiQuanHe"
              value={formData?.nguoiThan_moiQuanHe || ''} 
              onChange={handleInputChange}
              placeholder="Nhập mối quan hệ"
              disabled={!isEditing}
            />
          </div>

          <h3 className="section-title">THÔNG TIN NGƯỜI GIÁM HỘ</h3>

          <div className="form-row">
            <label>Họ tên:</label>
            <input 
              type="text"
              name="giamHo_hoTen"
              value={formData?.giamHo_hoTen || ''} 
              onChange={handleInputChange}
              placeholder="Nhập họ tên người giám hộ"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Ngày sinh:</label>
            {isEditing ? (
              <input 
                type="date"
                name="giamHo_ngaySinh"
                value={formData?.giamHo_ngaySinh?.split('T')[0] || ''} 
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
              />
            ) : (
              <input 
                type="text"
                value={formatDate(formData?.giamHo_ngaySinh)}
                disabled
              />
            )}
          </div>

          <div className="form-row">
            <label>SĐT:</label>
            <input 
              type="text"
              name="giamHo_sdt"
              value={formData?.giamHo_sdt || ''} 
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Số CCCD:</label>
            <input 
              type="text"
              name="giamHo_cccd"
              value={formData?.giamHo_cccd || ''} 
              onChange={handleInputChange}
              placeholder="Nhập số CCCD"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Hộ khẩu TT:</label>
            <input 
              type="text"
              name="giamHo_hoKhau"
              value={formData?.giamHo_hoKhau || ''} 
              onChange={handleInputChange}
              placeholder="Nhập hộ khẩu thường trú"
              disabled={!isEditing}
            />
          </div>

          <div className="form-row">
            <label>Mối quan hệ:</label>
            <input 
              type="text"
              name="giamHo_moiQuanHe"
              value={formData?.giamHo_moiQuanHe || ''} 
              onChange={handleInputChange}
              placeholder="Nhập mối quan hệ"
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <div className="button-container">
        {!isEditing ? (
          <>
            <button className="btn-edit" onClick={handleEdit}>
              ĐỔI THÔNG TIN
            </button>
            <button 
              className="btn-change-password" 
              onClick={() => navigate('/change-password')}
            >
              ĐỔI MẬT KHẨU
            </button>
          </>
        ) : (
          <>
            <button className="btn-cancel" onClick={handleCancel}>
              HỦY
            </button>
            <button className="btn-save" onClick={handleSave}>
              LƯU THAY ĐỔI
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ThongTinCaNhan;
