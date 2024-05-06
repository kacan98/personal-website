import { defineType } from "sanity";

export type Gallery = {
  title: string;
  projectRefs: {
    _type: "reference";
    _ref: string;
  }[];
};

export default defineType({
  name: "gallery",
  title: "Gallery Pages",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
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
    },
  ],
});
