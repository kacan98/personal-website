"use client";

import { Box, styled } from "@mui/material";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { Suspense, useEffect, useRef, useState } from "react";
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

export function Shapes() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate container in when component mounts
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    }

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
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
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
        </Suspense>
      </StyledCanvas>
    </CanvasContainer>
  );
}

function Geometries({ mousePosition }: {
  mousePosition: { x: number; y: number; };
}) {
  const geometries:
    {
      position: [number, number, number];
      r: number;
      geometry: THREE.BufferGeometry;
    }[] = [
      {
        position: [-1.2, -1, 2],
        r: 0.5,
        geometry: new THREE.TorusGeometry(1.0, 0.4, 20, 36), // Donut (in front, left)
      },
      {
        position: [1.5, -.3, 1.5],
        r: 0.5,
        geometry: new THREE.ConeGeometry(1.2, 2.0, 6), // Pyramid/cone (in front, right)
      },
      {
        // Middle position - largest shape
        position: [0, 0, -1],
        r: 0.8,
        geometry: new THREE.DodecahedronGeometry(2.5), // Soccer ball (middle - keeping this one)
      },
      {
        position: [-1.7, 1.2, -1],
        r: 0.6,
        geometry: new THREE.TorusKnotGeometry(.5, .3, 64, 50, 2, 3), // Knot (back, left)
      },
      {
        position: [1.2, 1.7, -2],
        r: 0.6,
        geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5), // Cube (back, right)
      },
    ];
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

  const materials = [
    // Rainbow/Iridescent Material - keeping this one since it's cool
    new THREE.MeshNormalMaterial(),
    // Holographic Chrome Material - similar rainbow effect but with metallic chrome base
    new THREE.MeshPhysicalMaterial({
      roughness: 0.0,
      metalness: 1.0,
      color: 0xffffff, // White base for chrome effect
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      iridescence: 1.0, // Maximum iridescence for rainbow effect
      iridescenceIOR: 1.3, // Controls the iridescence intensity
      iridescenceThicknessRange: [100, 400], // Thickness range for color variation
    }),
    // Bright Purple (restored from original)
    new THREE.MeshPhysicalMaterial({
      roughness: 0.1,
      metalness: 0.6,
      color: 0x9c27b0, // Bright purple
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x340137, // Subtle glow
      emissiveIntensity: 2.5,
    }),
    // Neon/Candy like colors with enhanced glow effects
    new THREE.MeshPhysicalMaterial({
      roughness: 0.05,
      metalness: 0.9,
      color: 0x00e5ff, // Cyan
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x004d57, // Subtle glow
      emissiveIntensity: 2.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xff4081, // Hot Pink
      roughness: 0.1, // Fixed from 10 to 0.1
      metalness: 0.4,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      emissive: 0x4a0024, // Subtle glow
      emissiveIntensity: 2.5,
    }),
    // More neon colors with glow
    new THREE.MeshPhysicalMaterial({
      color: 0xffff00, // Neon yellow
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x6b6b00, // Yellow glow
      emissiveIntensity: 2.5,
    }),
    // Candy-like translucent materials with glow
    new THREE.MeshPhysicalMaterial({
      color: 0xff00ff, // Magenta
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6, // More translucent
      thickness: 1.0,
      emissive: 0x550055, // Magenta glow
      emissiveIntensity: 1.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x32CD32, // Lime green
      roughness: 0.1,
      metalness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6, // More translucent
      thickness: 1.0,
      emissive: 0x2e4016, // Green glow
      emissiveIntensity: 1.5,
    }),
    // NEW COLORS - Distinct and vibrant
    new THREE.MeshPhysicalMaterial({
      color: 0xff6500, // Vivid Orange
      roughness: 0.1,
      metalness: 0.7,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x4a1f00, // Orange glow
      emissiveIntensity: 2.0,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x4169e1, // Royal Blue
      roughness: 0.05,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x1a2a5e, // Blue glow
      emissiveIntensity: 2.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xff1744, // Bright Red
      roughness: 0.1,
      metalness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x5c0a15, // Red glow
      emissiveIntensity: 2.5,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x00bcd4, // Dark Turquoise
      roughness: 0.1,
      metalness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.4, // Slightly translucent
      thickness: 0.8,
      emissive: 0x003c47, // Turquoise glow
      emissiveIntensity: 2.0,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x8e24aa, // Deep Purple (different from bright purple)
      roughness: 0.1,
      metalness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.5, // Translucent
      thickness: 1.0,
      emissive: 0x2d0833, // Deep purple glow
      emissiveIntensity: 1.8,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0xffc107, // Amber/Gold
      roughness: 0.05,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x664a02, // Gold glow
      emissiveIntensity: 2.2,
    }),
  ];
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
  }  function handleClick(e: {
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
    });
    // Only change material on click
    setCurrentMaterial(getRandomMaterial());
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
  }, []);  // Apply subtle movement based on mouse position
  useFrame(() => {
    if (!isVisible || !groupRef.current || !mousePosition) return;

    // Detect if this is the middle (largest) shape
    const isMiddleShape = initialPosition.current[0] === 0 && initialPosition.current[1] === 0;
    const movementFactor = isMiddleShape ? 0.8 : 0.5; // More movement for middle shape

    // Apply slight position offset based on mouse position
    const targetX = initialPosition.current[0] + mousePosition.x * movementFactor;
    const targetY = initialPosition.current[1] + mousePosition.y * movementFactor;

    // Smooth lerping for more natural movement using our custom lerp function
    groupRef.current.position.x = lerp(
      groupRef.current.position.x,
      targetX,
      0.07
    );
    groupRef.current.position.y = lerp(
      groupRef.current.position.y,
      targetY,
      0.07
    );
    groupRef.current.position.z = lerp(
      groupRef.current.position.z,
      initialPosition.current[2],
      0.07
    );
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
