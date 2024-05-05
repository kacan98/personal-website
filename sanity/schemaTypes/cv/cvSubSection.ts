import { defineField, defineType } from "sanity";

export interface CvSubSection {
  title?: string;
  subtitles?: {
    left?: string;
    right?: string;
  };
  contents?: string[];
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
      name: "contents",
      title: "Contents",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
