import { app } from "./store.js";

// priority order helper
const priorityOrder = { high: 3, medium: 2, low: 1 };

function sortItems(items = []) {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });
}

// --- derived values ---
export const sortedItems = $derived(sortItems(app.items || []));
export const completedCount = $derived((app.items || []).filter(i => i.completed).length);
export const pendingCount = $derived((app.items || []).filter(i => !i.completed).length);
export const highPriorityCount = $derived((app.items || []).filter(i => i.priority === "high" && !i.completed).length);

// --- snapshots / helpers ---
export function getAppState() {
  return structuredClone(app);
}

export function getSortedItems() {
  return structuredClone(sortedItems);
}

export function getCompletedCount() {
  return completedCount;
}

export function getPendingCount() {
  return pendingCount;
}

export function useTodoStore() {
  return {
    app,
    sortedItems,
    completedCount,
    pendingCount,
    highPriorityCount,
    getAppState
  };
}
