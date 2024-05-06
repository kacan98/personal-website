import { sanityClient } from "@/sanity/lib/sanityClient";
import { Project } from "@/sanity/schemaTypes/project";
import { Settings } from "@/sanity/schemaTypes/singletons/settings";
import { Gallery } from "@/sanity/schemaTypes/gallery";
import { Social } from "@/sanity/schemaTypes/social";

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

// Can be undefined when the project is initialized
export const getSettings = async (): Promise<Settings | undefined> => {
  return sanityClient.fetch(
    `*[_type == "settings"][0]`,
    {},
    {
      cache: "no-cache",
    },
  );
};

export const getSocials = async (): Promise<Social[]> => {
  return sanityClient.fetch(
    `*[_type == "social"]`,
    {},
    {
      cache: "no-cache",
    },
  );
};
