"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  MeshDistortMaterial,
  Stars,
} from "@react-three/drei";
import type { Group, Mesh } from "three";
import { useScroll, useSpring, type MotionValue } from "framer-motion";

function CoreMesh({ progress }: { progress: MotionValue<number> }) {
  const mesh = useRef<Mesh>(null);
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.16;
    mesh.current.position.x +=
      (pointer.current.x * 0.5 - mesh.current.position.x) * 0.04;
    mesh.current.position.y +=
      (pointer.current.y * 0.35 - mesh.current.position.y) * 0.04;

    // scroll-linked storytelling: the core shrinks and spins away as the
    // user scrolls past the hero (Lusion-style depth on scroll)
    const p = progress.get();
    if (group.current) {
      const s = 1 - p * 0.55;
      group.current.scale.setScalar(s);
      group.current.rotation.z = p * 0.8;
    }
    void state;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.4}>
      <group ref={group}>
        <Icosahedron args={[1.7, 4]} ref={mesh}>
          <MeshDistortMaterial
            color="#22d3ee"
            roughness={0.2}
            metalness={0.9}
            distort={0.35}
            speed={1.8}
          />
        </Icosahedron>
        <Icosahedron args={[2.35, 1]}>
          <meshBasicMaterial
            color="#a78bfa"
            wireframe
            transparent
            opacity={0.16}
          />
        </Icosahedron>
      </group>
    </Float>
  );
}

/**
 * Interactive 3D hero background: a floating distorted icosahedron with a
 * wireframe shell and a particle starfield. The core follows the cursor and
 * reacts to scroll progress through the hero section.
 */
export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
  });

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} color="#67e8f9" />
        <pointLight position={[-6, -4, -2]} intensity={2} color="#a78bfa" />
        <CoreMesh progress={smoothProgress} />
        <Stars radius={90} depth={60} count={1800} factor={4} saturation={0} fade speed={1.2} />
      </Canvas>
    </div>
  );
}
