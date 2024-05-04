import { defineField, defineType } from "sanity";

export type BulletPoint = {
  icon:
    | "Email"
    | "GitHub"
    | "LibraryBooks"
    | "LinkedIn"
    | "Phone"
    | "School"
    | "Science"
    | "Translate";
  text: string;
  url?: string;
};

export default defineType({
  name: "bulletPoint",
  title: "Bullet Point",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Email", value: "Email" },
          { title: "GitHub", value: "GitHub" },
          { title: "LibraryBooks", value: "LibraryBooks" },
          { title: "LinkedIn", value: "LinkedIn" },
          { title: "Phone", value: "Phone" },
          { title: "School", value: "School" },
          { title: "Science", value: "Science" },
          { title: "Translate", value: "Translate" },
        ],
      },
    }),
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
});
