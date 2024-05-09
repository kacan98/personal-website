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
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    defineField({
      name: "social",
      description: "Will be shown in the bottom right of the homepage",
      title: "Social",
      type: "array",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "object",
      description:
        "This is the metadata for the whole website. It will be used for SEO. (it's optional)",
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
      description:
        "These are temporary and used so that I can turn them on in my portfolio. They will be removed in the future. They are both hard-coded to show info about me (Karel)",
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
