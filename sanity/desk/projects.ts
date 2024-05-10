import { DocumentIcon } from "@sanity/icons";
import defineStructure from "@/sanity/utils/defineStructure";
import { ListItemBuilder } from "sanity/structure";

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("Projects")
    .id("projects")
    .icon(DocumentIcon)
    .child(
      S.documentList()
        .id("project")
        .title("All projects")
        .schemaType("project")
        .filter('_type == "project"'),
    ),
);
