"use client";

import { Box, styled } from "@mui/material";
import { BakeShadows, ContactShadows, Environment, Float, Preload } from "@react-three/drei";
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

// Custom progress tracking for inline geometries and materials
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
    
    // Immediate start with faster progression
    let currentProgress = 10; // Start at 10% immediately
    onProgressChange(currentProgress);
    
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        // More consistent increments for smoother experience
        const increment = currentProgress < 70 ? 12 : 8;
        currentProgress = Math.min(100, currentProgress + increment);
        onProgressChange(currentProgress);
        
        if (currentProgress >= 100) {
          setHasCompleted(true);
          clearInterval(interval);
          // Immediate completion for snappy feel
          setTimeout(() => {
            onLoadingComplete?.();
          }, 100);
        }
      }
    }, 80); // Slightly faster interval
    
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
    const handleMouseMove = (event: any) => {
      // Normalize mouse position values between -1 and 1
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <CanvasContainer ref={containerRef}>
      <StyledCanvas
        shadows
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          alpha: true, // Enable transparency
          stencil: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Transparent background
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
        frameloop="demand" // On-demand rendering for performance
      >
        <Suspense fallback={null}>
          <ProgressTracker 
            onProgressChange={handleProgressChange} 
            onLoadingComplete={handleLoadingComplete}
          />
          <PerformanceOptimizer />
          <Geometries mousePosition={mousePosition} />
          <ContactShadows
            position={[0, -4.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1.5}
            far={9}
            resolution={256}
            color="#000000"
          />
          <Environment preset="studio" />
          <BakeShadows />
          <Preload all />
        </Suspense>
      </StyledCanvas>
    </CanvasContainer>
  );
}

function Geometries({ mousePosition }: {
  mousePosition: { x: number; y: number; };
}) {
  // Optimized geometries - reduced complexity for better performance
  const geometries = useMemo(() => [
    {
      position: [-1.2, -1, 2] as [number, number, number],
      r: 0.5,
      geometry: new THREE.TorusGeometry(1.0, 0.4, 16, 24), // Reduced segments: 20,36 -> 16,24
    },
    {
      position: [1.5, -.3, 1.5] as [number, number, number],
      r: 0.5,
      geometry: new THREE.ConeGeometry(1.2, 2.0, 8), // Increased segments for smoother look
    },
    {
      // Middle position - largest shape
      position: [0, 0, -1] as [number, number, number],
      r: 0.8,
      geometry: new THREE.DodecahedronGeometry(2.5), // Keep this complex one as it's the centerpiece
    },
    {
      position: [-1.7, 1.2, -1] as [number, number, number],
      r: 0.6,
      geometry: new THREE.TorusKnotGeometry(.5, .3, 32, 25, 2, 3), // Reduced segments: 64,50 -> 32,25
    },
    {
      position: [1.2, 1.7, -2] as [number, number, number],
      r: 0.6,
      geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5), // Keep simple
    },
  ], []);
  // Use our custom hook for sound effects
  const soundPaths = [
    getPublicAssetUrl("sounds/hit1.ogg"),
    getPublicAssetUrl("sounds/hit2.ogg"),
    getPublicAssetUrl("sounds/hit3.ogg"),
    getPublicAssetUrl("sounds/hit4.ogg"),
    getPublicAssetUrl("sounds/hit6.ogg"),
    getPublicAssetUrl("sounds/hit7.ogg"),
    getPublicAssetUrl("sounds/hit8.ogg"),
  ];

  const { playRandomSound } = useSoundEffects(soundPaths);

  // Optimized materials - reduced count and complexity for better performance
  const materials = useMemo(() => [
    // Rainbow/Iridescent Material - keeping this one since it's cool
    new THREE.MeshNormalMaterial(),
    // Simplified Physical Materials - reduced complexity but kept visual appeal
    new THREE.MeshPhysicalMaterial({
      roughness: 0.1,
      metalness: 0.8,
      color: 0x9c27b0, // Bright purple
      clearcoat: 0.8,
      emissive: 0x340137,
      emissiveIntensity: 1.5,
    }),
    new THREE.MeshPhysicalMaterial({
      roughness: 0.1,
      metalness: 0.7,
      color: 0x00e5ff, // Cyan
      clearcoat: 0.8,
      emissive: 0x004d57,
      emissiveIntensity: 1.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xff4081, // Hot Pink
      roughness: 0.1,
      metalness: 0.6,
      clearcoat: 0.8,
      emissive: 0x4a0024,
      emissiveIntensity: 1.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xffff00, // Neon yellow
      roughness: 0.1,
      metalness: 0.7,
      clearcoat: 0.8,
      emissive: 0x6b6b00,
      emissiveIntensity: 1.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xff6500, // Vivid Orange
      roughness: 0.1,
      metalness: 0.7,
      clearcoat: 0.8,
      emissive: 0x4a1f00,
      emissiveIntensity: 1.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x4169e1, // Royal Blue
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 0.8,
      emissive: 0x1a2a5e,
      emissiveIntensity: 1.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x32CD32, // Lime green
      roughness: 0.1,
      metalness: 0.6,
      clearcoat: 0.8,
      emissive: 0x2e4016,
      emissiveIntensity: 1.5,
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
  }, []);  // Apply subtle movement based on mouse position with performance optimization
  useFrame(({ invalidate }) => {
    if (!isVisible || !groupRef.current || !mousePosition) return;

    // Detect if this is the middle (largest) shape
    const isMiddleShape = initialPosition.current[0] === 0 && initialPosition.current[1] === 0;
    const movementFactor = isMiddleShape ? 0.8 : 0.5; // More movement for middle shape

    // Apply slight position offset based on mouse position
    const targetX = initialPosition.current[0] + mousePosition.x * movementFactor;
    const targetY = initialPosition.current[1] + mousePosition.y * movementFactor;

    // Smooth lerping for more natural movement using our custom lerp function
    const newX = lerp(groupRef.current.position.x, targetX, 0.07);
    const newY = lerp(groupRef.current.position.y, targetY, 0.07);
    const newZ = lerp(groupRef.current.position.z, initialPosition.current[2], 0.07);

    // Only update position and invalidate if there's actual movement
    const threshold = 0.001;
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
        geometry={geometry} // eslint-disable-line react/no-unknown-property
        material={currentMaterial} // eslint-disable-line react/no-unknown-property
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      </Float>
    </group>
  );
}
