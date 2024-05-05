import { sanityClient } from "@/sanity/lib/sanityClient";
import { Project } from "@/sanity/schemaTypes/project";
import { Settings } from "@/sanity/schemaTypes/singletons/settings";

export const getProjects = async (): Promise<Project[]> => {
  return sanityClient.fetch(
    `*[_type == "project"]`,
    {},
    {
      next: {
        revalidate: 600, // look for updates to revalidate cache every 10 minutes
      },
    },
  );
};

export const getSettings = async (): Promise<Settings> => {
  return sanityClient.fetch(
    `*[_type == "settings"][0]`,
    {},
    {
      next: {
        revalidate: 600, // look for updates to revalidate cache every 10 minutes
      },
    },
  );
};
