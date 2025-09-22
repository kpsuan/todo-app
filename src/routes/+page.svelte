<script>
	import '../app.css';
	import { save, appStore } from "$lib/store/store.js";
	import { onDestroy } from "svelte";
	import List from "$lib/components/List.svelte";
	import { Container, Section, Box, Stack } from "$lib/components/utils";
	import { derived } from 'svelte/store';

	// Create derived stores for the page
	const sortedItems = derived(appStore, $appStore => {
		if (!$appStore.items) return [];
		
		const priorityOrder = { high: 3, medium: 2, low: 1 };
		return [...$appStore.items].sort((a, b) => {
			if (a.completed !== b.completed) {
				return a.completed ? 1 : -1;
			}
			if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
				return priorityOrder[b.priority] - priorityOrder[a.priority];
			}
			if (a.dueDate && b.dueDate) {
				return new Date(a.dueDate) - new Date(b.dueDate);
			}
			return 0;
		});
	});

	const pendingCount = derived(appStore, $appStore => {
		if (!$appStore.items) return 0;
		return $appStore.items.filter(item => !item.completed).length;
	});

	onDestroy(() => save());
</script>

<Box variant="primary" className="min-h-screen h-full w-full fixed inset-0 overflow-auto">
	<Container>
		<!-- Combined Header and Todo Content -->
		<Section variant="card">
			<Stack>
				<!-- Header within the card -->
				<Box className="pb-2 mb-2 text-center" >
					<img src="/src/assets/6.png" alt="Todo App Icon" class="w-64 h-48 mx-auto mb-2" />
					<h1 class="text-2xl font-bold text-text-primary">Todo App</h1>
					<p class="text-sm text-text-secondary mt-1">
						{#if $sortedItems.length > 0}
							{$pendingCount} pending of {$sortedItems.length} todos
						{:else}
							Get organized with your todo list!
						{/if}
					</p>
				</Box>

				<!-- Todo List Content -->
				<List />
			</Stack>
		</Section>
	</Container>
</Box>