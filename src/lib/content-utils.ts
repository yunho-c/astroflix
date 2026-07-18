import { slug as githubSlug } from 'github-slugger';

export type ContentRecord = {
  id: string;
  data: {
    slug?: string;
    author: string;
    category: string;
    tags: string[];
    featured?: boolean;
    pubDate: Date;
  };
};

export type TaxonomyItem = {
  name: string;
  slug: string;
  count: number;
};

export function minutesToRead(markdown: string) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~\-[\]()]/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(date: Date, language = 'en') {
  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function slugify(value: string) {
  return githubSlug(value.trim().replace(/\s+/g, ' '));
}

export function unslugify(value: string) {
  return decodeURIComponent(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getPostSlug(post: { id: string; data: { slug?: string } }) {
  return post.data.slug?.trim() || post.id;
}

export function selectFeaturedPost<T extends ContentRecord>(posts: readonly T[]) {
  return posts.find((post) => post.data.featured) ?? posts[0];
}

export function countTaxonomy(values: readonly string[], label: 'tag' | 'category'): TaxonomyItem[] {
  const counts = new Map<string, number>();
  const namesBySlug = new Map<string, string>();

  for (const rawName of values) {
    const name = rawName.trim();
    const slug = slugify(name);
    if (!slug) {
      throw new Error(`The ${label} "${name}" does not produce a usable URL slug. Use at least one letter or number.`);
    }

    const existingName = namesBySlug.get(slug);
    if (existingName && existingName !== name) {
      throw new Error(
        `The ${label} labels "${existingName}" and "${name}" both produce the URL slug "${slug}". Rename one of them.`,
      );
    }

    namesBySlug.set(slug, name);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function validateContent(posts: readonly ContentRecord[], authorIds: Iterable<string>) {
  const knownAuthors = new Set(authorIds);
  const postIdsBySlug = new Map<string, string>();

  for (const post of posts) {
    const slug = getPostSlug(post);
    const existingPostId = postIdsBySlug.get(slug);
    if (existingPostId) {
      throw new Error(
        `Posts "${existingPostId}" and "${post.id}" both use the URL slug "${slug}". Give one post a different slug.`,
      );
    }
    postIdsBySlug.set(slug, post.id);

    if (!knownAuthors.has(post.data.author)) {
      throw new Error(
        `Post "${post.id}" references unknown author "${post.data.author}". Add that author or update the post author ID.`,
      );
    }
  }

  countTaxonomy(posts.flatMap((post) => post.data.tags), 'tag');
  countTaxonomy(posts.map((post) => post.data.category), 'category');
}
