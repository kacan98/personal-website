import defineStructure from "@/sanity/utils/defineStructure";
import { ListItemBuilder } from "sanity/structure";
import { DocumentIcon } from "@sanity/icons";

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("CV Settings")
    .id("cvSettings")
    .icon(DocumentIcon)
    .child(S.document().schemaType("cvSettings")),
);
