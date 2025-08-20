import { sanityClient } from "@/sanity/lib/sanityClient";
import { Project } from "@/sanity/schemaTypes/project";
import { Settings } from "@/sanity/schemaTypes/singletons/settings";
import { Gallery } from "@/sanity/schemaTypes/gallery";
import { Link } from "@/sanity/schemaTypes/link";
import { CVSettings } from "@/sanity/schemaTypes/singletons/cvSettings";
import { StylesSettings } from "@/sanity/schemaTypes/singletons/stylesSettings";
import { Image } from "sanity";

export const getProjects = async (): Promise<Project[]> => {
  return sanityClient.fetch(`*[_type == "project"]`);
};

export const getProjectsByRefs = async (refs: string[]): Promise<Project[]> => {
  return sanityClient.fetch(
    `*[_type == "project" && _id in $refs]`,
    { refs }
  );
};

export const getGalleries = async (): Promise<Gallery[]> => {
  return sanityClient.fetch(
    `*[_type == "gallery"]`,
  );
};

// Can be undefined when the project is initialized
export const getSettings = async (): Promise<Settings | undefined> => {
  return sanityClient.fetch(
    `*[_type == "settings"][0]`,
  );
};

export const getSocials = async (): Promise<Link[]> => {
  return sanityClient.fetch(
    `*[_type == "settings"][0].social`,
  );
};

export const getProjectBySlug = async (
  slug: string,
): Promise<Project | undefined> => {
  //slug exists at project.relatedPage.slug.current
  return sanityClient.fetch(
    `*[_type == "project" && relatedPage.slug.current == $slug][0]`,
    { slug },
    {
    },
  );
};

export const getCvSettings = async (): Promise<CVSettings> => {
  return sanityClient.fetch(
    `*[_type == "cvSettings"][0]`,
  );
};

export const getStyles = async (): Promise<StylesSettings | undefined> => {
  return sanityClient.fetch(
    `*[_type == "stylesSettings"][0]`,
  );
};

export const getCVPicture = async (): Promise<Image> => {
  return sanityClient.fetch(
    `*[_type == "cvSettings"][0].profilePicture`,
  );
};
