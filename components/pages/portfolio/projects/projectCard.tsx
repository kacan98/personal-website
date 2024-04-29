import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { GitHub, OpenInNew } from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2";

export type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  deploymentUrl?: string;
};

export const ProjectCard = ({
  title,
  description,
  image,
  githubUrl,
  deploymentUrl,
}: Project) => (
  <Card sx={{ width: 300, height: 350, m: 2, p: 2 }}>
    <CardContent>
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        columnSpacing={5}
        direction="column"
      >
        {image && (
          <Box display="flex" mb={2}>
            <CardMedia
              image={image}
              title={title}
              sx={{ height: 150, width: 150 }}
            />
          </Box>
        )}
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2">{description}</Typography>
        <Grid2 container alignItems="center" justifyContent="center">
          {githubUrl && (
            <Link href={githubUrl} target={"_blank"}>
              <IconButton>
                <GitHub />
              </IconButton>
            </Link>
          )}
          {deploymentUrl && (
            <Link href={deploymentUrl} target={"_blank"}>
              <IconButton>
                <OpenInNew />
              </IconButton>
            </Link>
          )}
        </Grid2>
      </Grid2>
    </CardContent>
  </Card>
);
