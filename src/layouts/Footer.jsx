import React from "react";
// import { useEffect } from "react";
import '../assets/css/layout/Footer.css';
import { Row, Col } from "react-bootstrap";
import RocketLeft from '../assets/images/footer/Rocket-Left.png';
import RocketRight from '../assets/images/footer/Rocket-Right.png';
import FbLogo from '../assets/images/footer/logos/Facebook.svg'
import InstaLogo from '../assets/images/footer/logos/Instagram.svg'
import LnLogo from '../assets/images/footer/logos/Linked In.svg'
import TwLogo from '../assets/images/footer/logos/Twiter.svg'
import WhLogo from '../assets/images/footer/logos/Whatsapp.svg'
import YtLogo from '../assets/images/footer/logos/Youtube.svg'

const Footer = () => {
  return (
    <footer className="mt-auto footer">
      <Row className="justify-content-center">
        <Col sm={6} md={3}>
          <img src={RocketRight} className="img-fluid rocket-left" alt="Rocket" />
        </Col>

        <Col sm={6} md={2} className="m-auto">
          <li>About Us</li>
          <li>Blog</li>
          <li>Jobs</li>
          <li>Press</li>
          <li>Partners</li>
          <li>User Reviews</li>
        </Col>

        <Col sm={6} md={4} className="footer-logo-copyright">
          <center>
          <h1>Logo</h1>
          <div className="social-icons">
              <img className="img-fluid me-2" src={FbLogo} alt="Facebook" />
              <img className="img-fluid me-2" src={InstaLogo} alt="Instagram" />
              <img className="img-fluid me-2" src={LnLogo} alt="Linked In" />
              <img className="img-fluid me-2" src={YtLogo} alt="Youtube" />
              <img className="img-fluid me-2" src={WhLogo} alt="Whats App" />
              <img className="img-fluid" src={TwLogo} alt="Twitter" />
          </div>
          <p>Follow Us On</p>
          <p>Copyright © 2023 Logo. All rights reserved.</p>
          </center>
        </Col>

        <Col sm={6} md={3} className="text-end">
          <div className="input-group mb-3 news-letter">
            <input type="text" className="form-control" placeholder="EMAIL FOR NEWS LETTER" aria-label="Recipient's username" aria-describedby="button-addon2" />
            <button className="btn btn-warning" type="button" id="button-addon2">Send</button>
          </div>
          <img className="img-fluid rocket-right" src={RocketLeft} alt="Rocket" />
        </Col>
      </Row>

    </footer>
  );
};

export default Footer;
