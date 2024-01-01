import ContextMenu from "$lib/components/ContextMenu.svelte";
import type Vector from "./Vector";

export class ContextMenuEntry {
    constructor(
        public title: string,
        public action: () => void,
    ) {}

}

export function openContextMenu(location: Vector, entries: ContextMenuEntry[]) {
    new ContextMenu({ target: document.body, props: { location: location, entries: entries } });
}