import { StructureResolver } from "sanity/structure";
import settings from "@/sanity/desk/settings";
import galleryModals from "@/sanity/desk/galleryModals";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    //includes all document types
    .items([
      galleryModals(S, context),
      S.divider(),
      settings(S, context),
      S.divider(),
    ]);
