import { site } from '../data/site';
import { getAllCategories, getAllTags, getAuthors, getPosts } from '../lib/content';
import { escapeXml } from '../lib/xml';

export async function GET() {
  const posts = await getPosts();
  const authors = await getAuthors();
  const tags = getAllTags(posts);
  const categories = getAllCategories(posts);
  const staticRoutes = ['/', '/search/', '/tags/', '/categories/', '/authors/', '/about/', '/contact/'];
  const routes = [
    ...staticRoutes,
    ...posts.map((post) => `/posts/${post.id}/`),
    ...authors.map((author) => `/authors/${author.id}/`),
    ...tags.map((tag) => `/tags/${tag.slug}/`),
    ...categories.map((category) => `/categories/${category.slug}/`),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${routes.map((route) => `<url><loc>${escapeXml(new URL(route, site.url).toString())}</loc></url>`).join('')}
      </urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
}
