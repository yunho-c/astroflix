import { describe, expect, test } from 'bun:test';
import { defineSiteConfig, site } from '../src/data/site';

describe('site configuration', () => {
  test('accepts the checked-in template configuration', () => {
    expect(defineSiteConfig(site)).toEqual(site);
  });

  test('rejects insecure production URLs', () => {
    expect(() => defineSiteConfig({ ...site, url: 'http://example.com' })).toThrow('HTTPS');
  });

  test('allows localhost during development', () => {
    expect(defineSiteConfig({ ...site, url: 'http://localhost:4321' }).url).toBe('http://localhost:4321');
  });

  test('rejects insecure form actions', () => {
    expect(() =>
      defineSiteConfig({ ...site, contact: { formAction: 'http://forms.example.com/submit' } }),
    ).toThrow('HTTPS form endpoint');
  });

  test('rejects unsafe navigation and invalid language tags', () => {
    expect(() =>
      defineSiteConfig({ ...site, nav: [{ href: 'javascript:alert(1)', label: 'Unsafe' }] }),
    ).toThrow('root-relative path');
    expect(() => defineSiteConfig({ ...site, language: 'not_a_locale' })).toThrow('BCP 47');
  });
});
