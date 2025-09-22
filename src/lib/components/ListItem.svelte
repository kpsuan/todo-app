<script>
	import { updateTodo, deleteTodo, toggleComplete } from '$lib/store/store.js';
	import { getPriorityColor, formatDate, isOverdue, priorityOptions } from '$lib/utils.js';
	import { Box, Stack, Flex, Grid, Grow } from './utils';

	export let item;

	let isEditing = false;
	let editData = { ...item };

	function startEdit() {
		editData = { ...item };
		isEditing = true;
	}

	function saveEdit() {
		if (!editData.title.trim()) {
			alert('Title is required');
			return;
		}
		
		try {
			updateTodo(item.id, {
				title: editData.title.trim(),
				description: editData.description.trim(),
				dueDate: editData.dueDate,
				priority: editData.priority
			});
			
			isEditing = false;
		} catch (error) {
			console.error('Failed to update todo:', error);
			alert('Failed to update todo. Please try again.');
		}
	}

	function cancelEdit() {
		editData = { ...item };
		isEditing = false;
	}

	function handleToggle() {
		toggleComplete(item.id);
	}

	function handleDelete() {
		if (confirm('Delete this todo?')) {
			try {
				deleteTodo(item.id);
			} catch (error) {
				console.error('Failed to delete todo:', error);
				alert('Failed to delete todo. Please try again.');
			}
		}
	}

	// Validation
	$: isValid = item && item.id && item.title;
</script>

{#if !isValid}
	<div class="p-3 border border-red-500 rounded-lg" style="background-color: var(--color-todo-item);">
		<p class="text-red-400 text-sm">Invalid todo item</p>
	</div>
{:else if isEditing}
	<!-- Edit Mode -->
	<div class="p-3 rounded-lg" style="background-color: var(--color-tertiary);">
		<Stack spacing="space-y-2">
			<input 
				type="text" 
				bind:value={editData.title}
				class="w-full p-2 bg-input-bg border border-input-border rounded text-sm font-medium text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
				placeholder="Todo title"
			/>
			
			<textarea 
				bind:value={editData.description}
				rows="2"
				class="w-full p-2 bg-input-bg border border-input-border rounded text-sm resize-none text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
				placeholder="Description"
			></textarea>
			
			<Grid cols={2} gap="gap-2">
				<input 
					type="date" 
					bind:value={editData.dueDate}
					class="p-2 bg-input-bg border border-input-border rounded text-sm text-text-primary focus:border-accent focus:outline-none"
				/>
				
				<select 
					bind:value={editData.priority}
					class="p-2 bg-input-bg border border-input-border rounded text-sm text-text-primary focus:border-accent focus:outline-none"
				>
					{#each priorityOptions as option}
						<option value={option.value} class="bg-input-bg text-text-primary">{option.label}</option>
					{/each}
				</select>
			</Grid>
			
			<Flex gap="gap-2">
				<button 
					on:click={saveEdit}
					class="px-3 py-1 bg-accent text-primary rounded text-sm hover:bg-text-secondary transition-colors"
				>
					Save
				</button>
				<button 
					on:click={cancelEdit}
					class="px-3 py-1 bg-secondary text-text-primary rounded text-sm hover:bg-hover transition-colors"
				>
					Cancel
				</button>
			</Flex>
		</Stack>
	</div>
{:else}
	<!-- View Mode -->
	<div class="group rounded-lg transition-all duration-200 hover:brightness-110" style="background-color: var(--color-todo-item);">
		<Flex align="items-start" gap="gap-3" className="p-3">
			<!-- Checkbox -->
			<button 
				on:click={handleToggle} 
				class="flex-shrink-0 pt-1"
				aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
			>
				<div class={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${ 
					item.completed ? "bg-accent border-accent" : "bg-secondary border-border hover:border-accent"
				}`}>
					{#if item.completed}
						<svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
						</svg>
					{/if}
				</div>
			</button>
			
			<!-- Content -->
			<Grow>
				<Flex align="items-start" justify="justify-between">
					<Grow>
						<h3 class={`font-medium ${item.completed ? "line-through text-text-secondary" : "text-text-primary"}`}>
							{item.title}
						</h3>
						
						{#if item.description}
							<p class={`text-sm mt-1 ${item.completed ? "line-through text-text-secondary opacity-70" : "text-text-secondary"}`}>
								{item.description}
							</p>
						{/if}
						
						<Flex align="items-center" gap="gap-3" className="mt-2 text-xs">
							<span class={`font-medium ${getPriorityColor(item.priority)}`}>
								{item.priority.toUpperCase()}
							</span>
							
							{#if item.dueDate}
								<span class={`${isOverdue(item.dueDate, item.completed) ? 'text-red-400 font-medium' : 'text-text-secondary'}`}>
									{formatDate(item.dueDate)}
									{#if isOverdue(item.dueDate, item.completed)}
										(Overdue!)
									{/if}
								</span>
							{/if}
						</Flex>
					</Grow>
					
					<!-- Actions -->
					<Flex gap="gap-1" className="opacity-0 group-hover:opacity-100 transition-opacity">
						<button 
							on:click={startEdit}
							class="px-2 py-1 text-xs bg-tertiary text-accent rounded hover:bg-accent hover:text-primary transition-colors"
						>
							Edit
						</button>
						<button 
							on:click={handleDelete}
							class="px-2 py-1 text-xs bg-red-900 text-red-400 rounded hover:bg-red-800 transition-colors"
						>
							Delete
						</button>
					</Flex>
				</Flex>
			</Grow>
		</Flex>
	</div>
{/if}