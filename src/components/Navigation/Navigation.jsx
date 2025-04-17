import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./Navigation.css";

const MagnetButton = ({ children, className = "", onClick }) => {
  const ref = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-20, 20], [10, -10]);
  const rotateY = useTransform(x, [-20, 20], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`nav-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x,
        y,
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

const Navigation = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = document.querySelector(".navigation").offsetHeight;
      element.style.scrollMarginTop = `${navHeight}px`;
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <MagnetButton onClick={() => scrollToSection("inicio")}>
          Inicio
        </MagnetButton>
        <MagnetButton onClick={() => scrollToSection("proyectos")}>
          Proyectos
        </MagnetButton>
        <MagnetButton onClick={() => scrollToSection("Formacion")}>
          Formacion
        </MagnetButton>
        <MagnetButton onClick={() => scrollToSection("experience")}>
          Experiencia Laboral
        </MagnetButton>
        <MagnetButton onClick={() => scrollToSection("recruiters")}>
          Recruiters 🤖
        </MagnetButton>
      </div>
    </nav>
  );
};

export default Navigation;
