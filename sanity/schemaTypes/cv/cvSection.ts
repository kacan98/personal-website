import { SubSection } from "@/components/pages/cv/cvSection";
import { defineField, defineType } from "sanity";
import { BulletPoint } from "@/sanity/schemaTypes/cv/bulletPoint";

export type Section = {
  title?: string;
  subtitles?: {
    left?: string;
    right?: string;
  };
  contents?: string[];
  subSections?: SubSection[];
  bulletPoints?: BulletPoint[];
};

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
      name: "contents",
      title: "Contents",
      type: "array",
      of: [{ type: "string" }],
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
