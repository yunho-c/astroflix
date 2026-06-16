import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Author = CollectionEntry<'authors'>;

export type PostWithMeta = Post & {
  minutesToRead: number;
};

export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts
    .map((post) => ({ ...post, minutesToRead: minutesToRead(post.body ?? '') }))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getFeaturedPost() {
  const posts = await getPosts();
  return posts.find((post) => post.data.featured) ?? posts[0];
}

export async function getAuthors() {
  return await getCollection('authors');
}

export async function getAuthorMap() {
  const authors = await getAuthors();
  return new Map(authors.map((author) => [author.id, author]));
}

export function getPostSlug(post: { id: string; data: Record<string, unknown> }) {
  const slug = post.data.slug;
  return typeof slug === 'string' && slug ? slug : post.id;
}

export function getPostPath(post: { id: string; data: Record<string, unknown> }) {
  return `/posts/${getPostSlug(post)}/`;
}

export function minutesToRead(markdown: string) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~\-[\]()]/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function unslugify(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getAllTags(posts: PostWithMeta[]) {
  return countBy(posts.flatMap((post) => post.data.tags));
}

export function getAllCategories(posts: PostWithMeta[]) {
  return countBy(posts.map((post) => post.data.category));
}

export function getRelatedPosts(post: PostWithMeta, posts: PostWithMeta[], limit = 3) {
  const tagSet = new Set(post.data.tags);
  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      post: candidate,
      score:
        candidate.data.tags.filter((tag) => tagSet.has(tag)).length +
        (candidate.data.category === post.data.category ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ post }) => post);
}

function countBy(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
