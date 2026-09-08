import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Mail, MessageSquare, ArrowUpRight, Wifi, ShieldAlert } from "lucide-react";
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

  // Contact channel blocks - Game Lobby Invite Style
  const channels = [
    {
      icon: <Mail className="w-5 h-5 text-blueprint-teal drop-shadow-[0_0_5px_rgba(94,234,212,0.8)]" />,
      label: "SECURE_MAIL_NODE",
      title: "TRANSMIT_EMAIL",
      value: "azhurahman@gmail.com",
      href: profileData.email,
      desc: "Kirim pesan terenkripsi untuk undangan misi utama (pekerjaan/magang).",
      status: "ONLINE",
      color: "text-blueprint-teal",
      borderColor: "border-blueprint-teal",
      hoverBg: "hover:bg-blueprint-teal/10"
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-blueprint-amber drop-shadow-[0_0_5px_rgba(245,183,84,0.8)]" />,
      label: "DIRECT_COMMS",
      title: "PING_WHATSAPP",
      value: "+62 831-6225-3730",
      href: profileData.whatsapp,
      desc: "Ping langsung ke perangkat untuk koordinasi taktis dan fast response.",
      status: "STANDBY",
      color: "text-blueprint-amber",
      borderColor: "border-blueprint-amber",
      hoverBg: "hover:bg-blueprint-amber/10"
    },
    {
      icon: <LinkedinIcon className="w-5 h-5 text-blueprint-text drop-shadow-[0_0_5px_rgba(232,236,241,0.5)]" />,
      label: "GUILD_NETWORK",
      title: "LINKEDIN_CONNECT",
      value: "linkedin.com/in/aryazhur",
      href: profileData.linkedin,
      desc: "Kirim permintaan pertemanan ke profil guild profesional saya.",
      status: "ONLINE",
      color: "text-blueprint-text",
      borderColor: "border-blueprint-textSec",
      hoverBg: "hover:bg-blueprint-bgSec"
    }
  ];

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: reducedMotion ? 0 : 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="contact" className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/20 overflow-hidden">
      <AmbientBackground glowIntensity={0.3} parallaxSpeed={0.7} circuitVariant={1} />

      {/* Hex/Grid HUD Overlay */}
      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-20 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(94,234,212,0.05)_0%,transparent_60%)] pointer-events-none" />

      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Headings - Lobby Style */}
        <div className="mb-16 md:mb-24 flex flex-col items-center">
          <div className="font-mono font-bold text-xs tracking-widest text-blueprint-teal mb-4 px-4 py-1.5 bg-blueprint-teal/10 border-l-4 border-blueprint-teal skew-x-[-10deg] inline-flex items-center gap-2">
            <span className="skew-x-[10deg] flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              COMMUNICATION_LINK // CO-OP_LOBBY
            </span>
          </div>
          
          <div className="relative group cursor-default text-center mb-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-transparent tracking-tighter uppercase italic skew-x-[-5deg]" style={{ WebkitTextStroke: '2px rgba(138, 147, 166, 0.15)' }}>
              ESTABLISH CONNECTION
            </h2>
            <h2 className="absolute top-0 left-0 w-full text-center text-4xl md:text-5xl lg:text-6xl font-black font-display text-blueprint-text tracking-tighter drop-shadow-[0_0_20px_rgba(232,236,241,0.2)] transition-colors duration-500 hover:text-blueprint-teal uppercase italic skew-x-[-5deg] clip-text-reveal">
              ESTABLISH CONNECTION
            </h2>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-sans text-blueprint-textSec max-w-lg text-center leading-relaxed">
              Sedang mencari member baru untuk ekspedisi sistem Anda? Kanal komunikasi saya terbuka. Kirim ping untuk merencanakan misi kolaborasi atau penawaran kerja sama.
            </p>
            <div className="px-3 py-1 border border-blueprint-teal/30 bg-blueprint-bgSec flex items-center gap-2 font-mono text-[10px] text-blueprint-teal/80">
              <ShieldAlert className="w-3 h-3 text-blueprint-teal" />
              STATUS: LFG (LOOKING_FOR_GROUP)
            </div>
          </div>
        </div>

        {/* Channels Grid (Lobby Invites) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {channels.map((channel, idx) => (
            <motion.a
              key={idx}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              variants={itemVariants}
              className={`relative flex flex-col justify-between h-full p-6 bg-blueprint-bgSec/60 backdrop-blur-md border ${channel.borderColor}/20 skew-x-[-3deg] hover:skew-x-[0deg] transition-all duration-300 group hover:border-${channel.borderColor}/60 ${channel.hoverBg} shadow-[0_5px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(0,0,0,0.5)] overflow-hidden`}
            >
              {/* Scanline Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              {/* Corner Gliphs */}
              <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${channel.borderColor}/40 group-hover:${channel.borderColor} transition-colors`} />
              <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${channel.borderColor}/40 group-hover:${channel.borderColor} transition-colors`} />

              {/* Main Content inside skewed container (Counter-skewed text for readability) */}
              <div className="skew-x-[3deg] group-hover:skew-x-[0deg] transition-all duration-300 relative z-10 flex flex-col h-full">
                
                {/* Header label & Status */}
                <div className={`flex items-center justify-between mb-8 pb-3 border-b border-blueprint-teal/10 font-mono text-[9px] uppercase tracking-widest ${channel.color}/60`}>
                  <span>{channel.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-sm animate-pulse ${channel.status === 'ONLINE' ? 'bg-blueprint-teal' : 'bg-blueprint-amber'}`} />
                    <span className={channel.status === 'ONLINE' ? 'text-blueprint-teal' : 'text-blueprint-amber'}>{channel.status}</span>
                  </div>
                </div>

                {/* Icon & Title */}
                <div className="mb-5 flex flex-col gap-4">
                  <div className={`p-3 w-fit border ${channel.borderColor}/20 bg-blueprint-bgSec/80 skew-x-[-5deg] shadow-inner`}>
                    <div className="skew-x-[5deg]">
                      {channel.icon}
                    </div>
                  </div>

                  <div>
                    <h3 className={`font-display font-black text-lg italic uppercase tracking-wider text-blueprint-text group-hover:${channel.color} transition-colors mb-1 drop-shadow-md`}>
                      {channel.title}
                    </h3>
                    <p className={`font-mono text-xs ${channel.color} font-bold opacity-80 group-hover:opacity-100 transition-opacity select-all`}>
                      &gt; {channel.value}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs font-sans text-blueprint-textSec leading-relaxed mb-6 flex-grow">
                  {channel.desc}
                </p>

                {/* Action Footer */}
                <div className={`mt-auto pt-4 border-t border-blueprint-teal/10 flex items-center justify-between font-mono text-[10px] uppercase font-bold tracking-widest ${channel.color}/50 group-hover:${channel.color} transition-colors`}>
                  <span className="flex items-center gap-1.5">
                    INITIATE_LINK
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
