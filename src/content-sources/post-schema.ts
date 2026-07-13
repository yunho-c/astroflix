import { z } from 'astro/zod';

export const postSlugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug such as cinematic-homepages');

export const imageSchema = z.object({
  url: z.url(),
  alt: z.string(),
});

export const postSchema = z.object({
  title: z.string(),
  slug: postSlugSchema.optional(),
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
  sourceUrl: z.url().optional(),
});
