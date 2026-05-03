import { useState } from 'react'
import './BieuMau.css'

const BieuMau = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'hoc-tap', name: 'Học tập' },
    { id: 'hanh-chinh', name: 'Hành chính' },
    { id: 'tai-chinh', name: 'Tài chính' },
    { id: 'khac', name: 'Khác' }
  ];

  // Mock data - Danh sách biểu mẫu
  const [forms, setForms] = useState([
    {
      id: 1,
      title: 'Đơn xin nghỉ học',
      description: 'Biểu mẫu đơn xin nghỉ học có lý do (ốm đau, việc gia đình...)',
      category: 'hoc-tap',
      date: '15/03/2024',
      size: '125 KB',
      fileType: 'PDF',
      icon: '📄'
    },
    {
      id: 2,
      title: 'Đơn xin bảo lưu kết quả',
      description: 'Biểu mẫu đơn xin bảo lưu kết quả học tập',
      category: 'hoc-tap',
      date: '10/03/2024',
      size: '98 KB',
      fileType: 'DOCX',
      icon: '📝'
    },
    {
      id: 3,
      title: 'Đơn xin cấp lại thẻ sinh viên',
      description: 'Biểu mẫu đơn xin cấp lại thẻ sinh viên khi bị mất hoặc hư hỏng',
      category: 'hanh-chinh',
      date: '08/03/2024',
      size: '110 KB',
      fileType: 'PDF',
      icon: '🎫'
    },
    {
      id: 4,
      title: 'Đơn xin giấy xác nhận sinh viên',
      description: 'Biểu mẫu đơn xin cấp giấy xác nhận là sinh viên đang học tại trường',
      category: 'hanh-chinh',
      date: '05/03/2024',
      size: '95 KB',
      fileType: 'PDF',
      icon: '📋'
    },
    {
      id: 5,
      title: 'Đơn xin hoãn thi',
      description: 'Biểu mẫu đơn xin hoãn thi có lý do chính đáng',
      category: 'hoc-tap',
      date: '01/03/2024',
      size: '102 KB',
      fileType: 'DOCX',
      icon: '📅'
    },
    {
      id: 6,
      title: 'Đơn xin miễn giảm học phí',
      description: 'Biểu mẫu đơn xin xét miễn giảm học phí cho sinh viên có hoàn cảnh khó khăn',
      category: 'tai-chinh',
      date: '28/02/2024',
      size: '135 KB',
      fileType: 'PDF',
      icon: '💰'
    },
    {
      id: 7,
      title: 'Đơn xin chuyển ngành',
      description: 'Biểu mẫu đơn xin chuyển ngành học',
      category: 'hoc-tap',
      date: '25/02/2024',
      size: '118 KB',
      fileType: 'DOCX',
      icon: '🔄'
    },
    {
      id: 8,
      title: 'Đơn xin thôi học',
      description: 'Biểu mẫu đơn xin thôi học có lý do',
      category: 'hanh-chinh',
      date: '20/02/2024',
      size: '92 KB',
      fileType: 'PDF',
      icon: '🚪'
    },
    {
      id: 9,
      title: 'Đơn xin học lại',
      description: 'Biểu mẫu đơn xin đăng ký học lại môn học',
      category: 'hoc-tap',
      date: '15/02/2024',
      size: '105 KB',
      fileType: 'DOCX',
      icon: '🔁'
    },
    {
      id: 10,
      title: 'Đơn xin cấp bảng điểm',
      description: 'Biểu mẫu đơn xin cấp bảng điểm tích lũy',
      category: 'hanh-chinh',
      date: '10/02/2024',
      size: '88 KB',
      fileType: 'PDF',
      icon: '📊'
    },
    {
      id: 11,
      title: 'Đơn xin trả nợ học phí',
      description: 'Biểu mẫu đơn xin gia hạn thời gian đóng học phí',
      category: 'tai-chinh',
      date: '05/02/2024',
      size: '98 KB',
      fileType: 'DOCX',
      icon: '💳'
    },
    {
      id: 12,
      title: 'Đơn xin xác nhận tốt nghiệp',
      description: 'Biểu mẫu đơn xin xác nhận đủ điều kiện tốt nghiệp',
      category: 'hanh-chinh',
      date: '01/02/2024',
      size: '112 KB',
      fileType: 'PDF',
      icon: '🎓'
    }
  ]);

  // Filter forms
  const filteredForms = forms.filter(form => {
    const matchCategory = selectedCategory === 'all' || form.category === selectedCategory;
    const matchSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       form.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleDownload = (form) => {
    alert(`Đang tải xuống: ${form.title}`);
    // Xử lý tải xuống file
  };

  const handleView = (form) => {
    alert(`Xem trước: ${form.title}`);
    // Xử lý xem trước file
  };

  const handleSearch = () => {
    // Search is already handled by filteredForms
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="bieumau-container">
      <div className="bieumau-content">
        
        {/* Search Section */}
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm biểu mẫu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn-search" onClick={handleSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="categories-section">
          <h3 className="categories-title">Danh mục:</h3>
          <div className="categories-list">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📭</div>
            <div>Không tìm thấy biểu mẫu nào</div>
          </div>
        ) : (
          <div className="forms-grid">
            {filteredForms.map(form => (
              <div key={form.id} className="form-card">
                <div className="form-icon">{form.icon}</div>
                <div className="form-title">{form.title}</div>
                <div className="form-description">{form.description}</div>
                <div className="form-meta">
                  <div className="form-date">
                    📅 {form.date}
                  </div>
                  <div className="form-size">{form.size}</div>
                </div>
                <div className="form-actions">
                  <button className="btn-view" onClick={() => handleView(form)}>
                    Xem
                  </button>
                  <button className="btn-download" onClick={() => handleDownload(form)}>
                    Tải xuống
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BieuMau
