import React from "react";
import "./workExperience.css";

const Experience = () => {
  const scrollToChat = () => {
    const chatSection = document.getElementById("recruiters");
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="experiencie-container">
      <ul className="experiencie-wrapper">
        <li className="developer-wrapper">
          <h2>Programador</h2>
          <ul>
            <li>Programador Full stack en Siweb </li>
            <li>Freelance</li>
          </ul>
        </li>

        <li>
          <li>
            <h2 className="marketing-wrapper">Marketing</h2>
            <ul>
              <li>Community manager : Panchos Burritos UK</li>
              <li>Community manager : Alejandra Quintero Studio </li>
            </ul>
          </li>
        </li>
      </ul>
      <p>
        si deseas mas info, preguntale al bot{" "}
        <button onClick={scrollToChat} className="robot-button">
          🤖
        </button>
      </p>
    </div>
  );
};

export default Experience;
