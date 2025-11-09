import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// For images in /public, use string. No optimization needed.
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
		readTime: z.string().optional(),
	}),
});

export const collections = { blog };
