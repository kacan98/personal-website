import React, { useState, useMemo } from "react";
import { Box } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";

const StaticShapes = () => {
  const [clickedShape, setClickedShape] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleShapeClick = (shapeName: string) => {
    setClickedShape(shapeName);
    setTimeout(() => setClickedShape(null), 500);
  };

  return (
    <Box
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          maxWidth: '600px',
          maxHeight: '600px',
          position: 'relative',
          margin: 'auto',
          overflow: 'visible',
        }}
      >
      <motion.div
        style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          top: 'calc(50% - 80px)',
          left: 'calc(50% - 80px)',
          zIndex: 5,
          cursor: 'pointer',
        }}
        animate={prefersReducedMotion ? {} : {
          rotateZ: 360,
          scale: clickedShape === 'dodecahedron' ? [1, 1.3, 1] : 1,
        }}
        transition={{
          rotateZ: {
            duration: 30, // Slower rotation
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 0.5,
            ease: "easeOut",
          }
        }}
        onClick={() => handleShapeClick('dodecahedron')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: `
              conic-gradient(from 45deg, #ff4081, #ff6500, #e91e63, #ff1744, #ff4081),
              radial-gradient(circle at 35% 35%, rgba(255, 64, 129, 1), rgba(74, 0, 36, 0.8))
            `,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            borderRadius: '15px',
            border: '3px solid rgba(255, 64, 129, 0.6)',
            boxShadow: '0 0 20px rgba(255, 64, 129, 0.5)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '15%',
              left: '15%',
              width: '70%',
              height: '70%',
              background: 'radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.8), rgba(255,100,180,0.4) 40%, transparent 70%)',
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            },
          }}
        />
      </motion.div>

      <EllipticalOrbitingShape 
        size={100} 
        startAngle={0}
        component={TorusShape}
        onClick={() => handleShapeClick('torus')}
        isClicked={clickedShape === 'torus'}
      />
      <EllipticalOrbitingShape 
        size={95} 
        startAngle={72}
        component={HeartShape}
        onClick={() => handleShapeClick('heart')}
        isClicked={clickedShape === 'heart'}
      />
      <EllipticalOrbitingShape 
        size={105} 
        startAngle={144}
        component={KnotShape}
        onClick={() => handleShapeClick('knot')}
        isClicked={clickedShape === 'knot'}
      />
      <EllipticalOrbitingShape 
        size={90} 
        startAngle={216}
        component={BoxShape}
        onClick={() => handleShapeClick('box')}
        isClicked={clickedShape === 'box'}
      />
      <EllipticalOrbitingShape 
        size={85} 
        startAngle={288}
        component={CrossShape}
        onClick={() => handleShapeClick('cross')}
        isClicked={clickedShape === 'cross'}
      />
    </Box>
  );
};

function EllipticalOrbitingShape({ 
  size, 
  startAngle,
  component: ShapeComponent,
  onClick,
  isClicked,
}: {
  size: number;
  startAngle: number;
  component: React.ComponentType<{ size: number }>;
  onClick?: () => void;
  isClicked?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  
  // Memoize calculations
  const { positions, scales, depths } = useMemo(() => {
    const horizontalRadius = 160;
    const verticalRadius = 80;
    const pathPoints = 40; // Slightly reduced from 60
    
    const positions = [];
    const scales = [];
    const depths = [];
    
    for (let i = 0; i <= pathPoints; i++) {
      const angle = ((startAngle + (i * 360) / pathPoints) * Math.PI) / 180;
      const x = Math.round(Math.cos(angle) * horizontalRadius * 1000) / 1000;
      const y = Math.round(Math.sin(angle) * verticalRadius * 1000) / 1000;
      const depth = Math.round(Math.sin(angle) * 1000) / 1000;
      
      positions.push({ x, y });
      scales.push(Math.round((1 + depth * 0.3) * 1000) / 1000);
      depths.push(depth);
    }
    
    return { positions, scales, depths };
  }, [startAngle]);
  
  // Round initial values to avoid hydration mismatches
  const initialAngle = (startAngle * Math.PI) / 180;
  const initialX = Math.round((Math.cos(initialAngle) * 160 - size/2) * 1000) / 1000;
  const initialY = Math.round((Math.sin(initialAngle) * 80 - size/2) * 1000) / 1000;
  const initialDepth = Math.round(Math.sin(initialAngle) * 1000) / 1000;
  const initialScale = Math.round((1 + initialDepth * 0.3) * 1000) / 1000;

  if (prefersReducedMotion) {
    // Static version for reduced motion
    return (
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${size}px`,
          height: `${size}px`,
          x: initialX,
          y: initialY,
          scale: initialScale,
          zIndex: initialDepth > 0 ? 10 : 1,
          cursor: 'pointer',
        }}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ShapeComponent size={size} />
      </motion.div>
    );
  }

  return (
    <>
      {/* Back layer - behind center */}
      <motion.div
        initial={{
          x: initialX,
          y: initialY,
          scale: initialScale,
          opacity: initialDepth <= 0 ? 1 : 0,
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${size}px`,
          height: `${size}px`,
          zIndex: 1,
          cursor: 'pointer',
        }}
        animate={{
          x: positions.map(p => p.x - size/2),
          y: positions.map(p => p.y - size/2),
          scale: isClicked ? scales.map(s => s * 1.5) : scales,
          opacity: depths.map(d => d <= 0 ? 1 : 0),
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ShapeComponent size={size} />
      </motion.div>
      
      {/* Front layer - in front of center */}
      <motion.div
        initial={{
          x: initialX,
          y: initialY,
          scale: initialScale,
          opacity: initialDepth > 0 ? 1 : 0,
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${size}px`,
          height: `${size}px`,
          zIndex: 10,
          cursor: 'pointer',
        }}
        animate={{
          x: positions.map(p => p.x - size/2),
          y: positions.map(p => p.y - size/2),
          scale: isClicked ? scales.map(s => s * 1.5) : scales,
          opacity: depths.map(d => d > 0 ? 1 : 0),
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ShapeComponent size={size} />
      </motion.div>
    </>
  );
}

// Simplified shape components
function TorusShape({ size }: { size: number }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { rotateZ: 360 }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `linear-gradient(135deg, #9c27b0, #e91e63)`,
          boxShadow: `0 0 20px rgba(156, 39, 176, 0.5)`,
          border: '2px solid rgba(156, 39, 176, 0.4)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'rgba(52, 1, 55, 0.4)',
          },
        }}
      />
    </motion.div>
  );
}

function KnotShape({ size }: { size: number }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { rotateZ: 360 }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, #ffff00, #ffc107)`,
          borderRadius: '40% 60% 65% 35% / 30% 45% 55% 70%',
          boxShadow: `0 0 25px rgba(255, 255, 0, 0.5)`,
          border: '2px solid rgba(255, 255, 0, 0.15)',
        }}
      />
    </motion.div>
  );
}

function BoxShape({ size }: { size: number }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { rotateZ: 360 }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, #4169e1, #1e90ff)`,
          borderRadius: '8px',
          boxShadow: `0 0 25px rgba(65, 105, 225, 0.5)`,
          border: '2px solid rgba(65, 105, 225, 0.15)',
        }}
      />
    </motion.div>
  );
}

function HeartShape({ size }: { size: number }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : {
        scale: [1, 1.1, 1],
      }}
      transition={{
        scale: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, #ff1493, #ff69b4)`,
          clipPath: 'polygon(50% 85%, 15% 45%, 15% 25%, 35% 15%, 50% 25%, 65% 15%, 85% 25%, 85% 45%)',
          borderRadius: '20px 20px 0 0',
          boxShadow: `0 0 20px rgba(255, 20, 147, 0.5)`,
          border: '2px solid rgba(255, 20, 147, 0.4)',
        }}
      />
    </motion.div>
  );
}

function CrossShape({ size }: { size: number }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { rotateZ: 360 }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'transparent',
        }}
      >
        {/* Vertical bar */}
        <Box
          sx={{
            position: 'absolute',
            top: '0%',
            left: '35%',
            width: '30%',
            height: '100%',
            background: `linear-gradient(180deg, #fc466b, #3f5efb)`,
            borderRadius: '15px',
            boxShadow: `0 0 20px rgba(252, 70, 107, 0.5)`,
          }}
        />
        {/* Horizontal bar */}
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            left: '0%',
            width: '100%',
            height: '30%',
            background: `linear-gradient(90deg, #fc466b, #3f5efb)`,
            borderRadius: '15px',
            boxShadow: `0 0 20px rgba(252, 70, 107, 0.5)`,
          }}
        />
      </Box>
    </motion.div>
  );
}

export default StaticShapes;