import { StructureBuilder } from "sanity/structure";

const blog = (S: StructureBuilder) =>
  S.listItem()
    .title("Blog Posts")
    .child(
      S.documentTypeList("post")
        .title("Blog Posts")
    );

export default blog;
