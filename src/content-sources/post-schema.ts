import { z } from 'astro/zod';

export const postSlugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug such as cinematic-homepages');

export const imageSchema = z.object({
  url: z.url(),
  alt: z.string().trim().min(1),
});

export const postSchema = z.object({
  title: z.string().trim().min(1),
  slug: postSlugSchema.optional(),
  subtitle: z.string().trim().min(1),
  description: z.string().trim().min(1),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: postSlugSchema,
  category: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).default([]),
  image: imageSchema,
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  sourceUrl: z.url().optional(),
});
