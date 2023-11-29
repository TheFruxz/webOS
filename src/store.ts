import { writable } from "svelte/store";

export const windows = writable(0);
export const cursor = writable({ x: 0, y: 0 });