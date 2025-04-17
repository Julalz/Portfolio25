import "./App.css";
import GradientBackground from "./components/GradientBackground";
import AnimatedText from "./components/AnimatedText/AnimatedText";
import Navigation from "./components/Navigation/Navigation";
import RecruiterChat from "./components/RecruiterChat/RecruiterChat";
import Slider from "./components/Slider-projects/Slider-projects";
import { useEffect } from "react";
import Education from "./components/Education/Education";
import Experience from "./components/WorkExperience/WorkExperience";
import SectionIndicator from "./components/SectionIndicator/SectionIndicator";

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden" id="inicio">
      <GradientBackground />
      <Navigation />
      <SectionIndicator />
      <AnimatedText />
      <section id="recruiters" className="section">
        <p className="chat-description">
          Este chat usa inteligencia artificial para responder preguntas sobre
          mi perfil profesional. Está conectado a mi CV y puede darte info clara
          y directa sobre mi experiencia, habilidades, proyectos y más. Ideal si
          querés conocerme sin leer todo el documento.
        </p>
        <RecruiterChat />
      </section>
      <section id="proyectos" className="section">
        <Slider />
      </section>

      <section id="Formacion" className="section">
        <Education />
      </section>

      <section id="experience" className="section">
        <Experience />
      </section>
      <section id="footer" className="section">
        Hecho con ❤ por Juli Alz
      </section>
      <div className="julianime-container">
        <p>
          <SectionIndicator />
        </p>
        <img
          src="/images/JuliAnime.png"
          alt="JuliAnime"
          className="julianime-image"
        />
      </div>
    </div>
  );
}

export default App;
