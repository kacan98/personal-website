import { defineField, defineType } from "sanity";

export type BulletPoint = {
  iconName: string;
  text: string;
  url?: string;
};

export default defineType({
  name: "bulletPoint",
  title: "Bullet Point",
  type: "object",
  fields: [
    {
      name: "iconName",
      title: "Icon",
      type: "icon",
    },
    defineField({
      name: "text",
      title: "Text",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "string",
    }),
  ],
  preview: {
    select: {
      text: "text",
    },
    prepare(selection) {
      const { text } = selection;
      return {
        title: text ? text : "No text provided",
      };
    },
  },
});
