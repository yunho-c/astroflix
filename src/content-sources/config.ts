import { z } from 'zod';

const contentSourceSchema = z.enum(['markdown', 'notion']);

export type ContentSource = z.infer<typeof contentSourceSchema>;

export function getContentSource(value: string | undefined): ContentSource {
  const contentSource = value?.trim() || 'markdown';
  const result = contentSourceSchema.safeParse(contentSource);

  if (!result.success) {
    throw new Error(`Invalid CONTENT_SOURCE "${contentSource}". Use "markdown" or "notion".`);
  }

  return result.data;
}

export function getNotionConfig(env: { NOTION_TOKEN?: string; NOTION_DATABASE_ID?: string }) {
  const token = env.NOTION_TOKEN?.trim();
  const databaseId = env.NOTION_DATABASE_ID?.trim();
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
