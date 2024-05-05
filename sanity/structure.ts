import { ListItemBuilder, StructureResolver } from "sanity/structure";
import settings from "@/sanity/desk/settings";

//TODO: Probably I want a pages section, where I can enable or disable the CV and ChatBot pages
//TODO: Be able to add new pages like
// - Podcast
// - Photography
// - Articles
const DOCUMENT_TYPES_IN_STRUCTURE = ["settings"];

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    //includes all document types
    .items([
      ...S.documentTypeListItems().filter(
        (listItem: ListItemBuilder) =>
          // @ts-expect-error Object is possibly 'undefined'
          !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId().toString()),
      ),
      S.divider(),
      settings(S, context),
      S.divider(),
    ]);
