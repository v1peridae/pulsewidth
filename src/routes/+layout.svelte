<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>pulsewidth | a hack club ysws</title>
</svelte:head>

{@render children()}
