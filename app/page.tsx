import Hero from "@/components/home/Hero";
import SocialIcons from "@/components/home/socialIcons";
import ContentContainer from "@/components/layout/ContentContainer";
import ThreeDLaptop from "@/components/spline/laptop";
import { isKarelsPortfolio } from "@/globalVars";
import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const aboutMe = [
  {
    header: "Web developer 🌐",
    content:
      "I am a web develper, mainly with experience on the frontend side, but also with some backend experience. I love the challenge of brining a design to life and making it functional.",
  },
  {
    header: "Marketer turned developer 🚀",
    content:
      "I studied and worked in makreting before I found my true passion in coding. I love to combine my customer-centric approach with my technical skills to create the best possible solutions.",
  },
  {
    header: "Fast learner 🕵️",
    content:
      "With the world of tech constantly evolving, I'm always eager to learn new things. I'm a quick study and I'm no stranger to diving into the unknown.",
  },
  {
    header: "Passionate about design 🎨",
    content:
      "Apart from coding, I've spent countless hours designing graphics, animations, wireframes and mockups.",
  },
];

export default async function App() {
  return (
    <>
      <ContentContainer fullWidth>
        <Hero firstName="Karel" lastName="Čančara" tagLine="Software Developer" />
      </ContentContainer>
      <SocialIcons direction={"column"} />
      {isKarelsPortfolio && (
        <>
          <ContentContainer fullWidth background="background.default">
            <Grid2
              container
              width="100%"
              color="text.primary"
              spacing={2}
              pt={4}
              alignItems="center"
              justifyContent="center"
            >
              <Grid2 lg={3} xs={12}>
                {aboutMe.slice(0, 2).map(({ header, content }) => {
                  return (
                    <Box key={header}>
                      <h1>{header}</h1>
                      <p>{content}</p>
                    </Box>
                  );
                })}
              </Grid2>
              <Grid2
                lg={6}
                xs={12}
                sx={{
                  width: "100%",
                  height: "100%",
                  zIndex: 5,
                  position: "relative",
                }}
              >
                <ThreeDLaptop />
              </Grid2>
              <Grid2 lg={3} xs={12}>
                {aboutMe.slice(2, 4).map(({ header, content }) => {
                  return (
                    <Box key={header}>
                      <h1>{header}</h1>
                      <p>{content}</p>
                    </Box>
                  );
                })}
              </Grid2>
            </Grid2>
          </ContentContainer>
          <ContentContainer fullWidth background="background.default">
            <Box
              sx={{
                color: "text.primary",
                textAlign: "center",
              }}
            >
              © Karel Čančara {new Date().getFullYear()}
            </Box>
          </ContentContainer>				</>
      )}
    </>
  );
}
