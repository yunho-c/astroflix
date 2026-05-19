import { site } from '../data/site';
import { getPostPath, getPosts } from '../lib/content';
import { escapeXml } from '../lib/xml';

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map((post) => {
      const link = new URL(getPostPath(post), site.url).toString();
      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <link>${escapeXml(link)}</link>
          <guid>${escapeXml(link)}</guid>
          <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
          <description>${escapeXml(post.data.description)}</description>
        </item>
      `;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>${escapeXml(site.title)}</title>
          <link>${escapeXml(site.url)}</link>
          <description>${escapeXml(site.description)}</description>
          ${items}
        </channel>
      </rss>`,
    {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    },
  );
}
