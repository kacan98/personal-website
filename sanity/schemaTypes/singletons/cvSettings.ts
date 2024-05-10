import { defineType } from "sanity";

export default defineType({
  title: "CV Settings",
  name: "cvSettings",
  type: "document",
  fields: [
    {
      title: "on",
      name: "on",
      type: "boolean",
    },
    {
      title: "Left Column",
      name: "leftColumn",
      type: "array",
      of: [
        {
          type: "cvSection",
        },
      ],
    },
    {
      title: "Right Column",
      name: "rightColumn",
      type: "array",
      of: [
        {
          type: "cvSection",
        },
      ],
    },
  ],
});
