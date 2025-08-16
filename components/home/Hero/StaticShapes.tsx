import React, { useState } from "react";
import { Box } from "@mui/material";
import { motion } from "motion/react";

const StaticShapes = () => {
  const [clickedShape, setClickedShape] = useState<string | null>(null);

  const handleShapeClick = (shapeName: string) => {
    setClickedShape(shapeName);
    setTimeout(() => setClickedShape(null), 500);
  };

  return (
    <Box
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          maxWidth: '600px', // Much larger container
          maxHeight: '600px',
          position: 'relative',
          margin: 'auto',
          overflow: 'visible', // Ensure shapes aren't clipped
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
        animate={{
          rotateZ: 360,
          scale: clickedShape === 'dodecahedron' ? [1, 1.3, 1] : 1,
        }}
        transition={{
          rotateZ: {
            duration: 21,
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
        <motion.div
          animate={{
            filter: [
              'drop-shadow(0 0 20px rgba(255, 64, 129, 0.8)) drop-shadow(0 0 40px rgba(255, 64, 129, 0.6))',
              'drop-shadow(0 0 30px rgba(255, 64, 129, 1)) drop-shadow(0 0 60px rgba(255, 64, 129, 0.8))',
              'drop-shadow(0 0 20px rgba(255, 64, 129, 0.8)) drop-shadow(0 0 40px rgba(255, 64, 129, 0.6))',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
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
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '35%',
                height: '35%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                filter: 'blur(1px)',
              },
            }}
          />
        </motion.div>
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
  component: React.ComponentType<{ size: number; currentAngle?: number }>;
  onClick?: () => void;
  isClicked?: boolean;
}) {
  // Create smooth elliptical motion
  const horizontalRadius = 160; // Much wider horizontal orbit
  const verticalRadius = 80;    // Compressed vertical for 3D effect
  
  // Generate smooth path with many points for fluid motion
  const pathPoints = 60; // More points = smoother motion
  const positions = [];
  const scales = [];
  const depths = [];
  const angles = []; // Store angles for moon phase calculation
  
  for (let i = 0; i <= pathPoints; i++) {
    const angle = ((startAngle + (i * 360) / pathPoints) * Math.PI) / 180;
    const x = Math.cos(angle) * horizontalRadius;
    const y = Math.sin(angle) * verticalRadius;
    const depth = Math.sin(angle); // Top = front, Bottom = back
    
    positions.push({ x, y });
    scales.push(1 + depth * 0.3); // Front = bigger, Back = smaller
    depths.push(depth);
    angles.push(startAngle + (i * 360) / pathPoints); // Store angle in degrees
  }
  
  // Calculate initial position to avoid jump
  const initialAngle = (startAngle * Math.PI) / 180;
  const initialX = Math.cos(initialAngle) * horizontalRadius - size/2;
  const initialY = Math.sin(initialAngle) * verticalRadius - size/2;
  const initialDepth = Math.sin(initialAngle); // Top = front, Bottom = back
  const initialScale = 1 + initialDepth * 0.3;

  return (
    <>
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
          "--current-angle": angles,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{
            rotateY: isClicked ? [0, 360] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <ShapeComponent size={size} />
        </motion.div>
      </motion.div>
      
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
          "--current-angle": angles,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{
            rotateY: isClicked ? [0, 360] : 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <ShapeComponent size={size} />
        </motion.div>
      </motion.div>
    </>
  );
}

// Shape Components with proper sizing
function TorusShape({ size }: { size: number }) {
  return (
    <motion.div
      animate={{
        rotateZ: 360,
      }}
      transition={{
        duration: 15, // Slow self-rotation
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
          background: `
            conic-gradient(from 45deg, #9c27b0, #e91e63, #d81b60, #9c27b0),
            radial-gradient(circle at 30% 30%, rgba(156, 39, 176, 0.9), rgba(52, 1, 55, 0.6))
          `,
          boxShadow: `
            0 0 30px rgba(156, 39, 176, 0.7),
            0 10px 25px rgba(156, 39, 176, 0.4),
            inset 0 0 20px rgba(52, 1, 55, 0.4)
          `,
          border: '2px solid rgba(156, 39, 176, 0.4)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(156, 39, 176, 0.2), rgba(52, 1, 55, 0.6))',
            border: '1px solid rgba(156, 39, 176, 0.3)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '25%',
            height: '25%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            filter: 'blur(1px)',
          },
        }}
      />
    </motion.div>
  );
}



function KnotShape({ size }: { size: number }) {
  return (
    <motion.div
      animate={{
        rotateZ: 360,
      }}
      transition={{
        duration: 8, // Fast self-rotation
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
          background: `
            conic-gradient(from 90deg, #ffff00, #ffc107, #fff59d, #ffff00),
            radial-gradient(ellipse at 35% 35%, rgba(255, 255, 0, 1), rgba(107, 107, 0, 0.7))
          `,
          borderRadius: '40% 60% 65% 35% / 30% 45% 55% 70%',
          boxShadow: `
            0 0 35px rgba(255, 255, 0, 0.8),
            0 12px 25px rgba(255, 255, 0, 0.4),
            inset 0 0 20px rgba(107, 107, 0, 0.5)
          `,
          border: '2px solid rgba(255, 255, 0, 0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '70%',
            height: '70%',
            background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.15), transparent 50%)',
            borderRadius: '40% 60% 65% 35% / 30% 45% 55% 70%',
          },
        }}
      />
    </motion.div>
  );
}

function BoxShape({ size }: { size: number }) {
  return (
    <motion.div
      animate={{
        rotateZ: 360,
      }}
      transition={{
        duration: 12, // Medium self-rotation
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
          background: `
            linear-gradient(135deg, #4169e1, #1e90ff, #87ceeb, #4169e1),
            radial-gradient(circle at 30% 30%, rgba(65, 105, 225, 1), rgba(26, 42, 94, 0.7))
          `,
          borderRadius: '8px',
          boxShadow: `
            0 0 35px rgba(65, 105, 225, 0.8),
            0 12px 25px rgba(65, 105, 225, 0.5),
            inset 0 0 20px rgba(26, 42, 94, 0.5)
          `,
          border: '2px solid rgba(65, 105, 225, 0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 30%, transparent 70%, rgba(65, 105, 225, 0.1) 100%)',
            borderRadius: '8px',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '25%',
            height: '25%',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            filter: 'blur(1px)',
          },
        }}
      />
    </motion.div>
  );
}




function HeartShape({ size }: { size: number }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        filter: [
          'drop-shadow(0 0 20px rgba(255, 20, 147, 0.8)) drop-shadow(0 0 40px rgba(255, 20, 147, 0.6))',
          'drop-shadow(0 0 30px rgba(255, 20, 147, 1)) drop-shadow(0 0 60px rgba(255, 20, 147, 0.8))',
          'drop-shadow(0 0 20px rgba(255, 20, 147, 0.8)) drop-shadow(0 0 40px rgba(255, 20, 147, 0.6))',
        ],
      }}
      transition={{
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        filter: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }
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
          background: `
            conic-gradient(from 45deg, #ff1493, #ff69b4, #ffb6c1, #ffc0cb, #ff1493),
            radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 20, 147, 1) 60%)
          `,
          clipPath: 'polygon(50% 85%, 15% 45%, 15% 25%, 35% 15%, 50% 25%, 65% 15%, 85% 25%, 85% 45%)',
          borderRadius: '20px 20px 0 0',
          boxShadow: `
            0 0 30px rgba(255, 20, 147, 0.7),
            0 10px 25px rgba(255, 20, 147, 0.4),
            inset 0 0 20px rgba(139, 0, 69, 0.4)
          `,
          border: '2px solid rgba(255, 20, 147, 0.4)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '70%',
            height: '70%',
            background: 'radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.8), rgba(255,20,147,0.4) 40%, transparent 70%)',
            clipPath: 'polygon(50% 85%, 15% 45%, 15% 25%, 35% 15%, 50% 25%, 65% 15%, 85% 25%, 85% 45%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '35%',
            height: '35%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            clipPath: 'polygon(50% 85%, 15% 45%, 15% 25%, 35% 15%, 50% 25%, 65% 15%, 85% 25%, 85% 45%)',
            filter: 'blur(1px)',
          },
        }}
      />
    </motion.div>
  );
}







function CrossShape({ size }: { size: number }) {
  return (
    <motion.div
      animate={{
        rotateZ: 360,
      }}
      transition={{
        duration: 6,
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
            boxShadow: `
              0 0 40px rgba(252, 70, 107, 0.8),
              inset 0 5px 15px rgba(255, 255, 255, 0.4)
            `,
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
            boxShadow: `
              0 0 40px rgba(252, 70, 107, 0.8),
              inset 0 5px 15px rgba(255, 255, 255, 0.4)
            `,
          }}
        />
      </Box>
    </motion.div>
  );
}


export default StaticShapes;