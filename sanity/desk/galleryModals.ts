import { MenuIcon } from "@sanity/icons";
import { ListItemBuilder } from "sanity/structure";
import defineStructure from "@/sanity/utils/defineStructure";

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("Gallery Modals")
    .id("gallery")
    .icon(MenuIcon)
    .child(
      S.documentList()
        .id("gallery")
        .title("All Gallery Modals")
        .schemaType("gallery")
        .filter('_type == "gallery"'),
    ),
);
