import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Cem Tekelli'),
    authorRole: z.string().optional(),
    category: z.string(),
    readingTime: z.string(),
    lang: z.enum(['fr', 'en', 'nl']).default('fr'),
    translationSlugs: z.object({
      fr: z.string().optional(),
      en: z.string().optional(),
      nl: z.string().optional(),
    }).optional(),
    keywords: z.string().optional(),
    ogImage: z.string().default('/og-image.jpg'),
  }),
});

export const collections = { blog };
