"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";

const RODICE_IMAGES = [
  "FullSizeRender.jpeg",
  "IMG_1337.jpeg",
  "IMG_1905.jpeg",
  "IMG_1936.jpeg",
  "IMG_1940.jpeg",
  "IMG_3335.jpeg",
  "IMG_3774.jpeg",
  "IMG_3875.jpeg",
  "IMG_5399.jpeg",
  "IMG_5405.jpeg",
  "IMG_7797.jpg",
  "IMG_8067.jpeg",
  "IMG_9483.jpeg",
];

export function RodiceSlideshow() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [autoplayPlugin.current]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Set initial index and scroll snaps
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());

    // Listen to select events
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const onPrevClick = React.useCallback(() => {
    if (emblaApi) {
      autoplayPlugin.current.reset();
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const onNextClick = React.useCallback(() => {
    if (emblaApi) {
      autoplayPlugin.current.reset();
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: "80vh" }}>
      {/* Main Carousel */}
      <Box
        ref={emblaRef}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          flex: 1,
          minHeight: "calc(80vh - 120px)", // Reserve space for controls
        }}
      >
        <Box
          sx={{
            display: "flex",
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
            height: "100%",
          }}
        >
          {RODICE_IMAGES.map((image, index) => (
            <Box
              key={index}
              sx={{
                flex: "0 0 100%",
                minWidth: 0,
                backgroundColor: "#000",
                position: "relative",
                height: "100%",
                width: "100%",
              }}
            >
              <Image
                src={`/images/rodice/${image}`}
                alt={`Photo ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                priority={index === 0}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Navigation Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          py: 2,
        }}
      >
        <IconButton
          onClick={onPrevClick}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Typography variant="body2" sx={{ flex: 1, textAlign: "center" }}>
          {selectedIndex + 1} / {RODICE_IMAGES.length}
        </Typography>

        <IconButton
          onClick={onNextClick}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Dot Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
          py: 1,
        }}
      >
        {scrollSnaps.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              if (emblaApi) {
                autoplayPlugin.current.reset();
                emblaApi.scrollTo(index);
              }
            }}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: index === selectedIndex ? "primary.main" : "divider",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: index === selectedIndex ? "primary.dark" : "action.hover",
              },
            }}
          />
        ))}
      </Box>

      {/* Info Box */}
      <Paper
        sx={{
          p: 1,
          backgroundColor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {RODICE_IMAGES[selectedIndex]}
        </Typography>
      </Paper>
    </Box>
  );
}
