import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import tailwind from '@astrojs/tailwind';
import remarkCodeTitle from './src/plugins/remark-code-title.ts';
import codeTitleTransformer from './src/plugins/shiki-code-title-transformer.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://roiban1344.github.io',
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkMath, remarkCodeTitle],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      transformers: [codeTitleTransformer],
    },
  },
});
