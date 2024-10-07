import { defineField, defineType } from "sanity";

export default defineType({
  name: "cvSection",
  title: "CV Section",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "subtitles",
      title: "Subtitles",
      type: "object",
      fields: [
        defineField({
          name: "left",
          title: "Left",
          type: "string",
        }),
        defineField({
          name: "right",
          title: "Right",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "subSections",
      title: "Sub Sections",
      type: "array",
      of: [{ type: "subSection" }],
    }),
    defineField({
      name: "bulletPoints",
      title: "Bullet Points",
      type: "array",
      of: [{ type: "bulletPoint" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
