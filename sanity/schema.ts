import { type SchemaTypeDefinition } from "sanity";

import blockContent from "./schemaTypes/blockContent";
import category from "./schemaTypes/category";
import post from "./schemaTypes/post";
import author from "./schemaTypes/author";
import project from "@/sanity/schemaTypes/project";
import settings from "@/sanity/schemaTypes/singletons/settings";
import cvSection from "@/sanity/schemaTypes/cv/cvSection";
import bulletPoint from "@/sanity/schemaTypes/cv/bulletPoint";
import cvSubSection from "@/sanity/schemaTypes/cv/cvSubSection";

export const schema: {
  types: SchemaTypeDefinition[];
} = {
  types: [
    post,
    author,
    category,
    blockContent,
    project,
    cvSection,
    cvSubSection,
    bulletPoint,
    settings,
  ],
};
