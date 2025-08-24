import remarkFrontmatter from 'remark-frontmatter';
import remarkLintFrontmatterSchema from 'remark-lint-frontmatter-schema';

const remarkConfig = {
  plugins: [
    remarkFrontmatter,
    [remarkLintFrontmatterSchema, {
      // Embed schema validation directly in the configuration
      embed: true
    }]
  ],
};

export default remarkConfig;