import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { notionLoader } from '@ntcho/notion-astro-loader';
import { notionPageSchema } from '@ntcho/notion-astro-loader/schemas/page';
import * as transformedPropertySchema from '@ntcho/notion-astro-loader/schemas/transformed-properties';
import { postSchema, postSlugSchema } from './post-schema';

const defaultCoverUrl = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80';

const requiredTitle = transformedPropertySchema.title.pipe(z.string().trim().min(1));
const optionalText = transformedPropertySchema.rich_text.transform((text: string) => text.trim() || undefined);
const requiredSlug = transformedPropertySchema.rich_text.pipe(postSlugSchema);
const optionalUrl = transformedPropertySchema.url
  .transform((url: string | null) => url?.trim())
  .transform((url: string | undefined) => normalizeExternalUrl(url));
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

type NotionPostsOptions = {
  token: string;
  databaseId: string;
};

export function createNotionPostsCollection({ token, databaseId }: NotionPostsOptions) {
  const sourceLoader = notionLoader({
    auth: token,
    database_id: databaseId,
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
  });

  return defineCollection({
    // The collection schema below is authoritative. Omitting the loader's
    // legacy async schema avoids Astro 6's deprecated-schema warning.
    loader: {
      name: sourceLoader.name,
      load: sourceLoader.load,
    },
    schema: notionPageSchema({
      properties: notionPostPropertiesSchema,
    })
      .transform(({ properties, url }: { properties: NotionPostProperties; url: string }) => ({
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
        draft: false,
        sourceUrl: url,
      }))
      .pipe(postSchema),
  });
}

function normalizeExternalUrl(url: string | undefined) {
  if (!url) {
    return undefined;
  }

  if (URL.canParse(url)) {
    return url;
  }

  const withProtocol = `https://${url}`;
  return URL.canParse(withProtocol) ? withProtocol : undefined;
}
