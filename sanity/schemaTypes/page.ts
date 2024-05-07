import { defineField, defineType } from "sanity";

export type Page = {
  slug: string;
  content: any; //TODO: fix
};

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
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
      name: "content",
      title: "Content",
      type: "blockContent",
    }),
  ],
});
