import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { ConditionalWrapper } from "@/components/conditionalWrapper";

export type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  URL?: string;
};

type ProjectCardProps = {
  project: Project;
};

export const ProjectCard = ({ project }: ProjectCardProps) => (
  <Card sx={{ width: 300, height: 300 }}>
    <ConditionalWrapper
      condition={!!project.URL}
      wrapper={(children) => (
        <Link href={project.URL!} target={"_blank"}>
          {children}
        </Link>
      )}
    >
      <CardContent>
        {project.image && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Image
              src={project.image}
              alt={project.title}
              width={150}
              height={150}
            />
          </Box>
        )}
        <Typography variant="h5">{project.title}</Typography>
        <Typography variant="body2">{project.description}</Typography>
      </CardContent>
    </ConditionalWrapper>
  </Card>
);
