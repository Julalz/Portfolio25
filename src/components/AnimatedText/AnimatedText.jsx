import React, { useState, useEffect } from "react";
import "./AnimatedText.css";

const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const titles = ["Developer Full Stack", "IA Engineer"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % titles.length);
        setIsVisible(true);
      }, 800);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animated-text-wrapper">
      <h1 className="animated-text-name">Hola, soy Julian Alzate </h1>
      <div className="animated-text-container">
        <div className={`animated-text-slide ${!isVisible ? "hidden" : ""}`}>
          <span className="animated-text-title">{titles[currentIndex]}</span>
        </div>
      </div>
      <div className="tech-wrapper"></div>
    </div>
  );
};

export default AnimatedText;
