import { ListItemBuilder } from "sanity/structure";
import defineStructure from "@/sanity/utils/defineStructure";
import { Share } from "@mui/icons-material";

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("Social")
    .id("social")
    .icon(Share)
    .child(
      S.documentList()
        .id("social")
        .title("Links")
        .schemaType("social")
        .filter('_type == "social"'),
    ),
);
