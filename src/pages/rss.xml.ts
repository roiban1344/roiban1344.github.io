import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: "Roiban1344's Logbook",
    description: 'roiban1344の作業記録',
    site: context.site!,
    items: posts.map((post) => {
      const date = post.data.date;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const slug = post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
      return {
        title: post.data.title,
        pubDate: post.data.date,
        link: `/${year}/${month}/${day}/${slug}/`,
      };
    }),
  });
}

