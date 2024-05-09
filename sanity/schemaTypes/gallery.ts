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
      description:
        'You can add tags to projects. For example "React, TypeScript, ..." and enable filtering based on these tags. If on, a filter will be displayed on the page.',
      type: "boolean",
    },
  ],
});
