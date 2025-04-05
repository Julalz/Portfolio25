import "./App.css";
import GradientBackground from "./components/GradientBackground";
import AnimatedText from "./components/AnimatedText/AnimatedText";
import Navigation from "./components/Navigation/Navigation";
import RecruiterChat from "./components/RecruiterChat/RecruiterChat";

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <GradientBackground />
      <Navigation />
      <AnimatedText />
      
      <section id="proyectos" className="section">
        <h2>Proyectos</h2>
      </section>

      <section id="Formacion" className="section">
        <h2>Estudios</h2>
      </section>

      <section id="quien-soy" className="section">
        <h2>Quién Soy</h2>
      </section>

      <section id="recruiters" className="section">
        <h2></h2>
        <RecruiterChat />
      </section>
    </div>
  );
}

export default App;
