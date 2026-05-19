import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { notionLoader } from '@ntcho/notion-astro-loader';
import { notionPageSchema } from '@ntcho/notion-astro-loader/schemas/page';
import * as transformedPropertySchema from '@ntcho/notion-astro-loader/schemas/transformed-properties';

const defaultNotionDatabaseId = '3652acb28f77803e9b1fdff413ef2daf';
const notionToken = import.meta.env.NOTION_TOKEN;
const notionDatabaseId = import.meta.env.NOTION_DATABASE_ID || defaultNotionDatabaseId;

if (!notionToken) {
  throw new Error('Missing NOTION_TOKEN. Share the Notion database with an integration and set NOTION_TOKEN before building.');
}

const imageSchema = z.object({
  url: z.url(),
  alt: z.string(),
});

const requiredTitle = transformedPropertySchema.title.pipe(z.string().trim().min(1));
const requiredText = transformedPropertySchema.rich_text.pipe(z.string().trim().min(1));
const requiredSlug = transformedPropertySchema.rich_text.pipe(
  z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL slug such as cinematic-homepages'),
);
const requiredUrl = transformedPropertySchema.url.pipe(z.url());
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
  Subtitle: requiredText,
  Description: requiredText,
  Status: requiredStatus,
  'Published At': requiredDate,
  'Updated At': optionalDate,
  Author: requiredSelect,
  Category: requiredSelect,
  Tags: transformedPropertySchema.multi_select.default([]),
  'Cover URL': requiredUrl,
  'Cover Alt': requiredText,
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
    subtitle: properties.Subtitle,
    description: properties.Description,
    pubDate: properties['Published At'],
    updatedDate: properties['Updated At'],
    author: properties.Author,
    category: properties.Category,
    tags: properties.Tags,
    image: {
      url: properties['Cover URL'],
      alt: properties['Cover Alt'],
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
