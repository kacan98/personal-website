import { CogIcon } from "@sanity/icons";
import { ListItemBuilder } from "sanity/structure";
import defineStructure from "../utils/defineStructure";

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("Styles Settings")
    .id("stylesSettings")
    .icon(CogIcon)
    .child(S.document().schemaType("stylesSettings")),
);
