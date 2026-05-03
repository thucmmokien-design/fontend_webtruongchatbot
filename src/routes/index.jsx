import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import RegainPassword from '../pages/RegainPassword';
import Home from '../pages/Home';
import ThongBao from '../pages/ThongBao';
import LichHoc from '../pages/LichHoc';
import LichThi from '../pages/LichThi';
import ThongTinCaNhan from '../pages/ThongTinCaNhan';
import KetQuaHocTap from '../pages/KetQuaHocTap';
import DangKyMonHoc from '../pages/DangKyMonHoc';
import TaiChinh from '../pages/TaiChinh';
import ThanhToan from '../pages/ThanhToan';
import BieuMau from '../pages/BieuMau';
import HoTroAi from '../pages/HoTroAi';
import DoiMatKhau from '../pages/DoiMatKhau';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path='/' element={<Landing />} />
      <Route path='/account' element={<Login />} />
      <Route path='/regainPassword' element={<RegainPassword />} />
      
      {/* Protected routes */}
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard/home" replace />} />
        <Route path='home' element={<Home />} />
        <Route path='thong-bao' element={<ThongBao />} />
        <Route path='lich-hoc' element={<LichHoc />} />
        <Route path='lich-thi' element={<LichThi />} />
        <Route path='profile' element={<ThongTinCaNhan />} />
        <Route path='ket-qua' element={<KetQuaHocTap />} />
        <Route path='dang-ky' element={<DangKyMonHoc />} />
        <Route path='tai-chinh' element={<TaiChinh />} />
        <Route path='thanh-toan' element={<ThanhToan />} />
        <Route path='bieu-mau' element={<BieuMau />} />
        <Route path='ai' element={<HoTroAi />} />
      </Route>
      
      {/* Change password - Protected but without MainLayout */}
      <Route path='/change-password' element={
        <ProtectedRoute>
          <DoiMatKhau />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
