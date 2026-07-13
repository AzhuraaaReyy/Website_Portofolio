import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface MorphingParticlesProps {
  scrollProgress: number; // 0 to 1 based on scroll position in Hero
}

export function MorphingParticles({ scrollProgress }: MorphingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport for adaptive particle count
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const particleCount = useMemo(() => {
    if (isMobile) return 800; // 60-70% reduction for low-end mobile CPUs/GPUs
    return 2500;              // Full count on desktop
  }, [isMobile]);

  // Generate mathematical shapes positions
  const { spherePos, dbPos, reactPos, gridPos } = useMemo(() => {
    const sphere = new Float32Array(particleCount * 3);
    const db = new Float32Array(particleCount * 3);
    const react = new Float32Array(particleCount * 3);
    const grid = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;

      // 1. Sphere (Shape 1)
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const sphereRadius = 2.0;
      sphere[idx] = Math.sin(phi) * Math.cos(theta) * sphereRadius;
      sphere[idx + 1] = Math.sin(phi) * Math.sin(theta) * sphereRadius;
      sphere[idx + 2] = Math.cos(phi) * sphereRadius;

      // 2. Database Cylinder Stack (Shape 2)
      // Stack of 3 flat cylinders representing database shards
      const cylinderIdx = i % 3; // 3 cylinders
      const angle = (i / particleCount) * Math.PI * 2 * (particleCount / 10);
      const dbRadius = 2.2;
      const heightOffset = (cylinderIdx - 1) * 1.3 + (Math.random() - 0.5) * 0.15;
      
      db[idx] = Math.cos(angle) * dbRadius;
      db[idx + 1] = heightOffset;
      db[idx + 2] = Math.sin(angle) * dbRadius;

      // 3. React Atom Rings (Shape 3)
      // 3 intersecting orbital rings
      const ringIdx = i % 3;
      const ringAngle = (i / particleCount) * Math.PI * 2 * 3;
      const ringRadius = 2.5;
      const rx = Math.cos(ringAngle) * ringRadius;
      const ry = Math.sin(ringAngle) * ringRadius;

      if (ringIdx === 0) {
        react[idx] = rx;
        react[idx + 1] = ry;
        react[idx + 2] = 0;
      } else if (ringIdx === 1) {
        // Rotate 60 degrees around Y axis
        react[idx] = rx * Math.cos(Math.PI / 3);
        react[idx + 1] = ry;
        react[idx + 2] = rx * Math.sin(Math.PI / 3);
      } else {
        // Rotate -60 degrees around Y axis
        react[idx] = rx * Math.cos(-Math.PI / 3);
        react[idx + 1] = ry;
        react[idx + 2] = rx * Math.sin(-Math.PI / 3);
      }

      // 4. Blueprint Grid / Terrain Wave (Shape 4)
      const cols = Math.floor(Math.sqrt(particleCount));
      const rIdx = Math.floor(i / cols);
      const cIdx = i % cols;
      const gx = (cIdx / cols - 0.5) * 6;
      const gz = (rIdx / cols - 0.5) * 6;
      const gy = Math.sin(gx * 2) * Math.cos(gz * 2) * 0.4 - 0.5;

      grid[idx] = gx;
      grid[idx + 1] = gy;
      grid[idx + 2] = gz;
    }

    return { spherePos: sphere, dbPos: db, reactPos: react, gridPos: grid };
  }, [particleCount]);

  // Initial positions buffer
  const initialPositions = useMemo(() => {
    return new Float32Array(particleCount * 3);
  }, [particleCount]);

  // Handle morph target calculation and interpolation frame loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    const points = pointsRef.current;
    const posAttribute = points.geometry.attributes.position as THREE.BufferAttribute;
    const positions = posAttribute.array as Float32Array;

    // Determine target based on scroll progress
    let target: Float32Array;

    if (reducedMotion) {
      // Reduced motion keeps shape 1 (Sphere) in slow rotation, no morphing
      target = spherePos;
    } else {
      if (scrollProgress < 0.33) {
        // Morph from Sphere (0.0) to Database (0.33)
        const t = scrollProgress / 0.33;
        target = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
          target[i] = THREE.MathUtils.lerp(spherePos[i], dbPos[i], t);
        }
      } else if (scrollProgress < 0.66) {
        // Morph from Database (0.33) to React Atom (0.66)
        const t = (scrollProgress - 0.33) / 0.33;
        target = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
          target[i] = THREE.MathUtils.lerp(dbPos[i], reactPos[i], t);
        }
      } else {
        // Morph from React Atom (0.66) to Blueprint Grid (1.0)
        const t = Math.min(1, (scrollProgress - 0.66) / 0.34);
        target = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
          target[i] = THREE.MathUtils.lerp(reactPos[i], gridPos[i], t);
        }
      }
    }

    // Apply spring-lerp for buttery smooth transitions
    const lerpFactor = reducedMotion ? 1.0 : 0.08; // Instant snap for accessibility if wanted, else smooth
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] += (target[i] - positions[i]) * lerpFactor;
    }
    
    posAttribute.needsUpdate = true;

    // Auto rotate the particle system slowly
    const time = state.clock.getElapsedTime();
    if (reducedMotion) {
      points.rotation.y = time * 0.05;
    } else {
      // Rotate based on time + scroll progress
      points.rotation.y = time * 0.08 + scrollProgress * 1.5;
      points.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#5EEAD4"
        size={isMobile ? 0.035 : 0.025}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
