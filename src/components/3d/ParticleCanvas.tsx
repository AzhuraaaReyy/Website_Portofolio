import { Canvas, useFrame } from "@react-three/fiber";
import { MorphingParticles } from "./MorphingParticles";
import * as THREE from "three";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useState, useEffect } from "react";

interface ParticleCanvasProps {
  scrollProgress: number;
}

function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const reducedMotion = useReducedMotion();

  useFrame((state) => {
    if (reducedMotion) {
      state.camera.position.set(0, 0, 5.5);
      state.camera.lookAt(0, 0, 0);
      return;
    }

    // Camera moves closer and pans slightly down as the user scrolls
    const targetZ = 5.5 - scrollProgress * 1.2;
    const targetY = -scrollProgress * 0.4;
    const targetX = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2; // soft swaying

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export function ParticleCanvas({ scrollProgress }: ParticleCanvasProps) {
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Detect WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const supports = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebGlSupported(supports);
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  if (!webGlSupported) {
    // Elegant fallback if WebGL is disabled or unsupported
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
        <div className="w-[300px] h-[300px] rounded-full border border-dashed border-blueprint-teal/40 animate-spin" style={{ animationDuration: '30s' }} />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-blueprint-teal/30 animate-reverse-spin" style={{ animationDuration: '15s' }} />
        <div className="absolute text-5xl font-mono text-blueprint-teal">&lt;/&gt;</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <MorphingParticles scrollProgress={scrollProgress} />
        <CameraController scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
