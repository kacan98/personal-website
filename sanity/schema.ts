import { type SchemaTypeDefinition } from "sanity";
import project from "@/sanity/schemaTypes/project";
import settings from "@/sanity/schemaTypes/singletons/settings";
import cvSection from "@/sanity/schemaTypes/cv/cvSection";
import bulletPoint from "@/sanity/schemaTypes/cv/bulletPoint";
import cvSubSection from "@/sanity/schemaTypes/cv/cvSubSection";
import gallery from "@/sanity/schemaTypes/gallery";
import links from "@/sanity/schemaTypes/link";
import blockContent from "@/sanity/schemaTypes/blockContent";
import page from "@/sanity/schemaTypes/page";

export const schema: {
  types: SchemaTypeDefinition[];
} = {
  types: [
    project,
    cvSection,
    cvSubSection,
    bulletPoint,
    settings,
    gallery,
    links,
    page,

    //rich texts:
    blockContent,
  ],
};
