import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { createMarkdownPostsCollection } from './content-sources/markdown-posts';
import { createNotionPostsCollection } from './content-sources/notion-posts';
import { imageSchema } from './content-sources/post-schema';

const contentSource = getContentSource(import.meta.env.CONTENT_SOURCE);
const posts =
  contentSource === 'notion'
    ? createNotionPostsCollection(getNotionConfig())
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

export const collections = { posts, authors };

function getContentSource(value: string | undefined) {
  const contentSource = value?.trim() || 'markdown';
  const result = z.enum(['markdown', 'notion']).safeParse(contentSource);

  if (!result.success) {
    throw new Error(`Invalid CONTENT_SOURCE "${contentSource}". Use "markdown" or "notion".`);
  }

  return result.data;
}

function getNotionConfig() {
  const token = import.meta.env.NOTION_TOKEN?.trim();
  const databaseId = import.meta.env.NOTION_DATABASE_ID?.trim();
  const missingVariables = [
    !token && 'NOTION_TOKEN',
    !databaseId && 'NOTION_DATABASE_ID',
  ].filter((name): name is string => Boolean(name));

  if (!token || !databaseId) {
    throw new Error(
      `Missing ${missingVariables.join(' and ')}. Set ${missingVariables.length === 1 ? 'it' : 'them'} when CONTENT_SOURCE="notion".`,
    );
  }

  return { token, databaseId };
}
