import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { createMarkdownPostsCollection } from './content-sources/markdown-posts';
import { createNotionPostsCollection } from './content-sources/notion-posts';
import { imageSchema } from './content-sources/post-schema';
import { getContentSource, getNotionConfig } from './content-sources/config';

const contentSource = getContentSource(import.meta.env.CONTENT_SOURCE);
const posts =
  contentSource === 'notion'
    ? createNotionPostsCollection(
        getNotionConfig({
          NOTION_TOKEN: import.meta.env.NOTION_TOKEN,
          NOTION_DATABASE_ID: import.meta.env.NOTION_DATABASE_ID,
        }),
      )
    : createMarkdownPostsCollection();

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

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    eyebrow: z.string().trim().min(1),
    lede: z.string().trim().min(1),
  }),
});

export const collections = { posts, authors, pages };
