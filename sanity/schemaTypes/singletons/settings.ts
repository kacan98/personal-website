import { CogIcon } from "@sanity/icons";
import { defineField, defineType, Image } from "sanity";

const TITLE = "Settings";

export type Settings = {
  mainPage?: {
    title?: string;
    subtitles?: string[];
    mainImage?: Image;
  };
  profilePicture?: Image;
};

export default defineType({
  name: "settings",
  title: TITLE,
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "mainPage",
      title: "Home page settings",
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
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "mainImage",
          title: "Main page background image",
          type: "image",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      };
    },
  },
});
