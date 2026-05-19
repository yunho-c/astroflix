import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const imageSchema = z.object({
  url: z.url(),
  alt: z.string(),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    image: imageSchema,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    avatar: imageSchema,
    links: z
      .object({
        website: z.url().optional(),
        github: z.url().optional(),
        x: z.url().optional(),
        linkedin: z.url().optional(),
      })
      .default({}),
  }),
});

export const collections = { posts, authors };
