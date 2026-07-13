import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Mail, MessageSquare, Terminal, ArrowUpRight } from "lucide-react";
import { profileData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Contact() {
  const reducedMotion = useReducedMotion();

  // Contact channel blocks
  const channels = [
    {
      icon: <Mail className="w-5 h-5 text-blueprint-teal" />,
      label: "EMAIL_NODE",
      title: "Kirim Surat Elektronik",
      value: "azhurahman@gmail.com",
      href: profileData.email,
      desc: "Untuk penawaran kerja sama formal, lowongan pekerjaan, atau magang."
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-blueprint-teal" />,
      label: "WA_NODE",
      title: "Chat via WhatsApp",
      value: "+62 812-3456-789",
      href: profileData.whatsapp,
      desc: "Respon lebih cepat untuk diskusi santai atau pertanyaan singkat."
    },
    {
      icon: <LinkedinIcon className="w-5 h-5 text-blueprint-teal" />,
      label: "LNK_NODE",
      title: "Hubungkan di LinkedIn",
      value: "linkedin.com/in/aryazhur",
      href: profileData.linkedin,
      desc: "Mari terhubung secara profesional dan berbagi wawasan teknologi."
    }
  ];

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.12
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: reducedMotion ? 0 : 25 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as any }
    }
  };

  return (
    <section id="contact" className="py-24 bg-blueprint-bgSec/30 relative section-scroll border-t border-blueprint-teal/10 overflow-hidden">
      {/* Ambient background animations */}
      <AmbientBackground glowIntensity={0.55} parallaxSpeed={0.7} circuitVariant={1} />

      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Section Headings */}
        <div className="mb-16 text-center flex flex-col items-center">
          <div className="font-mono text-xs uppercase tracking-widest text-blueprint-teal mb-2">
            SEC.06 — KONTAK
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-blueprint-text">
            Tertarik Merekrut Saya?
          </h2>
          <div className="w-16 h-1 bg-blueprint-teal mt-4 shadow-[0_0_8px_#5EEAD4]" />
          <p className="text-sm text-blueprint-textSec max-w-lg mt-6 leading-relaxed">
            Kotak masuk saya selalu terbuka. Saya selalu bersemangat membahas proyek baru, kontribusi open source, atau peluang kerja magang/full-time.
          </p>
        </div>

        {/* Channels Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {channels.map((channel, idx) => (
            <motion.a
              key={idx}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              variants={itemVariants}
              className="border border-blueprint-teal/10 bg-blueprint-bgSec/80 p-6 rounded flex flex-col justify-between hover:border-blueprint-teal/30 hover:shadow-[0_8px_30px_rgba(94,234,212,0.04)] transition-all duration-300 group"
            >
              <div>
                {/* Header label */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-blueprint-teal/5 font-mono text-[9px] text-blueprint-teal/50">
                  <span>CHANNEL // {channel.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blueprint-teal" />
                </div>

                <div className="mb-4 p-2.5 w-fit border border-blueprint-teal/10 bg-blueprint-bg/50 rounded">
                  {channel.icon}
                </div>

                <h3 className="font-display font-semibold text-base text-blueprint-text group-hover:text-blueprint-teal transition-colors mb-1.5">
                  {channel.title}
                </h3>
                
                <p className="font-mono text-xs text-blueprint-teal mb-4 select-all">
                  {channel.value}
                </p>

                <p className="text-[11px] text-blueprint-textSec leading-relaxed">
                  {channel.desc}
                </p>
              </div>

              {/* Layout footer detail */}
              <div className="mt-8 pt-3 border-t border-dashed border-blueprint-teal/5 flex items-center gap-1.5 font-mono text-[8px] text-blueprint-teal/30">
                <Terminal className="w-3 h-3 text-blueprint-teal/40" />
                <span>SYS_ROUTE_RESOLVED</span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
