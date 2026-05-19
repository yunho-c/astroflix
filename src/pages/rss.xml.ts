import { site } from '../data/site';
import { getPosts } from '../lib/content';

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map((post) => {
      const link = new URL(`/posts/${post.id}/`, site.url).toString();
      return `
        <item>
          <title><![CDATA[${post.data.title}]]></title>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
          <description><![CDATA[${post.data.description}]]></description>
        </item>
      `;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>${site.title}</title>
          <link>${site.url}</link>
          <description>${site.description}</description>
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
