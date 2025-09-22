
<script>
	import { addTodo } from '$lib/store/store.js';
	import { priorityOptions } from '$lib/utils.js';
	import { Box, Stack, Flex, Grid } from './utils';

	let showForm = false;
	let title = '';
	let description = '';
	let dueDate = '';
	let priority = 'medium';

	function handleSubmit() {
		if (!title.trim()) return;
		
		addTodo({
			title: title.trim(),
			description: description.trim(),
			dueDate,
			priority
		});
		
		// Reset form
		resetForm();
	}

	function resetForm() {
		title = '';
		description = '';
		dueDate = '';
		priority = 'medium';
		showForm = false;
	}
</script>

{#if !showForm}
	<button 
		on:click={() => showForm = true}
		class="w-full p-3 border-2 border-dashed border-tertiary rounded-lg text-text-secondary hover:border-accent hover:text-accent transition-colors"
	>
		+ Add New Todo
	</button>
{:else}
	<Box variant="primary" border="border border-tertiary">
		<form on:submit|preventDefault={handleSubmit}>
			<Stack spacing="space-y-3">
				<input 
					type="text" 
					bind:value={title}
					placeholder="Todo title (required)"
					class="w-full p-2 bg-secondary border border-tertiary rounded text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
					required
				/>
				
				<textarea 
					bind:value={description}
					placeholder="Description (optional)"
					rows="2"
					class="w-full p-2 bg-secondary border border-tertiary rounded text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
				></textarea>
				
				<Grid cols={2} gap="gap-3">
					<input 
						type="date" 
						bind:value={dueDate}
						class="w-full p-2 bg-secondary border border-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
					/>
					
					<select 
						bind:value={priority}
						class="w-full p-2 bg-secondary border border-tertiary rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
					>
						{#each priorityOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</Grid>
				
				<Flex gap="gap-2">
					<button 
						type="submit"
						class="flex-1 bg-accent text-primary py-2 px-4 rounded hover:bg-text-secondary transition-colors font-medium"
					>
						Add Todo
					</button>
					<button 
						type="button"
						on:click={resetForm}
						class="flex-1 bg-secondary border border-tertiary text-text-primary py-2 px-4 rounded hover:bg-tertiary transition-colors"
					>
						Cancel
					</button>
				</Flex>
			</Stack>
		</form>
	</Box>
{/if}