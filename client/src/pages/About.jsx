import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

function About({ isEmbedded }) {
  const navigate = useNavigate();

  return (
    <div className={`about-section ${isEmbedded ? "embedded" : ""}`}>
      <div className="about-content">
        <h3 className="about-title">About</h3>
        <h2 className="about-brand">Evangadi Networks</h2>
        <p className="about-text">
          No matter what stage of life you are in, whether you're just starting
          elementary school or being promoted to CEO of a Fortune 500 company,
          you have much to offer to those who are trying to follow in your
          footsteps.
        </p>
        <p className="about-text">
          Whether you are willing to share your knowledge or you are just
          looking to meet mentors of your own, please start by joining the
          network here.
        </p>
        <button className="about-btn" onClick={() => navigate("/howitworks")}>
          HOW IT WORKS
        </button>
      </div>
    </div>
  );
}

export default About;
