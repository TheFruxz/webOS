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
    getWindowByOrder(index: number): Window {
        return openWindows[index];
    },
    getWindow(windowUUID: string): Window | undefined {
        return openWindows.find((window) => window.uuid === windowUUID);
    },
    forEach(callback: (window: Window, id: number) => void): void {
        openWindows.forEach(callback);
    },
    open(window: Window): void {
        openWindows.push(window);
        windows.set(openWindows);
    },
    close(windowUUID: string): void {
        openWindows = openWindows.filter((w) => w.uuid !== windowUUID);
        windows.set(openWindows);
    },
    hide(windowUUID: string): void {
        hiddenWindowIDs.push(windowUUID);
    },
    show(windowUUID: string): void {
        hiddenWindowIDs = hiddenWindowIDs.filter((id) => id !== windowUUID);
    },
    isHidden(windowUUID: string): boolean {
        return hiddenWindowIDs.indexOf(windowUUID) !== -1;
    },
    isShown(windowUUID: string): boolean {
        return !this.isHidden(windowUUID);
    },
    toggleVisibility(windowUUID: string): void {
        if (this.isHidden(windowUUID)) {
            this.show(windowUUID);
        } else {
            this.hide(windowUUID);
        }
    },
    getActiveWindow(): Window {
        return openWindows[0];
    },
    isActiveWindow(windowUUID: string): boolean {
        return this.getActiveWindow().uuid === windowUUID;
    },
    focusWindow(windowUUID: string): void {
        if (this.isActiveWindow(windowUUID)) return;

        this.show(windowUUID);

        let resolvedWindow = this.getWindow(windowUUID);
        
        if (!resolvedWindow) return;

        // move window in openWindows to index 0
        openWindows = openWindows.filter((w) => w.uuid !== resolvedWindow?.uuid);
        openWindows.unshift(resolvedWindow);
        
    }
}

export default WindowManager;