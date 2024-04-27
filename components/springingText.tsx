"use client";
import React, { useEffect, useState } from "react";
import { a, useTrail } from "@react-spring/web";
import { Typography } from "@mui/material";

type AnimatedTextProps = {
  texts: string[];
};

const AnimatedText = ({ texts }: AnimatedTextProps) => {
  const [{ open, chars, index }, setState] = useState({
    open: true,
    index: 0,
    chars: texts[0].split(""),
  });

  const [displayTime, setDisplayTime] = useState(3000); // Set initial display time to 3000 milliseconds

  const trail = useTrail(chars.length, {
    config: {
      mass: 5,
      tension: 3000,
      friction: 150,
      easing: (t) => (t < 0.5 ? 2 * t * t : t),
    },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    from: { opacity: 1, x: 20 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setState(({ open: prevOpen, index: prevIndex, chars: prevChars }) => {
        if (!prevOpen) {
          const newIdx = (prevIndex + 1) % texts.length;
          setDisplayTime(2500); // Set display time to 3000 milliseconds when text is displayed
          return {
            open: true,
            index: newIdx,
            chars: texts[newIdx].split(""),
          };
        } else {
          setDisplayTime(800); // Set display time to 1500 milliseconds when text is not displayed
          return {
            open: false,
            index: prevIndex,
            chars: prevChars,
          };
        }
      });
    }, displayTime);
    return () => clearInterval(interval);
  }, [displayTime]);

  return (
    <div>
      {trail.map(({ x, ...rest }, index) => (
        <a.span
          key={index}
          style={{
            ...rest,
            transform: x.to((x) => `translate3d(${x}px,0,0)`),
            display: "inline-block",
          }}
        >
          <Typography variant={"h5"}>
            {chars[index] === " " ? "\u00A0" : chars[index]}
          </Typography>
        </a.span>
      ))}
    </div>
  );
};

export default AnimatedText;
