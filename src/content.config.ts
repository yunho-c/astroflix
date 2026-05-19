import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { notionLoader } from '@ntcho/notion-astro-loader';
import { notionPageSchema } from '@ntcho/notion-astro-loader/schemas/page';
import * as transformedPropertySchema from '@ntcho/notion-astro-loader/schemas/transformed-properties';

const defaultNotionDatabaseId = '3652acb28f77803e9b1fdff413ef2daf';
const notionToken = import.meta.env.NOTION_TOKEN;
const notionDatabaseId = import.meta.env.NOTION_DATABASE_ID || defaultNotionDatabaseId;
const defaultCoverUrl = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80';

if (!notionToken) {
  throw new Error('Missing NOTION_TOKEN. Share the Notion database with an integration and set NOTION_TOKEN before building.');
}

const imageSchema = z.object({
  url: z.url(),
  alt: z.string(),
});

const requiredTitle = transformedPropertySchema.title.pipe(z.string().trim().min(1));
const optionalText = transformedPropertySchema.rich_text.transform((text: string) => text.trim() || undefined);
const requiredSlug = transformedPropertySchema.rich_text.pipe(
  z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug such as cinematic-homepages'),
);
const optionalUrl = transformedPropertySchema.url
  .transform((url: string | null) => url?.trim())
  .transform((url: string | undefined) => (url && URL.canParse(url) ? url : undefined));
const requiredSelect = transformedPropertySchema.select.pipe(z.string().trim().min(1));
const requiredStatus = transformedPropertySchema.status.pipe(z.literal('Published'));
type NotionDateValue = { start: Date; end: Date | null; time_zone: string | null } | null;

const requiredDate = transformedPropertySchema.date.transform((date: NotionDateValue) => date?.start).pipe(z.date());
const optionalDate = transformedPropertySchema.date
  .optional()
  .transform((date: NotionDateValue | undefined) => date?.start)
  .pipe(z.date().optional());

const notionPostPropertiesSchema = z.object({
  Title: requiredTitle,
  Slug: requiredSlug,
  Subtitle: optionalText,
  Description: optionalText,
  Status: requiredStatus,
  'Published At': requiredDate,
  'Updated At': optionalDate,
  Author: requiredSelect,
  Category: requiredSelect,
  Tags: transformedPropertySchema.multi_select.default([]),
  'Cover URL': optionalUrl,
  'Cover Alt': optionalText,
  Featured: transformedPropertySchema.checkbox.optional().default(false),
});

type NotionPostProperties = z.infer<typeof notionPostPropertiesSchema>;

const posts = defineCollection({
  loader: notionLoader({
    auth: notionToken,
    database_id: notionDatabaseId,
    collectionName: 'posts',
    assetPath: 'assets/notion',
    filter: {
      property: 'Status',
      status: {
        equals: 'Published',
      },
    },
    sorts: [
      {
        property: 'Published At',
        direction: 'descending',
      },
    ],
  }),
  schema: notionPageSchema({
    properties: notionPostPropertiesSchema,
  }).transform(({ properties, url }: { properties: NotionPostProperties; url: string }) => ({
    title: properties.Title,
    slug: properties.Slug,
    subtitle: properties.Subtitle ?? properties.Description ?? properties.Title,
    description: properties.Description ?? properties.Subtitle ?? properties.Title,
    pubDate: properties['Published At'],
    updatedDate: properties['Updated At'],
    author: properties.Author,
    category: properties.Category,
    tags: properties.Tags,
    image: {
      url: properties['Cover URL'] ?? defaultCoverUrl,
      alt: properties['Cover Alt'] ?? properties.Title,
    },
    featured: properties.Featured,
    draft: properties.Status !== 'Published',
    sourceUrl: url,
  })),
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
