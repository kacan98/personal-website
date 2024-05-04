import { sanityClient } from "@/sanity/lib/sanityClient";
import { Project } from "@/sanity/schemaTypes/project";

export const getProjects = async (): Promise<Project[]> => {
  return sanityClient.fetch(`*[_type == "project"]`, {
    cachePolicy: "no-cache",
  });
};
