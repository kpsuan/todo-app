<script>
	import ListItem from "./ListItem.svelte";
	import AddTodoForm from "./AddTodoForm.svelte";
	import { Stack, Box, Grid } from "./utils";
	import { appStore } from "$lib/store/store.js";
	import { derived } from 'svelte/store';

	// Create derived stores for computed values
	const sortedItems = derived(appStore, $appStore => {
		if (!$appStore.items) return [];
		
		const priorityOrder = { high: 3, medium: 2, low: 1 };
		return [...$appStore.items].sort((a, b) => {
			// sort completion status (incomplete first)
			if (a.completed !== b.completed) {
				return a.completed ? 1 : -1;
			}
			// by priority
			if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
				return priorityOrder[b.priority] - priorityOrder[a.priority];
			}
			//  by due date
			if (a.dueDate && b.dueDate) {
				return new Date(a.dueDate) - new Date(b.dueDate);
			}
			return 0;
		});
	});

	const completedCount = derived(appStore, $appStore => {
		if (!$appStore.items) return 0;
		return $appStore.items.filter(item => item.completed).length;
	});

	const pendingCount = derived(appStore, $appStore => {
		if (!$appStore.items) return 0;
		return $appStore.items.filter(item => !item.completed).length;
	});

	// Error handling for computed values
	$: safeItems = $sortedItems || [];
	$: completedItems = $completedCount || 0;
	$: pendingItems = $pendingCount || 0;
</script>

<Stack>
	<!-- Todo Statistics -->
	{#if safeItems.length > 0}
		<Box padding="p-2" className="border-b border-tertiary pb-4 mb-4">
			<Grid cols={3} gap="gap-4" className="text-sm text-center">
				<Box>
					<div class="font-bold text-lg text-accent">{safeItems.length}</div>
					<div class="text-text-secondary">Total</div>
				</Box>
				<Box>
					<div class="font-bold text-lg text-green-400">{completedItems}</div>
					<div class="text-text-secondary">Completed</div>
				</Box>
				<Box>
					<div class="font-bold text-lg text-orange-400">{pendingItems}</div>
					<div class="text-text-secondary">Pending</div>
				</Box>
			</Grid>
		</Box>
	{/if}

	<!-- Todo List -->
	<Stack spacing="space-y-2">
		{#each safeItems as item (item.id)}
			{#if item && item.id}
				<ListItem {item} />
			{/if}
		{/each}
		
		{#if safeItems.length === 0}
			<Box className="text-center py-8 text-text-secondary" padding="">
				<p>No todos yet. Add one below to get started!</p>
			</Box>
		{/if}
	</Stack>
	
	<!-- Add Todo Form (always visible) -->
	<Box className="border-t border-tertiary pt-4 mt-4" padding="">
		<AddTodoForm />
	</Box>
</Stack>