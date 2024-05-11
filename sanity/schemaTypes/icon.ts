import { supportedIconNames } from "@/components/icon";
import { defineType } from "sanity";

export default defineType({
  name: "icon",
  title: "Icon",
  type: "string",
  options: {
    list: supportedIconNames.map(({ name, key }) => ({
      title: name,
      value: key,
    })),
  },
  validation: (Rule) => Rule.required(),
});
