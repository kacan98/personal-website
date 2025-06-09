import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const TITLE = "Styles";

export type StylesSettings = {
  theme?: "light" | "dark";
  font?: "System font" | "Yeseva One";
};

export default defineType({
  title: TITLE,
  name: "stylesSettings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      options: {
        list: ["light", "dark"],
      },
    }),
    defineField({
      name: "font",
      title: "Font",
      type: "string",
      options: {
        list: ["System font", "Yeseva One", "Cormorant Garamond", "Urbanist"],
      },
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
