import { useState, useEffect } from 'react'
import './BieuMau.css'
import { bieuMauService } from '../services/bieuMauService'

const BieuMau = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Categories based on API
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Đơn từ', name: 'Đơn từ' },
    { id: 'Quy chế', name: 'Quy chế' },
    { id: 'Tài liệu', name: 'Tài liệu' }
  ];

  // Load biểu mẫu khi component mount hoặc khi thay đổi category
  useEffect(() => {
    loadBieuMau();
  }, [selectedCategory]);

  const loadBieuMau = async () => {
    setLoading(true);
    try {
      let result;
      
      if (selectedCategory === 'all') {
        result = await bieuMauService.getAllBieuMau();
      } else {
        result = await bieuMauService.getBieuMauByLoai(selectedCategory);
      }
      
      console.log('Biểu mẫu:', result);
      
      const code = result.code || result.Code;
      if (code === 200 && result.result) {
        setForms(result.result);
      } else {
        setForms([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải biểu mẫu:', error);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter forms by search term
  const filteredForms = forms.filter(form => {
    const matchSearch = form.tenBieuMau.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (form.moTa && form.moTa.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSearch;
  });

  const getFormIcon = (loai) => {
    switch(loai) {
      case 'Đơn từ': return '📄';
      case 'Quy chế': return '📋';
      case 'Tài liệu': return '📚';
      default: return '📝';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleDownload = (form) => {
    if (form.linkDrive) {
      window.open(form.linkDrive, '_blank');
    } else {
      alert('Liên kết tải xuống không khả dụng');
    }
  };

  const handleView = (form) => {
    if (form.linkDrive) {
      // Convert Google Drive link to preview mode
      let viewLink = form.linkDrive;
      if (viewLink.includes('/file/d/')) {
        const fileId = viewLink.split('/file/d/')[1].split('/')[0];
        viewLink = `https://drive.google.com/file/d/${fileId}/preview`;
      }
      window.open(viewLink, '_blank');
    } else {
      alert('Liên kết xem trước không khả dụng');
    }
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
        {loading ? (
          <div className="loading">Đang tải biểu mẫu...</div>
        ) : filteredForms.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📭</div>
            <div>Không tìm thấy biểu mẫu nào</div>
          </div>
        ) : (
          <div className="forms-grid">
            {filteredForms.map(form => (
              <div key={form.maBieuMau} className="form-card">
                <div className="form-icon">{getFormIcon(form.loaiBieuMau)}</div>
                <div className="form-title">{form.tenBieuMau}</div>
                <div className="form-description">{form.moTa}</div>
                <div className="form-meta">
                  <div className="form-category">
                    📂 {form.loaiBieuMau}
                  </div>
                  <div className="form-date">
                    📅 {formatDate(form.ngayTao)}
                  </div>
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
