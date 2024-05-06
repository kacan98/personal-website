import { defineType } from "sanity";

export type Gallery = {
  title: string;
  subtitle?: string;
  filteringIsEnabled?: boolean;
  projectRefs: {
    _type: "reference";
    _ref: string;
  }[];
};

export default defineType({
  name: "gallery",
  title: "Gallery Pages",
  description:
    "A collection of projects. For example 'podcast episodes' or 'coding projects'",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    },
    {
      name: "projectRefs",
      title: "Projects",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "filteringIsEnabled",
      title: "Tag-based Filtering",
      type: "boolean",
    },
  ],
});
