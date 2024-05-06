import { defineType } from "sanity";
import { supportedIconNames } from "@/components/icon";

export interface Social {
  _type: "social";
  title: string;
  url: string;
  iconName: string;
}

export default defineType({
  name: "social",
  title: "Social Media",
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
      type: "string",
      options: {
        list: supportedIconNames.map(({ name, key }) => ({
          title: name,
          value: key,
        })),
      },
      validation: (Rule) => Rule.required(),
    },
  ],
});
