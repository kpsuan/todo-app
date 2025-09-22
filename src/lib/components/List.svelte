<script>
  import { sortedItems, stats } from '$lib/store/todoStore.svelte.js';
  import ListItem from './ListItem.svelte';
  import AddTodoForm from './AddTodoForm.svelte';
  import { Stack, Box, Grid } from './ui';
</script>

<Stack spacing="space-y-4">
	<!-- Add Todo Form -->
	<AddTodoForm />

	<!-- Todo Statistics-->
	{#if $stats.total > 0}
		<Box padding="p-2" className="rounded-lg">
			<Grid cols={3} gap="gap-4" className="text-sm text-center">
				<Box>
					<div class="font-bold text-lg text-accent">{$stats.total}</div>
					<div class="text-text-secondary">Total</div>
				</Box>
				<Box>
					<div class="font-bold text-lg text-green-400">{$stats.completed}</div>
					<div class="text-text-secondary">Completed</div>
				</Box>
				<Box>
					<div class="font-bold text-lg text-orange-400">{$stats.pending}</div>
					<div class="text-text-secondary">Pending</div>
				</Box>
			</Grid>
		</Box>
	{/if}

	<!-- Todo List -->
	{#if $stats.total > 0}
		<Stack spacing="space-y-2">
			{#each $sortedItems as item (item.id)}
				{#if item && item.id}
					<ListItem {item} />
				{/if}
			{/each}
		</Stack>
	{:else}
		<Box className="text-center py-8 text-text-secondary border border-tertiary rounded-lg" padding="p-6">
			<p>No todos yet. Add one above to get started!</p>
		</Box>
	{/if}
</Stack>
