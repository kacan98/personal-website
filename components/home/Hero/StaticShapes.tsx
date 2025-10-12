import React, { useState, useMemo } from "react";
import { Box } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import { BRAND_COLORS, SHAPE_COLORS } from "@/app/colors";

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
          cursor: 'default',
        }}
        animate={prefersReducedMotion ? {} : {
          rotateZ: -360,
          scale: clickedShape === 'dodecahedron' ? 1.1 : 1,
        }}
        transition={{
          rotateZ: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 0.3,
            ease: "backOut",
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleShapeClick('dodecahedron')}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: `
              conic-gradient(from 45deg, ${BRAND_COLORS.accent}, ${BRAND_COLORS.accent}, ${BRAND_COLORS.accent}, ${BRAND_COLORS.accent}, ${BRAND_COLORS.accent}),
              radial-gradient(circle at 35% 35%, rgba(${BRAND_COLORS.accentRgb}, 1), rgba(${BRAND_COLORS.accentRgb}, 0.8))
            `,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            borderRadius: '15px',
            border: `3px solid rgba(${BRAND_COLORS.accentRgb}, 0.6)`,
            boxShadow: `0 0 25px rgba(${BRAND_COLORS.accentRgb}, 0.6)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '15%',
              left: '15%',
              width: '70%',
              height: '70%',
              background: `radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.8), rgba(${BRAND_COLORS.accentRgb},0.4) 40%, transparent 70%)`,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            },
          }}
        />
      </motion.div>

      <EllipticalOrbitingShape 
        size={70} 
        startAngle={0}
        component={TorusShape}
        onClick={() => handleShapeClick('torus')}
        isClicked={clickedShape === 'torus'}
      />
      <EllipticalOrbitingShape 
        size={65} 
        startAngle={72}
        component={HeartShape}
        onClick={() => handleShapeClick('heart')}
        isClicked={clickedShape === 'heart'}
      />
      <EllipticalOrbitingShape 
        size={51} 
        startAngle={144}
        component={KnotShape}
        onClick={() => handleShapeClick('knot')}
        isClicked={clickedShape === 'knot'}
      />
      <EllipticalOrbitingShape 
        size={60} 
        startAngle={216}
        component={BoxShape}
        onClick={() => handleShapeClick('box')}
        isClicked={clickedShape === 'box'}
      />
      <EllipticalOrbitingShape 
        size={75} 
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
  isClicked: _isClicked,
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
      const x = Math.round(-Math.cos(angle) * horizontalRadius * 1000) / 1000;
      const y = Math.round(-Math.sin(angle) * verticalRadius * 1000) / 1000;
      
      // Use negative sine for front/back depth (bottom = front/biggest, top = back/smallest)
      // -sin(90°) = -1 (top/back), -sin(270°) = 1 (bottom/front)
      const depth = Math.round(-Math.sin(angle) * 1000) / 1000;
      
      positions.push({ x, y });
      scales.push(Math.round((1 + depth * 0.48) * 1000) / 1000);
      depths.push(depth);
    }
    
    return { positions, scales, depths };
  }, [startAngle]);
  
  // Round initial values to avoid hydration mismatches
  const initialAngle = (startAngle * Math.PI) / 180;
  const initialX = Math.round((-Math.cos(initialAngle) * 160 - size/2) * 1000) / 1000;
  const initialY = Math.round((-Math.sin(initialAngle) * 80 - size/2) * 1000) / 1000;
  // Use negative sine for proper 3D depth calculation  
  const initialDepth = Math.round(-Math.sin(initialAngle) * 1000) / 1000;
  const initialScale = Math.round((1 + initialDepth * 0.48) * 1000) / 1000;

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
          cursor: 'default',
        }}
        onClick={onClick}
      >
        <ShapeComponent size={size} />
      </motion.div>
    );
  }

  return (
    <>
      {/* Back layer - behind center (top/smaller) */}
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
          cursor: 'default',
        }}
        animate={{
          x: positions.map(p => p.x - size/2),
          y: positions.map(p => p.y - size/2),
          scale: scales,
          opacity: depths.map(d => d <= 0 ? 1 : 0),
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        onClick={onClick}
      >
        <ShapeComponent size={size} />
      </motion.div>
      
      {/* Front layer - in front of center (bottom/bigger) */}
      <motion.div
        initial={{
          x: initialX,
          y: initialY,
          scale: initialScale,
          opacity: initialDepth >= 0 ? 1 : 0,
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${size}px`,
          height: `${size}px`,
          zIndex: 10,
          cursor: 'default',
        }}
        animate={{
          x: positions.map(p => p.x - size/2),
          y: positions.map(p => p.y - size/2),
          scale: scales,
          opacity: depths.map(d => d >= 0 ? 1 : 0),
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        onClick={onClick}
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
      animate={prefersReducedMotion ? {} : {}}
      transition={{}}
      whileHover={{ 
        scale: 1.2,
        rotateX: 15,
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
          background: `linear-gradient(135deg, ${SHAPE_COLORS.lightPurple}, ${SHAPE_COLORS.deepPurple})`,
          boxShadow: `0 0 25px rgba(${SHAPE_COLORS.lightPurpleRgb}, 0.4)`,
          border: `2px solid rgba(${SHAPE_COLORS.lightPurpleRgb}, 0.3)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: `rgba(${SHAPE_COLORS.lightPurpleRgb}, 0.3)`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            background: `rgba(255, 255, 255, 0.4)`,
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
      animate={prefersReducedMotion ? {} : { rotateZ: -360 }}
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
          background: `linear-gradient(135deg, ${SHAPE_COLORS.gold}, ${SHAPE_COLORS.lavender})`,
          borderRadius: '40% 60% 65% 35% / 30% 45% 55% 70%',
          boxShadow: `0 0 25px rgba(${SHAPE_COLORS.goldRgb}, 0.4)`,
          border: `2px solid rgba(${SHAPE_COLORS.goldRgb}, 0.3)`,
        }}
      />
    </motion.div>
  );
}

function BoxShape({ size }: { size: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { rotateZ: -360 }}
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
          background: `linear-gradient(135deg, ${SHAPE_COLORS.gold}, ${BRAND_COLORS.accent})`,
          borderRadius: '8px',
          boxShadow: `0 0 25px rgba(${SHAPE_COLORS.goldRgb}, 0.4)`,
          border: `2px solid rgba(${SHAPE_COLORS.goldRgb}, 0.3)`,
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
          background: `linear-gradient(135deg, ${SHAPE_COLORS.deepPurple}, ${SHAPE_COLORS.gold})`,
          clipPath: 'polygon(50% 85%, 15% 45%, 15% 25%, 35% 15%, 50% 25%, 65% 15%, 85% 25%, 85% 45%)',
          borderRadius: '20px 20px 0 0',
          border: `2px solid rgba(${SHAPE_COLORS.deepPurpleRgb}, 0.3)`,
          filter: `drop-shadow(0 0 25px rgba(${SHAPE_COLORS.deepPurpleRgb}, 0.4))`,
        }}
      />
    </motion.div>
  );
}

function CrossShape({ size }: { size: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { rotateZ: -360 }}
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
            background: `linear-gradient(180deg, ${SHAPE_COLORS.lavender}, ${SHAPE_COLORS.deepPurple})`,
            borderRadius: '15px',
            boxShadow: `0 0 25px rgba(${SHAPE_COLORS.lavenderRgb}, 0.4)`,
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
            background: `linear-gradient(90deg, ${SHAPE_COLORS.deepPurple}, ${SHAPE_COLORS.gold})`,
            borderRadius: '15px',
            boxShadow: `0 0 25px rgba(${SHAPE_COLORS.goldRgb}, 0.4)`,
          }}
        />
      </Box>
    </motion.div>
  );
}

export default StaticShapes;