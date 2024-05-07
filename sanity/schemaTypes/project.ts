import { defineField, defineType, Image } from "sanity";

export type Project = {
  title: string;
  description: string;
  image: Image;
  tags: string[];
  githubUrl: string;
  deploymentUrl: string;
  page?: {
    _type: "reference";
    _ref: string;
  };
};

/*For example 'R8tit, an article, ... '*/
export default defineType({
  name: "project",
  title: "Project",
  description:
    "For example a website, an article, podcast episode... In the future it will be possible to have a related page for this specific instance.",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      title: "Main Image",
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "githubUrl",
      title: "Github URL",
      type: "string",
    }),
    defineField({
      name: "deploymentUrl",
      title: "Deployment URL",
      type: "string",
    }),
    defineField({
      name: "page",
      title: "Related Page",
      type: "reference",
      to: [{ type: "page" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
