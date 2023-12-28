import type Window from "$lib/util/Window";
import { writable } from "svelte/store";

let openWindows: Window[] = [];
let hiddenWindowIDs: string[] = []; // UUIDs of the windows

export const windows = writable(openWindows);

const WindowManager = {
    openWindows,
    hiddenWindowIDs,
    getVisisbleWindows(): Window[] {
        return openWindows.filter((window) => hiddenWindowIDs.indexOf(window.uuid) === -1);
    },
    getHiddenWindows(): Window[] {
        return openWindows.filter((window) => hiddenWindowIDs.indexOf(window.uuid) !== -1);
    },
    getWindow(id: number): Window {
        return openWindows[id];
    },
    forEach(callback: (window: Window, id: number) => void): void {
        openWindows.forEach(callback);
    },
    open(window: Window): void {
        openWindows.push(window);
        windows.set(openWindows);
    },
    close(window: Window): void {
        openWindows = openWindows.filter((w) => w.uuid !== window.uuid);
        windows.set(openWindows);
    },
    hide(window: Window): void {
        hiddenWindowIDs.push(window.uuid);
    },
    show(window: Window): void {
        hiddenWindowIDs = hiddenWindowIDs.filter((id) => id !== window.uuid);
    },
    isHidden(window: Window): boolean {
        return hiddenWindowIDs.indexOf(window.uuid) !== -1;
    },
    isShown(window: Window): boolean {
        return !this.isHidden(window);
    },
    toggleVisibility(window: Window): void {
        if (this.isHidden(window)) {
            this.show(window);
        } else {
            this.hide(window);
        }
    }
}

export default WindowManager;