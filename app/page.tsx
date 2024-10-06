import FullScreenPicture from "@/components/home/fullScreenPicture";
import HomeText from "@/components/home/homeText";
import SocialIcons from "@/components/home/socialIcons";
import ThreeDLaptop from "@/components/spline/laptop";
import { isKarelsPortfolio } from "@/globalVars";
import { getSettings } from "@/sanity/sanity-utils";
import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const aboutMe = [
  {
    "header": "Web developer 🌐",
    "content": "I am a web develper, mainly with experience on the frontend side, but also with some backend experience. I love the challenge of brining a design to life and making it functional."
  },
  {
    "header": "Marketer turned developer 🚀",
    "content": "I studied and worked in makreting before I found my true passion in coding. I love to combine my customer-centric approach with my technical skills to create the best possible solutions."
  },
  {
    "header": "Fast learner 🕵️",
    "content": "With the world of tech constantly evolving, I'm always eager to learn new things. I'm a quick study and I'm no stranger to diving into the unknown."
  },
  {
    "header": "Passionate about design 🎨",
    "content": "Apart from coding, I've spent countless hours designing graphics, animations, wireframes and mockups."
  }
]

export default async function App() {
  const settings = await getSettings();
  return (
    <>
      <Box
        m={0}
        sx={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <FullScreenPicture sanityImage={settings?.mainPage?.mainImage} />
        <HomeText
          title={settings?.mainPage?.title}
          subtitles={settings?.mainPage?.subtitles}
        />
        <SocialIcons direction={"column"} />
      </Box>
      {isKarelsPortfolio && <><Box
        p={4}
        sx={{
          backgroundColor: 'background.default'
        }}>
        <Box>
          <Grid2 container
            width="100%"
            color="text.primary"
            spacing={2}
            pt={4}
            alignItems='stretch'

          >
            <Grid2 lg={3} xs={12}>{aboutMe.slice(0, 2).map(({ header, content }) => {
              return (
                <Box key={header}>
                  <h1>{header}</h1>
                  <p>{content}</p>
                </Box>
              )
            })}</Grid2>
            <Grid2 lg={6} xs={12} sx={{
              width: '100%',
              height: '100%',
            }}>
              <ThreeDLaptop /></Grid2>
            <Grid2 lg={3} xs={12}>{aboutMe.slice(2, 4).map(({ header, content }) => {
              return (
                <Box key={header}>
                  <h1>{header}</h1>
                  <p>{content}</p>
                </Box>
              )
            })}</Grid2>
          </Grid2>
        </Box >
      </Box>
        <Box sx={{
          backgroundColor: 'background.default',
          color: "text.primary"
        }}
          p={4} >
          © Karel Čančara {new Date().getFullYear()}
        </Box >
      </>
      }

    </>
  );
}
