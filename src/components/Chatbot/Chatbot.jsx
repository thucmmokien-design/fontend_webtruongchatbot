import { useState, useRef } from 'react'
import './Chatbot.css'
import logoChatbot from '../../assets/img/logochatbot.jpg'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! Tôi có thể giúp gì cho bạn?', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsExpanded(false); // Reset expanded state when closing
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '' && !selectedFile) return;

    // Thêm tin nhắn của user
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      file: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      } : null
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setSelectedFile(null);

    // Giả lập phản hồi từ bot
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('lịch học') || lowerMessage.includes('lich hoc')) {
      return 'Bạn có thể xem lịch học tại menu "Lịch học" bên trái. Bạn cần chọn học kỳ và năm học để xem lịch chi tiết.';
    }
    if (lowerMessage.includes('điểm') || lowerMessage.includes('diem')) {
      return 'Để xem điểm, bạn vào menu "Kết quả học tập". Hệ thống sẽ hiển thị tất cả điểm của bạn.';
    }
    if (lowerMessage.includes('học phí') || lowerMessage.includes('hoc phi')) {
      return 'Thông tin học phí có tại menu "Tài chính". Bạn có thể xem chi tiết và thanh toán online.';
    }
    if (lowerMessage.includes('đăng ký') || lowerMessage.includes('dang ky')) {
      return 'Bạn có thể đăng ký môn học tại menu "Đăng ký môn học". Vui lòng chọn học kỳ và năm học trước.';
    }
    if (lowerMessage.includes('biểu mẫu') || lowerMessage.includes('bieu mau')) {
      return 'Các biểu mẫu có sẵn tại menu "Biểu mẫu". Bạn có thể tải xuống các mẫu đơn cần thiết.';
    }
    
    return 'Cảm ơn bạn đã liên hệ. Tôi có thể giúp bạn về: Lịch học, Điểm số, Học phí, Đăng ký môn học, Biểu mẫu. Bạn cần hỗ trợ gì?';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      {/* Chatbot Button */}
      <div className={`chatbot-button ${isOpen ? 'active' : ''}`} onClick={toggleChat}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <img src={logoChatbot} alt="Chatbot" className="chatbot-logo" />
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className={`chatbot-window ${isExpanded ? 'expanded' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <img src={logoChatbot} alt="Bot Avatar" className="avatar-img" />
              </div>
              <div>
                <div className="chatbot-title">Trợ lý ảo HAU</div>
                <div className="chatbot-status">Đang hoạt động</div>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button 
                className="chatbot-expand" 
                onClick={toggleExpand}
                title={isExpanded ? "Thu nhỏ" : "Phóng to"}
              >
                {isExpanded ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                  </svg>
                )}
              </button>
              <button className="chatbot-close" onClick={toggleChat}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  {message.text}
                  {message.file && (
                    <div className="message-file">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      <div className="file-info">
                        <div className="file-name">{message.file.name}</div>
                        <div className="file-size">{formatFileSize(message.file.size)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            {selectedFile && (
              <div className="selected-file-preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span>{selectedFile.name}</span>
                <button type="button" onClick={() => setSelectedFile(null)} className="remove-file-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            <div className="input-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                accept="image/*,.pdf,.doc,.docx"
              />
              <button 
                type="button" 
                className="chatbot-attach-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
              <input
                type="text"
                className="chatbot-input"
                placeholder="Nhập tin nhắn..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit" className="chatbot-send-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default Chatbot
