'use client';

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      const radius = 100 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={starsRef} geometry={starGeometry}>
      <pointsMaterial
        size={0.3}
        sizeAttenuation
        transparent
        opacity={0.8}
        color="#ffffff"
      />
    </points>
  );
}

function Earth({
  scrollProgress,
  isDragging,
  velocity,
  targetRotation
}: {
  scrollProgress: number;
  isDragging: boolean;
  velocity: { x: number; y: number };
  targetRotation: { x: number; y: number };
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const [earthTexture] = useTexture([
    '/textures/earth-blue-marble.jpg',
  ]) as [THREE.Texture];

  useEffect(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [earthTexture]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      if (isDragging) {
        velocityRef.current.x = velocity.x;
        velocityRef.current.y = velocity.y;
        
        rotationRef.current.x = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(rotationRef.current.x, targetRotation.x, 0.1),
          -Math.PI / 3,
          Math.PI / 3
        );
        rotationRef.current.y = rotationRef.current.y + velocity.y * delta * 2;
      } else {
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;
        
        rotationRef.current.y += velocityRef.current.y * delta * 3;
        rotationRef.current.x = THREE.MathUtils.lerp(rotationRef.current.x, 0, 0.02);
        
        rotationRef.current.y += 0.002;
      }
      
      earthRef.current.rotation.x = rotationRef.current.x;
      earthRef.current.rotation.y = rotationRef.current.y;
    }
  });

  const scale = 1 - scrollProgress * 0.3;

  return (
    <group scale={[scale, scale, scale]}>
      <Sphere ref={earthRef} args={[2, 128, 128]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>
    </group>
  );
}

function Glow({
  scrollProgress
}: {
  scrollProgress: number;
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (glowRef.current) {
      glowRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const opacity = 0.12 - scrollProgress * 0.08;
  const scale = 1.1 - scrollProgress * 0.1;

  return (
    <mesh ref={glowRef} scale={[scale, scale, scale]}>
      <sphereGeometry args={[2.2, 128, 128]} />
      <meshBasicMaterial
        color="#4488ff"
        transparent
        opacity={Math.max(opacity, 0.05)}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 5, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, 2, 5]} intensity={0.5} color="#4488ff" />
    </>
  );
}

function Scene({
  scrollProgress,
  isDragging,
  velocity,
  targetRotation
}: {
  scrollProgress: number;
  isDragging: boolean;
  velocity: { x: number; y: number };
  targetRotation: { x: number; y: number };
}) {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.z = 8 - scrollProgress * 3;
  });

  return (
    <>
      <Lights />
      <Stars />
      <Glow scrollProgress={scrollProgress} />
      <Earth 
        scrollProgress={scrollProgress} 
        isDragging={isDragging}
        velocity={velocity}
        targetRotation={targetRotation}
      />
    </>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-blue-400 font-medium tracking-wide">Loading Globe...</p>
      </div>
    </Html>
  );
}

export default function Globe() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  
  const isOnGlobe = useRef(false);
  const globeRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!globeRef.current) return;
      
      const rect = globeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) + 
        Math.pow(event.clientY - centerY, 2)
      );
      const radius = Math.min(rect.width, rect.height) / 2;
      
      if (distance < radius * 0.9) {
        setIsDragging(true);
        lastPos.current = { x: event.clientX, y: event.clientY };
        lastTime.current = Date.now();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!globeRef.current) return;
      
      const rect = globeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(event.clientX - centerX, 2) + 
        Math.pow(event.clientY - centerY, 2)
      );
      const radius = Math.min(rect.width, rect.height) / 2;
      
      const now = Date.now();
      const dt = (now - lastTime.current) / 1000;
      const dx = event.clientX - lastPos.current.x;
      const dy = event.clientY - lastPos.current.y;
      
      if (isDragging) {
        const normalizedX = (event.clientX - centerX) / radius;
        const normalizedY = (event.clientY - centerY) / radius;
        
        setTargetRotation({
          x: normalizedY * 0.5,
          y: 0
        });
        
        setVelocity({
          x: dx / dt * 0.001,
          y: dy / dt * 0.01
        });
        
        lastPos.current = { x: event.clientX, y: event.clientY };
        lastTime.current = now;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDragging]);

  return (
    <div ref={globeRef} className="absolute inset-0 cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        dpr={[1, 3]}
      >
        <Suspense fallback={<Loader />}>
          <Scene 
            scrollProgress={scrollProgress} 
            isDragging={isDragging}
            velocity={velocity}
            targetRotation={targetRotation}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
