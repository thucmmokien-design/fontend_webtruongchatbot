import "./Footer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../../assets/img/Logo_HAU_DH.png'
import web from '../../assets/img/website.png'
import address from '../../assets/img/address.png'
import mobile from '../../assets/img/phone.png'
import email from '../../assets/img/email.png'
import fax from '../../assets/img/fax.png'
import fackebook from '../../assets/img/facebook.png'
import google from '../../assets/img/google.png'
import twitter from '../../assets/img/twitter.png'
import linkedin from '../../assets/img/linkedin.png'
import uses from '../../assets/icon/users-svgrepo-com.svg'
import sign from '../../assets/icon/sign-in-svgrepo-com.svg'
import call from '../../assets/icon/call-svgrepo-com.svg'
import addresss from '../../assets/icon/broadcast-tower-svgrepo-com.svg'
import book from '../../assets/icon/dairy-svgrepo-com.svg'

function Footer() {
  return (
    <footer className="footer">
        <div className="row">
          <div className="col-3">
            <div className="logo"><img src={logo} alt="LoGoTruong" /></div>
          </div>
          <div className="col-5">
            <div className="contact-info-one">
                <ul>
                    <li>
                        <div className="contact_web">
                            <img src={web} alt="WebTruong" /> <span>→ <a href="http://hau.edu.vn/" target="_blank">https://hau.edu.vn/</a></span>
                        </div>
                    </li>
                    <li>
                        <div className="contact_address">
                            <img src={address} alt="" /> <span>→ Km 10, Đường Nguyễn Trãi, Quận Thanh Xuân , TP Hà Nội</span>
                        </div>
                    </li>
                    <li>
                        <div className="contact_mobile">
                            <img src={mobile} alt="" /> 
                            <span> →</span>
                            <span className="content-mobile"> +84.4.3854.4346</span>
                        </div>
                    </li>
                    <li>
                        <div className="contact_email">
                            <img src={email} alt="" /> <span>→ </span>
                        </div>
                    </li>
                    <li>
                        <div className="contact_fax">
                            <img src={fax} alt="" /> <span>→ </span>
                        </div>
                    </li>
                </ul>
            </div>
          </div>
          <div className="col-2">
            <div className="contact-info-two">
                <ul>
                    <li>
                        <div className="contact_fb">
                            <a href="#"><img src={fackebook} alt="" /></a>
                        </div>
                    </li>
                    <li>
                        <div className="contact_gg">
                            <a href="#"><img src={google} alt="" /></a>
                        </div>
                    </li>
                    <li>
                        <div className="contact_tw">
                            <a href="#"><img src={twitter} alt="" /></a>
                        </div>
                    </li>
                    <li>
                        <div className="contact_ld">
                            <a href="#"><img src={linkedin} alt="" /></a>
                        </div>
                    </li>
                </ul>
            </div>
          </div>
          <div className="col-2">
            <div className="contact-info-three">
                <div className="contact-top">Thống kê truy cập</div>
                <div className="contact_bottom">
                    <ul>
                        <li><img src={uses} alt="" /> Đang online</li>
                        <li><img src={sign} alt="" /> Tổng truy cập</li>
                    </ul>
                </div>
            </div>
          </div>
          <hr />
        </div>
    </footer>
  );
}

export default Footer;
