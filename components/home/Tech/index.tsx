"use client";

import React, { useState } from "react";
import { MdCircle } from "react-icons/md";
import { Box, Typography } from "@mui/material";
import { motion } from "motion/react";

export interface TechItem {
  name: string;
  color?: string;
}

export type TechListProps = {
  title?: string;
  technologies: TechItem[];
};

const TechList = ({ title, technologies }: TechListProps): JSX.Element => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Box
      component="section"
      sx={{
        overflow: "hidden",
        py: { xs: 2, md: 4 },
        width: "100%",
      }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          px: 3,
          mb: 4,
        }}
      >
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                mb: 4,
                textAlign: "center",
              }}
            >
              {title}
            </Typography>
          </motion.div>
        )}
      </Box>

      {technologies.map(({ name, color }, index) => {
        const totalItems = 5; // Show only 5 items total
        const centerIndex = 2; // Middle item is always highlighted
        const direction = index % 2 === 0 ? 1 : -1;
        
        // Calculate move distance based on screen width to go edge to edge
        const moveDistance = typeof window !== 'undefined' ? window.innerWidth / 3 : 400;
        
        return (
          <motion.div
            key={index}
            initial={{ x: -direction * moveDistance, opacity: 0 }}
            animate={{ 
              x: [
                -direction * moveDistance,
                direction * moveDistance,
                -direction * moveDistance
              ],
            }}
            whileInView={{ opacity: 1 }}
            transition={{ 
              x: {
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              },
              opacity: {
                duration: 0.5,
                delay: index * 0.1
              }
            }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Box
              sx={{
                mb: { xs: 1, md: 2 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1, md: 2 },
                color: "text.secondary",
                width: "100%",
                position: "relative",
                minHeight: { xs: "4rem", sm: "5rem", md: "7rem", lg: "8rem" },
              }}
              aria-label={name || ""}
            >
              {Array.from({ length: totalItems }, (_, itemIndex) => {
                const isCenter = itemIndex === centerIndex;
                
                return (
                  <React.Fragment key={itemIndex}>
                    <motion.div
                      onHoverStart={() => isCenter && setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                      whileHover={isCenter ? { 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      } : {}}
                      whileTap={isCenter ? { scale: 0.95 } : {}}
                      style={{ 
                        cursor: isCenter ? 'pointer' : 'default',
                        position: isCenter ? 'sticky' : 'relative',
                        left: isCenter ? '50%' : 'auto',
                        transform: isCenter ? 'translateX(-50%)' : 'none',
                        zIndex: isCenter ? 10 : 1,
                      }}
                    >
                      <Typography
                        className="tech-item"
                        sx={{
                          fontSize: { 
                            xs: isCenter ? "3rem" : "2.5rem", 
                            sm: isCenter ? "4rem" : "3.5rem", 
                            md: isCenter ? "5.5rem" : "5rem", 
                            lg: isCenter ? "6.5rem" : "6rem" 
                          },
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.05em",
                          color: isCenter && color ? color : "inherit",
                          opacity: isCenter ? 1 : 0.1,
                          textShadow: "0 0 1px currentColor",
                          WebkitTextStroke: "0.5px currentColor",
                          ...(isCenter && {
                            position: "relative",
                            zIndex: 10,
                            filter: hoveredIndex === index ? "brightness(1.5)" : "brightness(1.2)",
                            textShadow: hoveredIndex === index 
                              ? `0 0 40px ${color || "currentColor"}, 0 0 80px ${color || "currentColor"}`
                              : `0 0 20px ${color || "currentColor"}`,
                            transition: "all 0.3s ease",
                          }),
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {name}
                      </Typography>
                    </motion.div>
                    <motion.div
                      animate={isCenter || itemIndex === centerIndex - 1 ? {
                        rotate: 360,
                      } : {}}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                          display: "flex",
                          alignItems: "center",
                          opacity: isCenter || itemIndex === centerIndex - 1 ? 0.3 : 0.1,
                          flexShrink: 0,
                          color: isCenter || itemIndex === centerIndex - 1 ? color : "inherit",
                        }}
                      >
                        <MdCircle />
                      </Box>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </Box>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default TechList;