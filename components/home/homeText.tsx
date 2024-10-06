import AnimatedText from "@/components/home/springingText";
import { isKarelsPortfolio } from "@/globalVars";
import { Box, Typography } from "@mui/material";
import KarelSignature from "../spline/karel";

type HomeTextProps = {
  title?: string;
  subtitles?: string[];
};

function HomeText({ title, subtitles }: HomeTextProps) {
  return (
    <Box
      sx={({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
        opacity: 0.9,
        flexDirection: "column",
        fontSize: "2rem",
        color: "text.primary",
      })}
    >
      <Box width={'300px'}>
        <Typography textAlign={"center"} variant={"h3"}>Hi, I&apos;m</Typography>
      </Box>
      {!isKarelsPortfolio && title && (
        <Box>
          <Typography textAlign={"center"} variant={"h1"}>
            {title}
          </Typography>
        </Box>
      )}
      {isKarelsPortfolio && <Box sx={{
        minWidth: '30vw',
        maxWidth: '500px',
        minHeight: '20vh',
      }}>
        {<KarelSignature />}
      </Box>}
      {subtitles && (
        <Box sx={{ opacity: 0.7 }}>
          <AnimatedText texts={subtitles} />
        </Box>
      )}
      {/*TODO: Add those?*/}
      {/*<ButtonGroup*/}
      {/*  sx={{*/}
      {/*    margin: "20px",*/}
      {/*  }}*/}
      {/*  size={"large"}*/}
      {/*>*/}
      {/*  <Button variant={"contained"}>Contact me</Button>*/}
      {/*  <Button variant={"outlined"}>Portfolio</Button>*/}
      {/*</ButtonGroup>*/}
    </Box>
  );
}

export default HomeText;
