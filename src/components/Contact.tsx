import { useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import {
  Mail,
  MessageSquare,
  ArrowUpRight,
  Radio,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export function Contact() {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const channels = [
    {
      id: "email",
      icon: (
        <Mail className="w-6 h-6 text-blueprint-teal drop-shadow-[0_0_8px_rgba(94,234,212,0.8)]" />
      ),
      label: "KONTAK UTAMA",
      title: "EMAIL",
      value: "muhammadrizal52@gmail.com",
      href: "mailto:muhammadrizal52@gmail.com",
      desc: "Pilihan utama untuk komunikasi terkait peluang kerja, wawancara, maupun kolaborasi profesional.",
      status: "AKTIF",
      ping: "12ms",
      color: "text-blueprint-teal",
      borderColor: "border-blueprint-teal",
      glowColor: "rgba(94, 234, 212, 0.25)",
    },
    {
      id: "whatsapp",
      icon: (
        <MessageSquare className="w-6 h-6 text-blueprint-amber drop-shadow-[0_0_8px_rgba(245,183,84,0.8)]" />
      ),
      label: "KOMUNIKASI LANGSUNG",
      title: "WHATSAPP",
      value: "+62 831-6225-3730",
      href: "https://wa.me/6283162253730",
      desc: "Cocok untuk komunikasi singkat, koordinasi wawancara, atau pembahasan awal terkait pekerjaan.",
      status: "SIAGA",
      ping: "5ms",
      color: "text-blueprint-amber",
      borderColor: "border-blueprint-amber",
      glowColor: "rgba(245, 183, 84, 0.25)",
    },
    {
      id: "linkedin",
      icon: (
        <LinkedinIcon className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
      ),
      label: "PROFIL PROFESIONAL",
      title: "LINKEDIN",
      value: "linkedin.com/in/muhammad-rizal",
      href: "https://www.linkedin.com/in/muhammad-rizal-0495b63a0/",
      desc: "Tempat untuk melihat profil profesional, pengalaman, pendidikan, dan informasi karier lainnya.",
      status: "TERVERIFIKASI",
      ping: "18ms",
      color: "text-cyan-400",
      borderColor: "border-cyan-400",
      glowColor: "rgba(34, 211, 238, 0.25)",
    },
    {
      id: "github",
      icon: (
        <GithubIcon className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
      ),
      label: "PROYEK & KODE",
      title: "GITHUB",
      value: "github.com/AzhuraaaReyy",
      href: "https://github.com/AzhuraaaReyy",
      desc: "Tempat untuk melihat proyek, repositori, dan contoh implementasi yang pernah saya kerjakan.",
      status: "PUBLIC",
      ping: "22ms",
      color: "text-purple-400",
      borderColor: "border-purple-400",
      glowColor: "rgba(192, 132, 252, 0.25)",
    },
    {
      id: "instagram",
      icon: (
        <InstagramIcon className="w-6 h-6 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
      ),
      label: "MEDIA SOSIAL",
      title: "INSTAGRAM ",
      value: "instagram.com/mhmmad.rzall",
      href: "https://www.instagram.com/mhmmad.rzall?stkn=MWswZGh1b2xveDB1eg==",
      desc: "Media sosial untuk melihat aktivitas dan pembaruan di luar pekerjaan dan proyek profesional.",
      status: "ONLINE",
      ping: "15ms",
      color: "text-pink-400",
      borderColor: "border-pink-400",
      glowColor: "rgba(244, 114, 182, 0.25)",
    },
    {
      id: "facebook",
      icon: (
        <FacebookIcon className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
      ),
      label: "JEJARING SOSIAL",
      title: "FACEBOOK",
      value: "facebook.com/MuhammadRizal",
      href: "https://www.facebook.com/100019000020247/",
      desc: "Media untuk terhubung dan berbagi informasi seputar aktivitas serta minat di bidang teknologi.",
      status: "CONNECTED",
      ping: "28ms",
      color: "text-blue-400",
      borderColor: "border-blue-400",
      glowColor: "rgba(96, 165, 250, 0.25)",
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? channels.length - 1 : prev - 1));
    setTilt({ x: 0, y: 0 });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === channels.length - 1 ? 0 : prev + 1));
    setTilt({ x: 0, y: 0 });
  };

  const handlePanEnd = (_: unknown, info: PanInfo) => {
    const threshold = 30;
    const velocityThreshold = 200;

    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (
      info.offset.x > threshold ||
      info.velocity.x > velocityThreshold
    ) {
      handlePrev();
    }
  };

  const handleMouseMoveTilt = (
    e: React.MouseEvent<HTMLDivElement>,
    isActive: boolean,
  ) => {
    if (!isActive || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };
  const steps = (n: number) => (t: number) => Math.floor(t * n) / n;
  const handleMouseLeaveTilt = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="contact"
      className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/20 overflow-hidden font-mono select-none min-h-[900px] flex flex-col justify-center"
    >
      <AmbientBackground
        glowIntensity={0.25}
        parallaxSpeed={0.7}
        circuitVariant={1}
      />

      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-25 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(94,234,212,0.06)_0%,transparent_65%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 relative z-10 w-full">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="font-mono font-bold text-xs tracking-widest text-blueprint-teal mb-4 px-4 py-1.5 bg-blueprint-teal/10 border-l-4 border-blueprint-teal skew-x-[-8deg] inline-flex items-center gap-2">
            <span className="skew-x-[8deg] flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-blueprint-amber animate-pulse" />
              KONTAK // INFORMASI & KONEKSI
            </span>
          </div>

          <div className="relative inline-block group cursor-default text-center mb-4">
            {/* Glitch Layer Cyan */}
            <motion.h2
              aria-hidden="true"
              animate={{
                x: [-2, 4, -3, 2, 0],
                y: [0, -1, 1, 0],
                opacity: [0.8, 0.2, 0.9, 0.3, 0.8],
                skewX: [-5, -8, -3, -6, -5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "mirror",
                ease: steps(3),
              }}
              className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-black font-display text-cyan-400 tracking-tighter pointer-events-none uppercase italic z-0 mix-blend-screen whitespace-nowrap"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                filter: "drop-shadow(-2px 0px 2px rgba(6,182,212,0.8))",
              }}
            >
              MARI TERHUBUNG
            </motion.h2>

            {/* Glitch Layer Rose */}
            <motion.h2
              aria-hidden="true"
              animate={{
                x: [3, -3, 4, -2, 0],
                y: [0, 1, -1, 0],
                opacity: [0.9, 0.3, 0.8, 0.2, 0.9],
                skewX: [-5, -2, -7, -4, -5],
              }}
              transition={{
                duration: 0.45,
                repeat: Infinity,
                repeatType: "mirror",
                ease: steps(2),
                delay: 0.05,
              }}
              className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-black font-display text-rose-500 tracking-tighter pointer-events-none uppercase italic z-0 mix-blend-screen whitespace-nowrap"
              style={{
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                filter: "drop-shadow(2px 0px 2px rgba(244,63,94,0.8))",
              }}
            >
              MARI TERHUBUNG
            </motion.h2>

            {/* Main Title */}
            <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-black font-display text-blueprint-text tracking-tighter drop-shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:text-blueprint-teal transition-colors duration-300 uppercase italic skew-x-[-5deg] z-10 whitespace-nowrap">
              MARI <span className="text-blueprint-teal">TERHUBUNG</span>
            </h2>
          </div>

          <p className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl border-y border-blueprint-teal/15 py-2.5 px-4 bg-blueprint-bgSec/40 backdrop-blur-sm mb-3">
            Terbuka untuk peluang kerja di bidang Software Engineering dan Web
            Development, serta kolaborasi profesional dalam membangun dan
            mengembangkan solusi digital yang relevan, fungsional, dan
            berorientasi pada kebutuhan pengguna.
          </p>

          <div className="px-3 py-1 border border-blueprint-teal/30 bg-blueprint-bgSec flex items-center gap-2 font-mono text-[10px] text-blueprint-teal">
            <ShieldCheck className="w-3.5 h-3.5 text-blueprint-amber animate-pulse" />
            <span>TERBUKA UNTUK PELUANG KERJA</span>
          </div>
        </div>

        {/* Outer 3D Perspective Container */}
        <div
          className="relative w-full py-10 flex items-center justify-center min-h-[500px] overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            onPanEnd={handlePanEnd}
            className="relative w-full max-w-[1300px] h-[440px] flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
            style={{ transformStyle: "preserve-3d" }}
          >
            {channels.map((channel, index) => {
              let offset =
                (index - activeIndex + channels.length) % channels.length;
              if (offset > channels.length / 2) {
                offset -= channels.length;
              }

              const isActive = offset === 0;

              // Jarak diperlebar (gap ditambah) agar memenuhi layar kiri & kanan
              let xPos = 0;
              let rotY = 0;
              let sc = 1;
              let zPos = 120;
              let op = 1;
              let zInd = 30;

              if (offset === 1) {
                xPos = 280;
                rotY = -48;
                sc = 0.85;
                zPos = -40;
                op = 0.92;
                zInd = 20;
              } else if (offset === -1) {
                xPos = -280;
                rotY = 48;
                sc = 0.85;
                zPos = -40;
                op = 0.92;
                zInd = 20;
              } else if (offset === 2) {
                xPos = 520;
                rotY = -58;
                sc = 0.72;
                zPos = -150;
                op = 0.75;
                zInd = 10;
              } else if (offset === -2) {
                xPos = -520;
                rotY = 58;
                sc = 0.72;
                zPos = -150;
                op = 0.75;
                zInd = 10;
              } else if (Math.abs(offset) >= 3) {
                xPos = offset > 0 ? 700 : -700;
                rotY = offset > 0 ? -65 : 65;
                sc = 0.5;
                zPos = -300;
                op = 0;
                zInd = 0;
              }

              return (
                <motion.div
                  key={channel.id}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(index);
                      setTilt({ x: 0, y: 0 });
                    }
                  }}
                  onMouseMove={(e) => handleMouseMoveTilt(e, isActive)}
                  onMouseLeave={handleMouseLeaveTilt}
                  initial={false}
                  animate={{
                    x: xPos,
                    rotateY: isActive ? tilt.y : rotY,
                    rotateX: isActive ? tilt.x : 0,
                    scale: sc,
                    z: zPos,
                    opacity: op,
                    zIndex: zInd,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 26,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center center",
                    pointerEvents: Math.abs(offset) > 2 ? "none" : "auto",
                  }}
                  className="absolute w-[280px] sm:w-[310px] h-[430px]"
                >
                  <div
                    className={`relative w-full h-full p-6 bg-blueprint-bgSec/95 backdrop-blur-md border ${
                      channel.borderColor
                    }/40 ${
                      isActive
                        ? "shadow-[0_15px_40px_rgba(0,0,0,0.75)]"
                        : "shadow-md"
                    } overflow-hidden group transition-all duration-300`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {isActive && (
                      <div
                        className="absolute -inset-2 rounded-xl opacity-50 blur-xl pointer-events-none -z-10 transition-all duration-500"
                        style={{ backgroundColor: channel.glowColor }}
                      />
                    )}

                    {!isActive && (
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-brightness-75 z-30 transition-opacity duration-300 group-hover:bg-slate-950/10 pointer-events-none" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

                    <div
                      className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${channel.borderColor} z-20`}
                    />
                    <div
                      className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${channel.borderColor} z-20`}
                    />
                    <div
                      className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${channel.borderColor} z-20`}
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${channel.borderColor} z-20`}
                    />

                    <div className="relative z-10 flex flex-col h-full justify-between select-none">
                      <div>
                        <div
                          className={`flex items-center justify-between mb-4 pb-2 border-b border-blueprint-teal/15 text-[9px] uppercase tracking-widest ${channel.color}`}
                        >
                          <span className="font-bold">{channel.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 text-[8px]">
                              PING: {channel.ping}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`p-3 border ${channel.borderColor}/40 bg-blueprint-bg/90 shadow-inner`}
                          >
                            {channel.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-base sm:text-lg text-slate-100 uppercase tracking-wider">
                              {channel.title}
                            </h3>
                            <p
                              className={`text-xs ${channel.color} font-bold tracking-wide select-all`}
                            >
                              &gt; {channel.value}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-blueprint-teal/30 pl-3 my-4">
                          {channel.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-blueprint-teal/15 flex flex-col gap-2">
                        <a
                          href={channel.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            if (!isActive) {
                              e.preventDefault();
                              setActiveIndex(index);
                            }
                          }}
                          className={`w-full py-2.5 px-4 border ${channel.borderColor} bg-blueprint-bgSec hover:bg-blueprint-teal hover:text-black transition-all duration-300 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest ${channel.color} hover:shadow-[0_0_20px_rgba(94,234,212,0.4)]`}
                        >
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            KUNJUNGI PROFILE
                          </span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-8 text-center font-mono text-[10px] text-slate-400 tracking-widest uppercase">
          [ Terbuka untuk komunikasi terkait peluang kerja dan kolaborasi
          profesional. ]
        </div>
      </div>
    </section>
  );
}
