import { StructureResolver } from "sanity/structure";
import settings from "@/sanity/desk/settings";
import galleryModals from "@/sanity/desk/galleryModals";
import projects from "@/sanity/desk/projects";
import cvSettings from "@/sanity/desk/cvSettings";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    //includes all document types
    .items([
      galleryModals(S, context),
      projects(S, context),
      S.divider(),
      cvSettings(S, context),
      S.divider(),
      settings(S, context),
      S.divider(),
    ]);
