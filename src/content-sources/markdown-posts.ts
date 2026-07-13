import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { postSchema } from './post-schema';

export function createMarkdownPostsCollection() {
  return defineCollection({
    loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
    schema: postSchema,
  });
}
