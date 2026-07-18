import { describe, expect, test } from 'bun:test';
import { getContentSource, getNotionConfig } from '../src/content-sources/config';

describe('content source configuration', () => {
  test('defaults to Markdown', () => {
    expect(getContentSource(undefined)).toBe('markdown');
    expect(getContentSource('  ')).toBe('markdown');
  });

  test('accepts Notion and rejects unknown sources', () => {
    expect(getContentSource(' notion ')).toBe('notion');
    expect(() => getContentSource('database')).toThrow('Invalid CONTENT_SOURCE');
  });

  test('requires both Notion credentials', () => {
    expect(() => getNotionConfig({})).toThrow('NOTION_TOKEN and NOTION_DATABASE_ID');
    expect(() => getNotionConfig({ NOTION_TOKEN: 'token' })).toThrow('NOTION_DATABASE_ID');
    expect(() => getNotionConfig({ NOTION_DATABASE_ID: 'database' })).toThrow('NOTION_TOKEN');
  });

  test('trims Notion credentials', () => {
    expect(getNotionConfig({ NOTION_TOKEN: ' token ', NOTION_DATABASE_ID: ' database ' })).toEqual({
      token: 'token',
      databaseId: 'database',
    });
  });
});
