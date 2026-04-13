<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>pulsewidth | a hack club ysws</title>
	<link rel="icon" href="/pwfavicon.png" type="image/png" />
</svelte:head>

{@render children()}
