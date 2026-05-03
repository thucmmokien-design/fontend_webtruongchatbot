import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = authService.getToken();
  
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      try {
        const response = await authService.introspect(token);
        
        if (response.result.valid) {
          setIsAuthenticated(true);
        } else {
          authService.logout();
          setIsAuthenticated(false);
        }
      } catch (error) {
        authService.logout();
        setIsAuthenticated(false);
      }
    };
    
    validateToken();
  }, [token]);
  
  // Đang kiểm tra token
  if (isAuthenticated === null) {
    return <div style={{textAlign: 'center', padding: '50px'}}>Đang kiểm tra quyền truy cập...</div>;
  }
  
  // Chưa đăng nhập hoặc token không hợp lệ
  if (!isAuthenticated) {
    return <Navigate to="/account" replace />;
  }
  
  // Đã đăng nhập và token hợp lệ
  return children;
};

export default ProtectedRoute;
