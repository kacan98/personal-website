import { z } from 'zod';

// Contact validation schema
export const ContactSchema = z.object({
  name: z.string(),
  value: z.string(),
  link: z.string().url().nullable(),
  icon: z.string().nullable()
});

// Project frontmatter validation schema  
export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  image: z.string(),
  tags: z.array(z.string()),
  links: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    icon: z.string()
  })),
  featured: z.boolean()
});

// CV config validation schema
export const CVConfigSchema = z.object({
  on: z.boolean(),
  name: z.string(),
  subtitle: z.string(),
  profilePicture: z.string().optional(),
  sections: z.object({
    mainColumn: z.array(z.string()),
    sideColumn: z.array(z.string())
  })
});

// Contact frontmatter validation schema
export const ContactFrontmatterSchema = z.object({
  contacts: z.array(ContactSchema)
});

export type ContactData = z.infer<typeof ContactSchema>;
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type CVConfig = z.infer<typeof CVConfigSchema>;
export type ContactFrontmatter = z.infer<typeof ContactFrontmatterSchema>;