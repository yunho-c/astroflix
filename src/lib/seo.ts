import { site } from '../data/site';
import type { Author, PostWithMeta } from './content';

export function absoluteUrl(pathOrUrl: string) {
  return new URL(pathOrUrl, site.url).toString();
}

export function getAuthorLinks(author: Author) {
  const links = author.data.links;
  return [
    { label: 'Website', href: links.website },
    { label: 'GitHub', href: links.github },
    { label: 'X', href: links.x },
    { label: 'LinkedIn', href: links.linkedin },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));
}

export function personJsonLd(author: Author) {
  return personJsonLdEntity(author, true);
}

function personJsonLdEntity(author: Author, includeContext = false) {
  const sameAs = getAuthorLinks(author).map((link) => link.href);
  return withoutEmpty({
    ...(includeContext ? { '@context': 'https://schema.org' } : {}),
    '@type': 'Person',
    name: author.data.name,
    jobTitle: author.data.role,
    description: author.data.bio,
    image: author.data.avatar.url,
    url: absoluteUrl(`/authors/${author.id}/`),
    sameAs,
  });
}

export function blogPostingJsonLd(post: PostWithMeta, author?: Author) {
  return withoutEmpty({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    alternativeHeadline: post.data.subtitle,
    description: post.data.description,
    image: post.data.image.url,
    url: absoluteUrl(`/posts/${post.id}/`),
    mainEntityOfPage: absoluteUrl(`/posts/${post.id}/`),
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    inLanguage: site.language,
    author: author ? personJsonLdEntity(author) : { '@type': 'Person', name: post.data.author },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
    },
    articleSection: post.data.category,
    keywords: post.data.tags,
  });
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function withoutEmpty<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => !Array.isArray(entry) || entry.length > 0),
  );
}
