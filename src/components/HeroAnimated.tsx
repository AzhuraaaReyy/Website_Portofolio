import { motion, type Variants } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { profileData } from "../data/portfolioData";

interface HeroAnimatedProps {
  reducedMotion: boolean;
}

export function HeroAnimated({ reducedMotion }: HeroAnimatedProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const handleScrollToProjects = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const projectsSection = document.querySelector("#projects");
    if (projectsSection) {
      const offset = 80;
      const elementPosition = projectsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToContact = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      const offset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center w-full"
    >
      {/* Top Status Badge (Professional Title) */}
      <motion.div
        variants={itemVariants}
        className="font-display font-black text-xs tracking-widest text-blueprint-bg bg-blueprint-amber px-6 py-1.5 skew-x-[-15deg] mb-6 shadow-[0_0_15px_rgba(245,183,84,0.4)]"
      >
        <span className="skew-x-[15deg] block">
          [{profileData.role.toUpperCase()}]
        </span>
      </motion.div>

      {/* Futuristic Professional Heading */}
      <motion.div
        variants={itemVariants}
        className="relative mb-6 group cursor-default"
      >
        {/* Solid Glow Text (First word) */}
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-blueprint-teal italic leading-none tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(94,234,212,0.6)] transition-all">
          {profileData.role.split(" ")[0]}
        </h1>
        {/* Solid Glow Text (Second word) */}
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-white italic -mt-5 md:-mt-8 lg:-mt-12 leading-none tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
          {profileData.role.split(" ").slice(1).join(" ")}
        </h1>
      </motion.div>

      {/* Subtitle / Professional Mission Statement */}
      <motion.p
        variants={itemVariants}
        className="font-sans font-medium text-sm md:text-base text-blueprint-textSec max-w-xl mx-auto mb-10 bg-blueprint-bgSec/50 p-4 border-l-4 border-blueprint-teal backdrop-blur-sm"
      >
        "Fokus membangun solusi web fullstack end-to-end dari arsitektur
        backend yang stabil hingga antarmuka frontend yang responsif,
        presisi, dan intuitif."
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md"
      >
        <a
          href="#projects"
          onClick={handleScrollToProjects}
          className="group relative flex-1 bg-blueprint-teal text-blueprint-bg font-display font-black text-sm px-8 py-4 skew-x-[-10deg] hover:bg-white transition-all shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center justify-center"
        >
          <span className="skew-x-[10deg] flex items-center gap-2">
            LIHAT PROYEK
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </a>
        <a
          href="#contact"
          onClick={handleScrollToContact}
          className="group relative flex-1 bg-blueprint-bgSec/80 backdrop-blur-sm text-blueprint-text border-2 border-blueprint-teal/40 font-display font-bold text-sm px-8 py-4 skew-x-[-10deg] hover:border-blueprint-teal hover:text-blueprint-teal hover:bg-blueprint-teal/10 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <span className="skew-x-[10deg]">HUBUNGI SAYA</span>
        </a>
      </motion.div>
    </motion.div>
  );
}
