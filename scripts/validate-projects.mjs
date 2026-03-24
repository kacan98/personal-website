import fs from "fs";
import path from "path";

const root = process.cwd();
const baseDir = path.join(root, "data", "projects");
const localeDirs = [
  path.join(root, "data", "projects-da"),
  path.join(root, "data", "projects-sv"),
];

const publicProjectErrors = [];
const warnings = [];

function readMarkdownFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const match = raw.match(/^export const metadata = (\{[\s\S]*?\});\n\n([\s\S]*)$/);
    if (!match) {
      throw new Error("missing metadata export");
    }
    return { raw, data: JSON.parse(match[1]), content: match[2] };
  } catch (error) {
    publicProjectErrors.push(`${relative(filePath)}: ${error.message}`);
    return null;
  }
}

function relative(filePath) {
  return path.relative(root, filePath);
}

function isVisibleProject(data) {
  return data.archived !== true && data.listed !== false;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidLinkUrl(url) {
  return (
    (typeof url === "string" && url.startsWith("/")) ||
    /^(https?:\/\/|mailto:)/.test(url)
  );
}

function validatePublicProject(filePath, data, content) {
  const rel = relative(filePath);

  if (!isNonEmptyString(data.title)) {
    publicProjectErrors.push(`${rel}: missing non-empty title`);
  }

  if (!isNonEmptyString(data.slug)) {
    publicProjectErrors.push(`${rel}: missing non-empty slug`);
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    publicProjectErrors.push(`${rel}: slug must match ^[a-z0-9-]+$`);
  }

  if (!isNonEmptyString(data.description)) {
    publicProjectErrors.push(`${rel}: missing non-empty description`);
  }

  const tags = Array.isArray(data.tags)
    ? data.tags
    : Array.isArray(data.tech)
      ? data.tech
      : [];

  if (tags.length === 0) {
    publicProjectErrors.push(`${rel}: requires at least one tag/tech value`);
  }

  if (typeof data.featured !== "boolean") {
    publicProjectErrors.push(`${rel}: featured must be true/false`);
  }

  if (typeof data.order !== "number") {
    publicProjectErrors.push(`${rel}: order must be a number`);
  }

  if (data.links != null && !Array.isArray(data.links)) {
    publicProjectErrors.push(`${rel}: links must be an array if provided`);
  } else if (Array.isArray(data.links)) {
    for (const [index, link] of data.links.entries()) {
      if (!isNonEmptyString(link?.title)) {
        publicProjectErrors.push(`${rel}: link ${index + 1} missing title`);
      }
      if (!isValidLinkUrl(link?.url)) {
        publicProjectErrors.push(`${rel}: link ${index + 1} has invalid url`);
      }
      if (!isNonEmptyString(link?.iconName) && !isNonEmptyString(link?.icon)) {
        publicProjectErrors.push(`${rel}: link ${index + 1} missing iconName/icon`);
      }
    }
  }

  if (!content.trim()) {
    publicProjectErrors.push(`${rel}: project body content is empty`);
  }

  if (!isNonEmptyString(data.image)) {
    warnings.push(`${rel}: image is empty`);
  }
}

function validateLocalizedProject(filePath, data) {
  const rel = relative(filePath);
  if (!isNonEmptyString(data.title)) {
    publicProjectErrors.push(`${rel}: localized project missing title`);
  }
  if (!isNonEmptyString(data.description)) {
    warnings.push(`${rel}: localized project missing description`);
  }
}

const baseFiles = fs.readdirSync(baseDir).filter((file) => file.endsWith(".mdx"));
const visibleSlugs = new Set();

for (const file of baseFiles) {
  const filePath = path.join(baseDir, file);
  const parsed = readMarkdownFile(filePath);
  if (!parsed) continue;

  if (isVisibleProject(parsed.data)) {
    validatePublicProject(filePath, parsed.data, parsed.content);
    if (isNonEmptyString(parsed.data.slug)) {
      if (visibleSlugs.has(parsed.data.slug)) {
        publicProjectErrors.push(`${relative(filePath)}: duplicate visible slug ${parsed.data.slug}`);
      }
      visibleSlugs.add(parsed.data.slug);
    }
  }
}

for (const localeDir of localeDirs) {
  if (!fs.existsSync(localeDir)) continue;
  for (const file of fs.readdirSync(localeDir).filter((name) => name.endsWith(".mdx"))) {
    const filePath = path.join(localeDir, file);
    const parsed = readMarkdownFile(filePath);
    if (!parsed) continue;

    const slug = isNonEmptyString(parsed.data.slug)
      ? parsed.data.slug
      : path.basename(file, ".mdx");

    if (!visibleSlugs.has(slug)) continue;
    if (parsed.data.archived === true || parsed.data.listed === false) continue;

    validateLocalizedProject(filePath, parsed.data);
  }
}

if (warnings.length > 0) {
  console.warn("Project validation warnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (publicProjectErrors.length > 0) {
  console.error("Project validation failed:");
  for (const error of publicProjectErrors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${visibleSlugs.size} visible projects successfully.`);
