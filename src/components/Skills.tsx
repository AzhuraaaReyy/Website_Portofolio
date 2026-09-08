import { 
  Cpu, 
  Layers, 
  Database, 
  Wrench, 
  Terminal, 
  Crosshair, 
  Sparkles,
  Code2,
  Server,
  Palette,
  Box,
  Zap,
  HardDrive,
  Boxes,
  GitBranch,
  Cloud,
  ShieldCheck,
  Layout
} from "lucide-react";
import { skillsData, type Skill, type SkillCategory } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { AmbientBackground } from "./ui/AmbientBackground";

// --- REUSABLE HELPER COMPONENTS ---

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Bahasa Pemrograman":
      return <Terminal className="w-5 h-5 text-blueprint-teal drop-shadow-[0_0_5px_rgba(94,234,212,0.8)]" />;
    case "Frontend Development":
      return <Layers className="w-5 h-5 text-blueprint-teal drop-shadow-[0_0_5px_rgba(94,234,212,0.8)]" />;
    case "Backend Development":
      return <Cpu className="w-5 h-5 text-blueprint-teal drop-shadow-[0_0_5px_rgba(94,234,212,0.8)]" />;
    case "Database Systems":
      return <Database className="w-5 h-5 text-blueprint-amber drop-shadow-[0_0_5px_rgba(245,183,84,0.8)]" />;
    case "Tools & Deployment":
    default:
      return <Wrench className="w-5 h-5 text-blueprint-text drop-shadow-[0_0_5px_rgba(232,236,241,0.5)]" />;
  }
};

const getSkillIcon = (skillName: string) => {
  const name = skillName.toLowerCase();
  if (name.includes("html") || name.includes("javascript") || name.includes("typescript") || name.includes("c++") || name.includes("python")) {
    return <Code2 className="w-4 h-4 opacity-70 flex-shrink-0" />;
  }
  if (name.includes("react") || name.includes("next")) return <Layout className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("tailwind") || name.includes("bootstrap")) return <Palette className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("three")) return <Box className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("laravel") || name.includes("php")) return <Server className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("api") || name.includes("graphql")) return <Zap className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("postgres") || name.includes("mongo") || name.includes("mysql") || name.includes("redis")) return <HardDrive className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("docker")) return <Boxes className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("git")) return <GitBranch className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("aws") || name.includes("vercel") || name.includes("netlify")) return <Cloud className="w-4 h-4 opacity-70 flex-shrink-0" />;
  if (name.includes("linux") || name.includes("bash")) return <Terminal className="w-4 h-4 opacity-70 flex-shrink-0" />;
  return <ShieldCheck className="w-4 h-4 opacity-70 flex-shrink-0" />;
};

const getRarityStyles = (level: string) => {
  switch (level) {
    case "Mahir":
      return {
        tier: "S-TIER",
        color: "text-blueprint-amber",
        bg: "bg-blueprint-amber/10",
        border: "border-blueprint-amber/30 hover:border-blueprint-amber/60",
        dot: "bg-blueprint-amber animate-pulse shadow-[0_0_8px_#F5B754]"
      };
    case "Menengah":
      return {
        tier: "A-TIER",
        color: "text-blueprint-teal",
        bg: "bg-blueprint-teal/10",
        border: "border-blueprint-teal/30 hover:border-blueprint-teal/60",
        dot: "bg-blueprint-teal"
      };
    case "Dasar":
    default:
      return {
        tier: "B-TIER",
        color: "text-blueprint-textSec",
        bg: "bg-blueprint-bgSec",
        border: "border-blueprint-teal/10 hover:border-blueprint-teal/30",
        dot: "bg-blueprint-textSec"
      };
  }
};

/** Reusable Chip Component for individual skills */
const SkillItem = ({ skill, variants }: { skill: Skill; variants: Variants }) => {
  const rarity = getRarityStyles(skill.level);

  return (
    <motion.div
      variants={variants}
      className={`group/chip relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2.5 border rounded-sm transition-all duration-300 overflow-hidden cursor-default w-full ${rarity.bg} ${rarity.border}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/chip:animate-[shimmer_1.5s_infinite]" />

      <div className="flex items-center gap-2.5 relative z-10">
        <div className={`flex items-center justify-center p-1 rounded-sm bg-blueprint-bgSec/50 ${rarity.color}`}>
          {getSkillIcon(skill.name)}
        </div>
        <span className={`font-display font-bold text-sm tracking-wide ${rarity.color} group-hover/chip:text-white transition-colors drop-shadow-md`}>
          {skill.name}
        </span>
      </div>
      
      <div className="flex items-center gap-2 relative z-10">
        <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-current rounded-sm opacity-80 ${rarity.color}`}>
          {rarity.tier}
        </span>
        {rarity.tier === "S-TIER" && (
          <Sparkles className="w-3.5 h-3.5 text-blueprint-amber opacity-70" />
        )}
      </div>
    </motion.div>
  );
};

/** Reusable Card Component for categories */
const ArsenalCategoryCard = ({ category, index, cardVariants, chipVariants }: { category: SkillCategory; index: number; cardVariants: Variants; chipVariants: Variants }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col h-full bg-blueprint-bgSec/60 backdrop-blur-md border border-blueprint-teal/20 rounded p-6 hover:border-blueprint-teal/40 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.2)] group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blueprint-teal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-blueprint-teal/10">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] text-blueprint-teal/50 tracking-widest uppercase">
            GEAR_CLASS // 0{index + 1}
          </span>
          <h3 className="font-display font-bold text-lg text-blueprint-text tracking-wide group-hover:text-blueprint-teal transition-colors drop-shadow-sm">
            {category.title}
          </h3>
        </div>
        <div className="p-2.5 bg-blueprint-bgSec border border-blueprint-teal/20 rounded-md">
          {getCategoryIcon(category.title)}
        </div>
      </div>

      {/* Skills Grid - Single column stacked layout */}
      <div className="flex flex-col gap-3 flex-grow">
        {category.skills.map((skill, sIdx) => (
          <SkillItem key={sIdx} skill={skill} variants={chipVariants} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-blueprint-teal/10 flex justify-between items-center font-mono text-[9px] text-blueprint-textSec">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blueprint-teal/50 block rounded-full" />
          MODULE_STABLE
        </span>
        <span className="tracking-widest opacity-60">SYS_V4</span>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---

export function Skills() {
  const reducedMotion = useReducedMotion();

  const allSkills = skillsData.flatMap((category) => category.skills);
  const totalSkills = allSkills.length;
  const sTierCount = allSkills.filter((s) => s.level === "Mahir").length;
  const aTierCount = allSkills.filter((s) => s.level === "Menengah").length;
  const bTierCount = allSkills.filter((s) => s.level === "Dasar").length;

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.08 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const chipVariants: Variants = {
    hidden: { opacity: 0, x: reducedMotion ? 0 : -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <section id="skills" className="py-24 bg-blueprint-bg relative section-scroll overflow-hidden border-t border-blueprint-teal/20">
      <AmbientBackground glowIntensity={0.2} parallaxSpeed={0.8} circuitVariant={2} />
      <div className="absolute inset-0 z-0 bg-blueprint-bg/90 backdrop-blur-[1px] blueprint-grid bg-grid-size opacity-30 mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header & HUD Summary */}
        <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-blueprint-teal/15">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="font-mono font-bold text-xs tracking-widest text-blueprint-teal mb-4 px-3 py-1 bg-blueprint-teal/10 border-l-4 border-blueprint-teal inline-flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5" />
              ARSENAL // INVENTORY_MATRIX
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-blueprint-text tracking-tight uppercase italic skew-x-[-5deg]">
              LOADOUT SPECS
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 bg-blueprint-bgSec border border-blueprint-teal/20 rounded-sm flex items-center gap-2">
              <span className="text-blueprint-textSec">TOTAL_GEAR:</span>
              <span className="text-blueprint-teal font-bold">{totalSkills}</span>
            </div>
            <div className="px-3 py-1.5 bg-blueprint-amber/10 border border-blueprint-amber/30 rounded-sm flex items-center gap-2">
              <span className="text-blueprint-amber font-bold">S-TIER: {sTierCount}</span>
            </div>
            <div className="px-3 py-1.5 bg-blueprint-teal/10 border border-blueprint-teal/30 rounded-sm flex items-center gap-2">
              <span className="text-blueprint-teal font-bold">A-TIER: {aTierCount}</span>
            </div>
            <div className="px-3 py-1.5 bg-blueprint-bgSec border border-blueprint-textSec/20 rounded-sm flex items-center gap-2">
              <span className="text-blueprint-textSec font-bold">B-TIER: {bTierCount}</span>
            </div>
          </div>
        </div>

        {/* Categories Grid - Clean Alignments */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {skillsData.map((category, idx) => (
            <ArsenalCategoryCard 
              key={idx} 
              category={category} 
              index={idx} 
              cardVariants={cardVariants} 
              chipVariants={chipVariants} 
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}