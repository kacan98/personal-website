import { defineField, defineType, Image } from "sanity";

export type Project = {
  title: string;
  description: string;
  image: Image;
  tags: string[];
  githubUrl: string;
  deploymentUrl: string;
};

export default defineType({
  name: "project",
  title: "Project",
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
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      title: "Other Images",
      name: "otherImages",
      type: "array",
      of: [{ type: "image" }],
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
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
