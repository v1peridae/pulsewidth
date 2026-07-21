<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>guide | pulsewidth</title>
</svelte:head>

<div class="flex min-h-screen w-full flex-col overflow-x-clip bg-[#EFEDFA]">
	<header class="shrink-0 pr-3 pt-3 md:pr-6 md:pt-6">
		<div class="w-full max-w-3xl bg-[#C8CD11] px-6 pt-2 pb-2 md:px-14 md:pt-2 md:pb-2">
			<h1 class="font-helvetica text-5xl text-right font-bold italic leading-[90%] tracking-tight text-[#8A84EC] sm:text-6xl md:text-[5rem]">guide</h1>
			<p class="mt-2 font-bold italic text-right font-helvetica text-lg leading-[110%] text-[#8F8DC5] md:text-xl">
				<a href="/" class="text-[#8F8DC5] no-underline hover:underline">&larr; back to pulsewidth</a>
			</p>
		</div>
	</header>

	<main class="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-10 md:px-10 md:pt-14">
		<article class="guide-content font-helvetica text-[#6C8CE8]">
			{@html data.html}
		</article>
	</main>

	<footer class="border-t-2 border-[#C8CD11] bg-[#EFEDFA] px-5 py-8 md:px-10">
		<p class="mx-auto max-w-6xl text-center font-helvetica text-base leading-[140%] text-[#6C8CE8] md:text-lg">
			made with &lt; 3 and :3 by @<a href="https://github.com/v1peridae" target="_blank" rel="noopener noreferrer" class="text-[#6C8CE8]">v1peridae</a>
			, brought to you by <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer" class="text-[#6C8CE8]">hack club</a>.
		</p>
	</footer>
</div>

<style>
	.guide-content :global(h1) {
		display: inline-block;
		background-color: #c8cd11;
		color: #8a84ec;
		font-weight: 700;
		font-style: italic;
		font-size: 2.25rem;
		line-height: 110%;
		padding: 0.25rem 0.5rem;
		margin-bottom: 1.5rem;
	}

	.guide-content :global(h2) {
		display: inline-block;
		background-color: #c8cd11;
		color: #8a84ec;
		font-weight: 700;
		font-style: italic;
		font-size: 1.75rem;
		line-height: 110%;
		padding: 0.2rem 0.5rem;
		margin-top: 3rem;
		margin-bottom: 1rem;
		scroll-margin-top: 1.5rem;
	}

	.guide-content :global(h3) {
		color: #6c8ce8;
		font-weight: 700;
		font-size: 1.35rem;
		line-height: 110%;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		scroll-margin-top: 1.5rem;
	}

	.guide-content :global(p),
	.guide-content :global(li) {
		font-size: 1.125rem;
		line-height: 140%;
	}

	.guide-content :global(p) {
		margin-bottom: 1rem;
	}

	.guide-content :global(ul),
	.guide-content :global(ol) {
		margin: 0 0 1rem 1.5rem;
		list-style: disc;
	}

	.guide-content :global(ol) {
		list-style: decimal;
	}

	.guide-content :global(li) {
		margin-bottom: 0.35rem;
	}

	.guide-content :global(a) {
		color: #8a84ec;
		text-decoration: underline;
		text-underline-offset: 0.09em;
	}

	.guide-content :global(strong) {
		font-weight: 700;
	}

	.guide-content :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.9em;
		background-color: #e3e0f5;
		color: #5f57c7;
		padding: 0.1em 0.35em;
	}

	.guide-content :global(pre) {
		background-color: #26244d;
		color: #efedfa;
		padding: 1rem 1.25rem;
		overflow-x: auto;
		margin-bottom: 1.25rem;
		border: 2px solid #c8cd11;
	}

	.guide-content :global(pre code) {
		background: none;
		color: inherit;
		padding: 0;
		font-size: 0.875rem;
		line-height: 150%;
	}

	.guide-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.25rem;
		font-size: 1rem;
	}

	.guide-content :global(th),
	.guide-content :global(td) {
		border: 2px solid #c8cd11;
		padding: 0.5rem 0.75rem;
		text-align: left;
	}

	.guide-content :global(th) {
		background-color: #c8cd11;
		color: #efedfa;
		font-weight: 700;
	}

	.guide-content :global(hr) {
		border: 0;
		border-top: 3px solid #c8cd11;
		margin: 2.5rem 0;
	}

	.guide-content :global(blockquote) {
		border-left: 4px solid #c8cd11;
		padding-left: 1rem;
		margin-bottom: 1rem;
		font-style: italic;
	}

	.guide-content :global(img) {
		max-width: 100%;
		height: auto;
	}
</style>
