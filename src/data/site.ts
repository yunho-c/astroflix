import { z } from 'zod';

const absoluteUrlSchema = z.url({ protocol: /^https?$/ });
const securePublicUrlSchema = absoluteUrlSchema.refine(
  (value) => value.startsWith('https://') || new URL(value).hostname === 'localhost',
  'Use an HTTPS URL, or an HTTP localhost URL while developing.',
);
const linkHrefSchema = z.string().trim().min(1).refine(
  (value) => {
    if (value.startsWith('/')) return !value.startsWith('//');
    if (!URL.canParse(value)) return false;
    const url = new URL(value);
    return (
      url.protocol === 'https:' ||
      url.protocol === 'mailto:' ||
      (url.protocol === 'http:' && url.hostname === 'localhost')
    );
  },
  'Use a root-relative path, HTTPS URL, mailto URL, or localhost URL.',
);
const colorSchema = z.string().regex(/^#[0-9a-f]{6}$/i, 'Use a six-digit hex color such as #ff0a16.');

const linkSchema = z.object({
  href: linkHrefSchema,
  label: z.string().trim().min(1),
});

export const socialIconSchema = z.enum(['github', 'rss', 'x', 'linkedin', 'website', 'email']);
export type SocialIcon = z.infer<typeof socialIconSchema>;

export const siteConfigSchema = z.object({
  name: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  url: securePublicUrlSchema,
  language: z.string().trim().min(2).refine(
    (value) => {
      try {
        return Intl.getCanonicalLocales(value).length === 1;
      } catch {
        return false;
      }
    },
    'Use a valid BCP 47 language tag such as en or ko-KR.',
  ),
  theme: z.object({
    accent: colorSchema,
    themeColor: colorSchema,
  }),
  nav: z.array(linkSchema),
  social: z.array(linkSchema.extend({ icon: socialIconSchema })),
  header: z.object({
    badge: z.string().trim().min(1).optional(),
    cta: linkSchema.optional(),
  }),
  footer: z.object({
    showThemeCredit: z.boolean(),
  }),
  contact: z.object({
    email: z.email().optional(),
    formAction: z
      .string()
      .trim()
      .min(1)
      .refine(
        (value) =>
          (value.startsWith('/') && !value.startsWith('//')) ||
          (URL.canParse(value) && new URL(value).protocol === 'https:'),
        'Use a root-relative path or an HTTPS form endpoint.',
      )
      .optional(),
  }),
  content: z.object({
    defaultCoverUrl: securePublicUrlSchema,
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

export function defineSiteConfig(config: unknown): SiteConfig {
  return siteConfigSchema.parse(config);
}

export const site = defineSiteConfig({
  name: 'Astroflix',
  title: 'Astroflix',
  description:
    'A cinematic Astro publication template inspired by Jekflix and built for comfortable reading.',
  url: 'https://astroflix.example.com',
  language: 'en',
  theme: {
    accent: '#ff0a16',
    themeColor: '#141414',
  },
  nav: [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
    { href: '/contact/', label: 'Contact' },
  ],
  social: [
    {
      href: 'https://github.com/yunho-c/astroflix',
      label: 'Astroflix on GitHub',
      icon: 'github',
    },
    { href: '/rss.xml', label: 'RSS feed', icon: 'rss' },
  ],
  header: {
    badge: 'v0.2.0',
    cta: {
      href: 'https://github.com/yunho-c/astroflix',
      label: 'Use this template',
    },
  },
  footer: {
    showThemeCredit: true,
  },
  contact: {},
  content: {
    defaultCoverUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80',
  },
});
