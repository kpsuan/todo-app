<script>
	export let variant = 'default'; 
	export let padding = 'p-4';
	export let margin = '';
	export let rounded = 'rounded-lg';
	export let shadow = '';
	export let border = '';
	export let className = '';
	
	$: background = {
		default: 'bg-transparent',
		primary: 'bg-primary',
		secondary: 'bg-secondary',
		tertiary: 'bg-tertiary',
		accent: 'bg-accent'
	}[variant];

	// Optimized class ordering: base -> layout -> spacing -> borders -> background -> custom
	$: classes = [
		rounded,
		shadow,
		margin,
		padding,
		border,
		background,
		className
	].filter(Boolean).join(' ');
</script>

<div class={classes}>
	<slot />
</div>