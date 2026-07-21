import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import guideSource from '$lib/content/guide.md?raw';
import type { PageLoad } from './$types';

export const prerender = true;

marked.use(gfmHeadingId());

export const load: PageLoad = async () => {
	const html = await marked.parse(guideSource);
	return { html };
};
