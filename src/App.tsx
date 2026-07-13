import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function App() {
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const sections = document.querySelectorAll(".section-scroll");
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px", // Trigger when the section dominates the center view
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
    
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-blueprint-bg relative selection:bg-blueprint-teal/20 selection:text-blueprint-teal">
      {/* Navbar with scroll-spy activeState tracker */}
      <Navbar activeSection={activeSection} />
      
      {/* Sections flowing in sequence */}
      <main className="flex-grow">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {/* Footer detailing project status & credits */}
      <Footer />
    </div>
  );
}

export default App;
