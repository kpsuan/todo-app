import { writable } from 'svelte/store';
import { browser } from "$app/environment";

const app_name = "enhanced_todo_app_2025";

const _default = {
	date_created: Date.now(),
	date_updated: Date.now(),
	items: [{
		id: "demo-1",
		title: "Welcome to your todo app",
		description: "This is a sample todo with all the new features",
		dueDate: new Date().toISOString().split('T')[0],
		priority: "medium",
		completed: false,
		date_added: Date.now(),
		date_updated: Date.now(),
		date_deleted: null,
	}],
	trash: []
};

function load() {
	if (!browser || !(app_name in localStorage)) {
		return _default;
	}
	return JSON.parse(localStorage[app_name]);
}

export const appStore = writable(load());

export function save() {
	appStore.update(state => {
		state.date_updated = Date.now();
		if (browser) {
			localStorage[app_name] = JSON.stringify(state);
		}
		return state;
	});
}

export function addTodo(todoData) {
	const newTodo = {
		id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		title: todoData.title || "Untitled",
		description: todoData.description || "",
		dueDate: todoData.dueDate || "",
		priority: todoData.priority || "medium",
		completed: false,
		date_added: Date.now(),
		date_updated: Date.now(),
		date_deleted: null,
	};
	
	appStore.update(state => {
		state.items = [...state.items, newTodo];
		return state;
	});
	save();
}

export function updateTodo(id, updates) {
	appStore.update(state => {
		const index = state.items.findIndex(item => item.id === id);
		if (index !== -1) {
			state.items[index] = {
				...state.items[index],
				...updates,
				date_updated: Date.now()
			};
		}
		return state;
	});
	save();
}

export function deleteTodo(id) {
	appStore.update(state => {
		const index = state.items.findIndex(item => item.id === id);
		if (index !== -1) {
			const item = state.items[index];
			item.date_deleted = Date.now();
			state.trash = [...state.trash, item];
			state.items = state.items.filter(item => item.id !== id);
		}
		return state;
	});
	save();
}

export function toggleComplete(id) {
	appStore.update(state => {
		const item = state.items.find(item => item.id === id);
		if (item) {
			item.completed = !item.completed;
			item.date_updated = Date.now();
		}
		return state;
	});
	save();
}