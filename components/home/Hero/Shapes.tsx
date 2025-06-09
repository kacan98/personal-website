"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Box, styled } from "@mui/material";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CanvasContainer = styled(Box)(({ theme }) => ({
  aspectRatio: '1 / 1',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
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
    <CanvasContainer>
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
    }[]
    = [
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
        geometry: new THREE.TorusKnotGeometry(0.8, 0.2, 64, 16, 2, 3), // Knot (back, left)
      },
      {
        position: [1.2, 1.7, -2],
        r: 0.6,
        geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5), // Cube (back, right)
      },
    ];
  const soundEffects = [
    new Audio("/sounds/hit1.ogg"),
    new Audio("/sounds/hit2.ogg"),
    new Audio("/sounds/hit3.ogg"),
    new Audio("/sounds/hit4.ogg"),
    new Audio("/sounds/hit6.ogg"),
    new Audio("/sounds/hit7.ogg"),
    new Audio("/sounds/hit8.ogg"),
  ]; const materials = [
    // Rainbow/Iridescent Material - keeping this one since it's cool
    new THREE.MeshNormalMaterial(),
    // Neon/Candy like colors with enhanced glow effects
    new THREE.MeshPhysicalMaterial({
      roughness: 0.1,
      metalness: 0.6,
      color: 0x9c27b0, // Bright purple
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      emissive: 0x340137, // Subtle glow
      emissiveIntensity: 2.5,
    }),
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
  ];

  return geometries.map(({ position, r, geometry }) => (
    <Geometry
      key={JSON.stringify(position)} // Unique key
      position={position.map((p) => p * 2) as [number, number, number]}
      geometry={geometry}
      soundEffects={soundEffects}
      materials={materials}
      r={r}
      mousePosition={mousePosition}
    />
  ));
}

function Geometry({ r, position, geometry, soundEffects, materials, mousePosition }: {
  r: number;
  position: [number, number, number];
  geometry: THREE.BufferGeometry;
  soundEffects: HTMLAudioElement[];
  materials: THREE.Material[];
  mousePosition: { x: number; y: number; };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  // Remove the unused state variable entirely
  const setVisible = useState(false)[1];
  const floatRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.Material>();
  const initialPosition = useRef([...position]); // Create a copy of the position array

  // Initialize material only once
  useEffect(() => {
    if (!materialRef.current) {
      materialRef.current = gsap.utils.random(materials);
    }
  }, [materials]);
  function getRandomMaterial() {
    return gsap.utils.random(materials);
  }

  function handleClick(e: {
    object: THREE.Object3D;
  }) {
    const mesh = e.object;

    gsap.utils.random(soundEffects).play();

    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random(0, 2)}`,
      y: `+=${gsap.utils.random(0, 2)}`,
      z: `+=${gsap.utils.random(0, 2)}`,
      duration: 1.3,
      ease: "elastic.out(1,0.3)",
      yoyo: true,
    });

    // Only change material on click
    materialRef.current = getRandomMaterial();
  }

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };
  useEffect(() => {
    const ctx = gsap.context(() => {
      setVisible(true);
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
    });
    return () => ctx.revert();
  }, []);

  // Apply subtle movement based on mouse position
  useFrame(() => {
    if (groupRef.current && mousePosition) {
      // Detect if this is the middle (largest) shape
      const isMiddleShape = initialPosition.current[0] === 0 && initialPosition.current[1] === 0;
      const movementFactor = isMiddleShape ? 0.8 : 0.5; // More movement for middle shape

      // Apply slight position offset based on mouse position
      const targetX = initialPosition.current[0] + mousePosition.x * movementFactor;
      const targetY = initialPosition.current[1] + mousePosition.y * movementFactor;

      // Smooth lerping for more natural movement using our custom lerp function
      if (groupRef.current) {
        groupRef.current.position.x = lerp(
          groupRef.current.position.x,
          targetX,
          isMiddleShape ? 0.07 : 0.05 // Faster response for middle shape
        );
        groupRef.current.position.y = lerp(
          groupRef.current.position.y,
          targetY,
          isMiddleShape ? 0.07 : 0.05
        );
      }
    }    
    // Always update mesh material to the current materialRef value
    if (meshRef.current) {
      if (materialRef.current) {
        meshRef.current.material = materialRef.current;
      }
      if (geometry && !meshRef.current.geometry) {
        meshRef.current.geometry = geometry;
      }
    }
  }); return (
    <group ref={groupRef}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r} ref={floatRef}>
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </Float>
    </group>
  );
}
