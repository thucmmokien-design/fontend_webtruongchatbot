import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Menu from '../components/Menu/Menu.jsx'
import Chatbot from '../components/Chatbot/Chatbot.jsx'
import { Outlet } from "react-router-dom";
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <Menu/>
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default MainLayout;