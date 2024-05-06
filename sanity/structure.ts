import { StructureResolver } from "sanity/structure";
import settings from "@/sanity/desk/settings";
import galleryModals from "@/sanity/desk/galleryModals";
import social from "@/sanity/desk/social";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    //includes all document types
    .items([
      galleryModals(S, context),
      S.divider(),
      settings(S, context),
      social(S, context),
      S.divider(),
    ]);
