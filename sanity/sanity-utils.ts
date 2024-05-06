import { sanityClient } from "@/sanity/lib/sanityClient";
import { Project } from "@/sanity/schemaTypes/project";
import { Settings } from "@/sanity/schemaTypes/singletons/settings";
import { Gallery } from "@/sanity/schemaTypes/gallery";

export const getProjects = async (): Promise<Project[]> => {
  return sanityClient.fetch(
    `*[_type == "project"]`,
    {},
    {
      cache: "no-cache",
    },
  );
};

export const getProjectsByRefs = async (refs: string[]): Promise<Project[]> => {
  return sanityClient.fetch(
    `*[_type == "project" && _id in $refs]`,
    { refs },
    {
      cache: "no-cache",
    },
  );
};

export const getGalleries = async (): Promise<Gallery[]> => {
  return sanityClient.fetch(
    `*[_type == "gallery"]`,
    {},
    {
      cache: "no-cache",
    },
  );
};

export const getSettings = async (): Promise<Settings> => {
  return sanityClient.fetch(
    `*[_type == "settings"][0]`,
    {},
    {
      cache: "no-cache",
    },
  );
};
