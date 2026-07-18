import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';
import {
  countTaxonomy,
  formatDate as formatDateForLanguage,
  getPostSlug,
  minutesToRead,
  selectFeaturedPost,
  slugify,
  unslugify,
  validateContent,
} from './content-utils';

export type Post = CollectionEntry<'posts'>;
export type Author = CollectionEntry<'authors'>;
export type Page = CollectionEntry<'pages'>;

export type PostWithMeta = Post & {
  minutesToRead: number;
};

let authorsPromise: Promise<Author[]> | undefined;
let postsPromise: Promise<PostWithMeta[]> | undefined;

export function getAuthors() {
  authorsPromise ??= getCollection('authors');
  return authorsPromise;
}

export function getPosts() {
  postsPromise ??= Promise.all([getCollection('posts'), getAuthors()]).then(([entries, authors]) => {
    const posts = entries
      .filter((post) => !post.data.draft)
      .map((post) => ({
        ...post,
        minutesToRead: minutesToRead(post.body ?? post.rendered?.html ?? post.data.description),
      }))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    validateContent(posts, authors.map((author) => author.id));
    return posts;
  });

  return postsPromise;
}

export function getFeaturedPost(posts: readonly PostWithMeta[]) {
  return selectFeaturedPost(posts);
}

export async function getAuthorMap() {
  const authors = await getAuthors();
  return new Map(authors.map((author) => [author.id, author]));
}

export { getPostSlug, minutesToRead, slugify, unslugify };

export function getPostPath(post: { id: string; data: { slug?: string } }) {
  return `/posts/${getPostSlug(post)}/`;
}

export function formatDate(date: Date) {
  return formatDateForLanguage(date, site.language);
}

export function getAllTags(posts: PostWithMeta[]) {
  return countTaxonomy(posts.flatMap((post) => post.data.tags), 'tag');
}

export function getAllCategories(posts: PostWithMeta[]) {
  return countTaxonomy(posts.map((post) => post.data.category), 'category');
}

export function getRelatedPosts(post: PostWithMeta, posts: PostWithMeta[], limit = 3) {
  const tagSet = new Set<string>(post.data.tags);
  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      post: candidate,
      score:
        candidate.data.tags.filter((tag: string) => tagSet.has(tag)).length +
        (candidate.data.category === post.data.category ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ post }) => post);
}
