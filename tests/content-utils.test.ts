import { describe, expect, test } from 'bun:test';
import {
  countTaxonomy,
  formatDate,
  selectFeaturedPost,
  slugify,
  validateContent,
  type ContentRecord,
} from '../src/lib/content-utils';

function post(id: string, overrides: Partial<ContentRecord['data']> = {}): ContentRecord {
  return {
    id,
    data: {
      author: 'author-one',
      category: 'Engineering',
      tags: ['Astro'],
      featured: false,
      pubDate: new Date('2026-01-02T00:00:00Z'),
      ...overrides,
    },
  };
}

describe('content utilities', () => {
  test('creates stable Unicode taxonomy slugs', () => {
    expect(slugify('한국어 카테고리')).toBe('한국어-카테고리');
    expect(slugify('  Static   Sites  ')).toBe('static-sites');
  });

  test('rejects empty and colliding taxonomy slugs', () => {
    expect(() => countTaxonomy(['✨'], 'tag')).toThrow('usable URL slug');
    expect(() => countTaxonomy(['C++', 'C#'], 'tag')).toThrow('both produce the URL slug "c"');
  });

  test('counts repeated labels without treating them as collisions', () => {
    expect(countTaxonomy(['Astro', 'Astro'], 'tag')).toEqual([{ name: 'Astro', slug: 'astro', count: 2 }]);
  });

  test('selects a featured post and handles an empty archive', () => {
    const posts = [post('one'), post('two', { featured: true })];
    expect(selectFeaturedPost(posts)?.id).toBe('two');
    expect(selectFeaturedPost([])).toBeUndefined();
  });

  test('rejects duplicate post routes and unknown authors', () => {
    expect(() => validateContent([post('one', { slug: 'same' }), post('two', { slug: 'same' })], ['author-one'])).toThrow(
      'both use the URL slug "same"',
    );
    expect(() => validateContent([post('one', { author: 'missing' })], ['author-one'])).toThrow(
      'references unknown author "missing"',
    );
  });

  test('formats dates with the selected locale', () => {
    const date = new Date('2026-01-02T00:00:00Z');
    expect(formatDate(date, 'en')).toContain('Jan');
    expect(formatDate(date, 'ko')).not.toEqual(formatDate(date, 'en'));
  });
});
