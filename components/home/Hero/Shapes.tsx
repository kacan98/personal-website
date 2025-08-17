"use client";

import { Box, styled } from "@mui/material";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useSoundEffects } from "../../../hooks/useSoundEffects";
import { getPublicAssetUrl } from "../../../utils/assetHelpers";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CanvasContainer = styled(Box)(({ theme }) => ({
  aspectRatio: '1 / 1',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  opacity: 0, // Start hidden for animation
  [theme.breakpoints.up('md')]: {
    marginTop: 0,
    marginBottom: 0,
  },
}));

const StyledCanvas = styled(Canvas)({
  zIndex: 0,
});

// Optimized progress tracking - realistic but fast
function ProgressTracker({ 
  onProgressChange, 
  onLoadingComplete 
}: { 
  onProgressChange: (progress: number) => void;
  onLoadingComplete?: () => void;
}) {
  const [hasCompleted, setHasCompleted] = useState(false);
  
  useEffect(() => {
    if (hasCompleted) return;
    
    // Start immediately for responsive feel
    let currentProgress = 15;
    onProgressChange(currentProgress);
    
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        // Smart progression - fast start, slower end for realism
        const increment = currentProgress < 50 ? 20 : currentProgress < 85 ? 15 : 10;
        currentProgress = Math.min(100, currentProgress + increment);
        onProgressChange(currentProgress);
        
        if (currentProgress >= 100) {
          setHasCompleted(true);
          clearInterval(interval);
          // Small delay for smooth transition
          setTimeout(() => {
            onLoadingComplete?.();
          }, 150);
        }
      }
    }, 60); // Balanced interval
    
    return () => clearInterval(interval);
  }, [onProgressChange, onLoadingComplete, hasCompleted]);
  
  return null;
}

// Performance optimization component
function PerformanceOptimizer() {
  const { invalidate } = useThree();
  
  useEffect(() => {
    // Enable on-demand rendering for better performance
    invalidate();
  }, [invalidate]);
  
  return null;
}

export function Shapes({ 
  onLoadingComplete,
  onProgressChange 
}: { 
  onLoadingComplete?: () => void;
  onProgressChange?: (progress: number) => void;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleProgressChange = useCallback((progress: number) => {
    onProgressChange?.(progress);
  }, [onProgressChange]);

  const handleLoadingComplete = useCallback(() => {
    if (isLoaded) return; // Prevent multiple calls
    
    setIsLoaded(true);
    onLoadingComplete?.();
    
    // Animate container in when assets are fully loaded
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [isLoaded, onLoadingComplete]);

  useEffect(() => {
    let rafId: number;
    
    const handleMouseMove = (event: any) => {
      // Throttle mouse movement using RAF for better performance
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        // Normalize mouse position values between -1 and 1
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        setMousePosition({ x, y });
        rafId = 0;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <CanvasContainer ref={containerRef}>
      <StyledCanvas
        gl={{ 
          antialias: true, // Enable for better visual quality
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          // Enable optimizations
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
        frameloop="demand"
        performance={{ min: 0.8 }}
      >
        <Suspense fallback={null}>
          <ProgressTracker 
            onProgressChange={handleProgressChange} 
            onLoadingComplete={handleLoadingComplete}
          />
          <PerformanceOptimizer />
          <Geometries mousePosition={mousePosition} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.0} />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#f59e0b" />
          <ContactShadows
            position={[0, -4.5, 0]}
            opacity={0.3}
            scale={30}
            blur={1.5}
            far={6}
            resolution={64}
            color="#000000"
          />
          <Environment preset="studio" />
        </Suspense>
      </StyledCanvas>
    </CanvasContainer>
  );
}

function Geometries({ mousePosition }: {
  mousePosition: { x: number; y: number; };
}) {
  // Optimized geometries for better performance
  const geometries = useMemo(() => [
    {
      position: [-1.2, -1, 2] as [number, number, number],
      r: 0.5,
      geometry: new THREE.TorusGeometry(1.0, 0.4, 16, 24), // Reduced segments
    },
    {
      position: [1.5, -.3, 1.5] as [number, number, number],
      r: 0.5,
      geometry: new THREE.ConeGeometry(1.2, 2.0, 8), // Reduced segments
    },
    {
      position: [0, 0, -1] as [number, number, number],
      r: 0.8,
      geometry: new THREE.DodecahedronGeometry(2.5), // Keep centerpiece detailed
    },
    {
      position: [-1.7, 1.2, -1] as [number, number, number],
      r: 0.6,
      geometry: new THREE.TorusKnotGeometry(.5, .3, 32, 24, 2, 3), // Reduced segments
    },
    {
      position: [1.2, 1.7, -2] as [number, number, number],
      r: 0.6,
      geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5), // Box is already optimized
    },
  ], []);
  // Reduced sound files for better performance
  const soundPaths = [
    getPublicAssetUrl("sounds/hit1.ogg"),
    getPublicAssetUrl("sounds/hit3.ogg"),
    getPublicAssetUrl("sounds/hit6.ogg"),
  ];

  const { playRandomSound } = useSoundEffects(soundPaths);

  // Beautiful materials - optimized but stunning
  const materials = useMemo(() => [
    // Rainbow/Iridescent Material - always beautiful
    new THREE.MeshNormalMaterial(),
    // Beautiful MeshPhysicalMaterial but optimized
    new THREE.MeshPhysicalMaterial({
      roughness: 0.1,
      metalness: 0.8,
      color: 0x9c27b0, // Bright purple
      clearcoat: 0.8,
      emissive: 0x340137,
      emissiveIntensity: 1.2,
    }),
    new THREE.MeshPhysicalMaterial({
      roughness: 0.1,
      metalness: 0.7,
      color: 0x00e5ff, // Cyan
      clearcoat: 0.8,
      emissive: 0x004d57,
      emissiveIntensity: 1.2,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xff4081, // Hot Pink
      roughness: 0.1,
      metalness: 0.6,
      clearcoat: 0.8,
      emissive: 0x4a0024,
      emissiveIntensity: 1.2,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xffff00, // Neon yellow
      roughness: 0.1,
      metalness: 0.7,
      clearcoat: 0.8,
      emissive: 0x6b6b00,
      emissiveIntensity: 1.2,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xff6500, // Vivid Orange
      roughness: 0.1,
      metalness: 0.7,
      clearcoat: 0.8,
      emissive: 0x4a1f00,
      emissiveIntensity: 1.2,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x4169e1, // Royal Blue
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 0.8,
      emissive: 0x1a2a5e,
      emissiveIntensity: 1.2,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x32CD32, // Lime green
      roughness: 0.1,
      metalness: 0.6,
      clearcoat: 0.8,
      emissive: 0x2e4016,
      emissiveIntensity: 1.2,
    }),
  ], []);
  return geometries.map(({ position, r, geometry }) => (
    <Geometry
      key={JSON.stringify(position)} // Unique key
      position={position.map((p) => p * 2) as [number, number, number]}
      geometry={geometry}
      playSound={playRandomSound}
      materials={materials}
      r={r}
      mousePosition={mousePosition}
    />
  ));
}

function Geometry({ r, position, geometry, playSound, materials, mousePosition }: {
  r: number;
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  playSound: () => void;
  materials: THREE.Material[];
  mousePosition: { x: number; y: number; };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isVisible, setIsVisible] = useState(false);
  const floatRef = useRef<THREE.Group>(null);
  const [currentMaterial, setCurrentMaterial] = useState<THREE.Material>();
  const initialPosition = useRef([...position]); // Create a copy of the position array
  const { invalidate } = useThree(); // For on-demand rendering
  
  // Remove progressive loading transition effects
  
  // Initialize material only once
  useEffect(() => {
    if (!currentMaterial) {
      setCurrentMaterial(gsap.utils.random(materials));
    }
  }, [materials, currentMaterial]);
  
  function getRandomMaterial() {
    // Filter out the current material to ensure we always get a different one
    const availableMaterials = materials.filter(material => material !== currentMaterial);
    return gsap.utils.random(availableMaterials);
  }  
  
  function handleClick(e: {
    object: THREE.Object3D;
  }) {
    const mesh = e.object;

    // Always play sound - we now handle errors in the hook
    playSound();

    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random(0, 2)}`,
      y: `+=${gsap.utils.random(0, 2)}`,
      z: `+=${gsap.utils.random(0, 2)}`,
      duration: 1.3,
      ease: "elastic.out(1,0.3)",
      yoyo: true,
      onUpdate: () => invalidate(), // Re-render during animation
    });
    // Only change material on click
    setCurrentMaterial(getRandomMaterial());
    invalidate(); // Re-render for material change
  }

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  }; 
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      setIsVisible(true);
      if (meshRef.current) {
        gsap.from(meshRef.current.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: gsap.utils.random(0.8, 1.2),
          ease: "elastic.out(1,0.3)",
          delay: gsap.utils.random(0, 0.5),
        });
      }
      // Set initial position including z-coordinate
      if (groupRef.current) {
        groupRef.current.position.set(
          initialPosition.current[0],
          initialPosition.current[1],
          initialPosition.current[2]
        );
      }
    });
    return () => ctx.revert();
  }, []);
  useFrame(({ invalidate }) => {
    if (!isVisible || !groupRef.current || !mousePosition) return;

    const isMiddleShape = initialPosition.current[0] === 0 && initialPosition.current[1] === 0;
    const movementFactor = isMiddleShape ? 0.6 : 0.3;

    const targetX = initialPosition.current[0] + mousePosition.x * movementFactor;
    const targetY = initialPosition.current[1] + mousePosition.y * movementFactor;

    const newX = lerp(groupRef.current.position.x, targetX, 0.04);
    const newY = lerp(groupRef.current.position.y, targetY, 0.04);
    const newZ = lerp(groupRef.current.position.z, initialPosition.current[2], 0.04);

    const threshold = 0.01;
    if (
      Math.abs(newX - groupRef.current.position.x) > threshold ||
      Math.abs(newY - groupRef.current.position.y) > threshold ||
      Math.abs(newZ - groupRef.current.position.z) > threshold
    ) {
      groupRef.current.position.set(newX, newY, newZ);
      invalidate(); // Only re-render when movement occurs
    }
  });  
  
  return (
    <group ref={groupRef}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r} ref={floatRef}>
        <mesh
        ref={meshRef}
        geometry={geometry}
        material={currentMaterial}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      </Float>
    </group>
  );
}
