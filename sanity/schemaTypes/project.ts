import { defineField, defineType, Image, Slug } from "sanity";
import { Link } from "@/sanity/schemaTypes/link";
import { BlockContent } from "@/sanity/schemaTypes/blockContent";

export type Project = {
  title: string;
  description: string;
  image: Image;
  tags: string[];
  links?: Link[];

  relatedPage: {
    slug: Slug;
    content: BlockContent;
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
      description:
        "For example 'React, TypeScript, ...' They are optional, but can be used in the menu modals for filtering",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "relatedPage",
      title: "Related page",
      type: "object",
      fields: [
        {
          name: "slug",
          title: "Slug",
          description:
            "If defined, this project will have a related page available at /projects/[slug]",
          type: "slug",
          options: {
            source: "title",
            maxLength: 96,
          },
        },
        {
          name: "content",
          type: "blockContent",
          title: "Content",
        },
      ],
    }),
    defineField({
      name: "links",
      description: 'For example "Page, GitHub, Deployment, Spotify ...',
      type: "array",
      title: "Other Links",
      of: [{ type: "link" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
