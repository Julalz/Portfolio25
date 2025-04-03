import "./App.css";
import GradientBackground from "./components/GradientBackground";
import AnimatedText from "./components/AnimatedText/AnimatedText";

function App() {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <GradientBackground />
      <AnimatedText />
    </div>
  );
}

export default App;
