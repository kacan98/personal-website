import { defineField, defineType } from "sanity";

export interface CvSubSection {
  title?: string;
  subtitles?: {
    left?: string;
    right?: string;
  };
  paragraphs?: string[];
}

export default defineType({
  name: "subSection",
  title: "Sub Section",
  type: "object",
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
  ],
});
