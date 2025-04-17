import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SectionIndicator = () => {
  const [currentSection, setCurrentSection] = useState("");

  const getSectionInfo = (sectionId) => {
    switch (sectionId) {
      case "Formacion":
        return { icon: "🎓", text: "Estas en Formación Académica" };
      case "experience":
        return { icon: "💼", text: "Ahora Experiencia Laboral" };
      case "proyectos":
        return { icon: "🚀", text: "Echalandole un vistazo a Proyectos" };
      case "recruiters":
        return { icon: "💬", text: "Chatea con el Cv de Juli" };
      default:
        return { icon: "", text: sectionId };
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            console.log("Sección visible:", sectionId);
            setCurrentSection(sectionId);
          }
        });
      },
      {
        threshold: 1,
      }
    );

    const sections = ["Formacion", "experience", "proyectos", "recruiters"];
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  if (!currentSection) return null;

  const { icon, text } = getSectionInfo(currentSection);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute -top-20 left-4 z-[1000] max-w-[200px]"
    >
      <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium flex items-center gap-2 line-clamp-2">
          <span>{icon}</span>
          <span>{text}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default SectionIndicator;
