import { defineType } from "sanity";
import { supportedIconNames } from "@/components/icon";

export interface Link {
  _type: "link";
  title: string;
  url: string;
  iconName: string;
}

export default defineType({
  name: "link",
  title: "Link",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.max(30).required(),
    },
    {
      name: "url",
      title: "URL",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "iconName",
      title: "Icon",
      type: "icon",
      validation: (Rule) => Rule.required(),
    },
  ],
});
