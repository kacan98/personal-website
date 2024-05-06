import { CogIcon } from "@sanity/icons";
import { defineField, defineType, Image } from "sanity";

const TITLE = "Settings";

export type Settings = {
  mainPage?: {
    title?: string;
    subtitles?: string[];
    mainImage?: Image;
    metadataDescription?: string;
  };
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  specialPages?: {
    portfolio: boolean;
    cv: boolean;
    chatbot: boolean;
  };
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
        }),
      ],
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string",
        }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "specialPages",
      title: "Special pages",
      type: "object",
      fields: [
        defineField({
          name: "cv",
          title: "CV",
          type: "boolean",
        }),
        defineField({
          name: "chatbot",
          title: "Chatbot",
          type: "boolean",
        }),
        defineField({
          name: "portfolio",
          title: "Portfolio",
          type: "boolean",
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
