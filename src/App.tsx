import { lazy, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { LazySection } from "./components/ui/LazySection";
import { GithubStatsProvider } from "./context/GithubStatsContext";

const About = lazy(() => import("./components/About").then((m) => ({ default: m.About })));
const Skills = lazy(() => import("./components/Skills").then((m) => ({ default: m.Skills })));
const Projects = lazy(() => import("./components/Projects").then((m) => ({ default: m.Projects })));
const Stats = lazy(() => import("./components/Stats").then((m) => ({ default: m.Stats })));
const Experience = lazy(() => import("./components/Experience").then((m) => ({ default: m.Experience })));
const Contact = lazy(() => import("./components/Contact").then((m) => ({ default: m.Contact })));

function App() {
  const [activeSection, setActiveSection] = useState<string>("home");

  return (
    <GithubStatsProvider>
      <div className="min-h-screen flex flex-col bg-blueprint-bg relative selection:bg-blueprint-teal/20 selection:text-blueprint-teal">
        {/* Navbar with scroll-spy activeState tracker */}
        <Navbar activeSection={activeSection} />

        {/* Sections flowing in sequence */}
        <main className="flex-grow">
          <LazySection id="home" eager onActive={setActiveSection}>
            <Hero />
          </LazySection>
          <LazySection id="about" onActive={setActiveSection}>
            <About />
          </LazySection>
          <LazySection id="skills" onActive={setActiveSection}>
            <Skills />
          </LazySection>
          <LazySection id="projects" onActive={setActiveSection}>
            <Projects />
          </LazySection>
          <LazySection id="stats" onActive={setActiveSection}>
            <Stats />
          </LazySection>
          <LazySection id="experience" onActive={setActiveSection}>
            <Experience />
          </LazySection>
          <LazySection id="contact" minHeight="min-h-[75vh]" onActive={setActiveSection}>
            <Contact />
          </LazySection>
        </main>

        {/* Footer detailing project status & credits */}
        <Footer />
      </div>
    </GithubStatsProvider>
  );
}
export default App;