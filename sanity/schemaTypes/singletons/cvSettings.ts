import { defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { CvSection } from "@/sanity/schemaTypes/cv/cvSection";

export type CVSettings = {
  on: boolean;
  name: string;
  subtitle: string;
  mainColumn: CvSection[];
  sideColumn: CvSection[];
};

const TITLE = "CV Settings";

export default defineType({
  title: TITLE,
  name: "cvSettings",
  type: "document",
  icon: DocumentIcon,
  fields: [
    {
      title: "CV modal on",
      name: "on",
      type: "boolean",
    },
    {
      title: "Name",
      name: "name",
      type: "string",
    },
    {
      title: "Subtitle",
      name: "subtitle",
      type: "string",
    },
    {
      title: "Main Column",
      name: "mainColumn",
      type: "array",
      of: [
        {
          type: "cvSection",
        },
      ],
    },
    {
      title: "Side Column",
      name: "sideColumn",
      type: "array",
      of: [
        {
          type: "cvSection",
        },
      ],
    },
    {
      title: "Profile Picture",
      name: "profilePicture",
      type: "image",
    },
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      };
    },
  },
});
