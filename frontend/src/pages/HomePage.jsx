import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./HomePage.css";
import {
  FaSeedling,
  FaTractor,
  FaLeaf,
  FaRobot,
  FaHandsHelping,
  FaBookOpen,
  FaTools,
} from "react-icons/fa";

// Local image imports
import slide1 from "../components/images/slide1.jpg";
import slide2 from "../components/images/slide2.jpg";
import slide3 from "../components/images/slide3.jpg";
import slide4 from "../components/images/slide4.jpg";
import educateImg from "../components/images/educate.png";
import empowerImg from "../components/images/empower.png";
import toolsImg from "../components/images/tools.png";

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Heading */}
      <h1 className="home-heading">
        <FaSeedling /> Welcome to the Agriculture Instructor Dashboard
      </h1>

      {/* Carousel Section */}
      <div className="carousel-wrapper">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          showStatus={false}
          interval={4000}
        >
          <div>
            <img src={slide1} alt="Farming Education" />
            <p className="legend">Empowering Farmers with Knowledge</p>
          </div>
          <div>
            <img src={slide2} alt="Modern Agriculture" />
            <p className="legend">Modern Techniques in Agriculture</p>
          </div>
          <div>
            <img src={slide3} alt="Eco Farming" />
            <p className="legend">Eco-Friendly Farming Practices</p>
          </div>
          <div>
            <img src={slide4} alt="AI in Agriculture" />
            <p className="legend">AI Tools for Smarter Farming</p>
          </div>
        </Carousel>
      </div>

      {/* Information Cards Section */}
      <div className="info-cards-grid">
        <div className="info-card">
          <img src={educateImg} alt="Educate" className="info-image" />
          <div className="info-content">
            <FaBookOpen className="info-icon" />
            <h3>Educate Farmers</h3>
            <p>Deliver structured knowledge through agri-courses & workshops.</p>
          </div>
        </div>

        <div className="info-card">
          <img src={empowerImg} alt="Empower" className="info-image" />
          <div className="info-content">
            <FaHandsHelping className="info-icon" />
            <h3>Empower Communities</h3>
            <p>Support rural communities with hands-on support and guidance.</p>
          </div>
        </div>

        <div className="info-card">
          <img src={toolsImg} alt="Tools" className="info-image" />
          <div className="info-content">
            <FaTools className="info-icon" />
            <h3>Smart Farming Tools</h3>
            <p>Leverage tools & analytics for modern agricultural efficiency.</p>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="features-section">
        <div className="feature-card">
          <FaSeedling className="icon" />
          <p className="feature-title">Organic Practices</p>
          <p>Learn sustainable and organic farming methods to boost yields.</p>
        </div>
        <div className="feature-card">
          <FaTractor className="icon" />
          <p className="feature-title">Modern Machinery</p>
          <p>Explore automation and tools for efficient cultivation.</p>
        </div>
        <div className="feature-card">
          <FaLeaf className="icon" />
          <p className="feature-title">Agri-Courses</p>
          <p>Access structured training for various crops and seasons.</p>
        </div>
        <div className="feature-card">
          <FaRobot className="icon" />
          <p className="feature-title">AI Integration</p>
          <p>Use AI for soil analysis, weather updates & pest detection.</p>
        </div>
      </div>
    </div>
  );
}