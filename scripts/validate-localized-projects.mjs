import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const repoRoot = path.resolve(new URL(".", import.meta.url).pathname, "..");
const dataRoot = path.join(repoRoot, "data");
const baseDir = path.join(dataRoot, "projects");
const localizedDirs = [
  path.join(dataRoot, "projects-da"),
  path.join(dataRoot, "projects-sv"),
];

const sharedKeys = [
  "image",
  "featured",
  "listed",
  "archived",
  "order",
  "category",
  "liveUrl",
  "sourceUrl",
];

const bodyMetrics = (content) => ({
  h2Count: (content.match(/^## /gm) || []).length,
  imageCount: (content.match(/!\[[^\]]*\]\(([^)]+)\)/g) || []).length,
});

const formatValue = (value) => JSON.stringify(value ?? null);

const readMarkdownFile = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8");
  return matter(raw);
};

const main = async () => {
  const baseFiles = (await fs.readdir(baseDir)).filter((file) => file.endsWith(".md")).sort();
  const errors = [];

  for (const localizedDir of localizedDirs) {
    const localeName = path.basename(localizedDir);

    for (const file of baseFiles) {
      const basePath = path.join(baseDir, file);
      const localizedPath = path.join(localizedDir, file);

      try {
        await fs.access(localizedPath);
      } catch {
        errors.push(`[${localeName}] Missing localized file for ${file}`);
        continue;
      }

      const baseFile = await readMarkdownFile(basePath);
      const localizedFile = await readMarkdownFile(localizedPath);

      for (const key of sharedKeys) {
        if (formatValue(baseFile.data[key]) !== formatValue(localizedFile.data[key])) {
          errors.push(
            `[${localeName}] ${file}: frontmatter key "${key}" differs (${formatValue(baseFile.data[key])} != ${formatValue(localizedFile.data[key])})`
          );
        }
      }

      if (baseFile.data.imageAlt && !localizedFile.data.imageAlt) {
        errors.push(`[${localeName}] ${file}: missing localized imageAlt`);
      }

      const baseMetrics = bodyMetrics(baseFile.content);
      const localizedMetrics = bodyMetrics(localizedFile.content);

      if (baseMetrics.h2Count !== localizedMetrics.h2Count) {
        errors.push(
          `[${localeName}] ${file}: heading count differs (${baseMetrics.h2Count} != ${localizedMetrics.h2Count})`
        );
      }

      if (baseMetrics.imageCount !== localizedMetrics.imageCount) {
        errors.push(
          `[${localeName}] ${file}: markdown image count differs (${baseMetrics.imageCount} != ${localizedMetrics.imageCount})`
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("Localized project parity validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Localized project parity validation passed.");
};

await main();
