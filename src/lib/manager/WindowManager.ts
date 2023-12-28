import type Window from "$lib/util/Window";
import { writable } from "svelte/store";

let openWindows: Window[] = [];
let hiddenWindowIDs: string[] = []; // UUIDs of the windows

export const windows = writable(openWindows);
export const order = writable(0);

const WindowManager = {
    openWindows,
    hiddenWindowIDs,
    render(): void {
        windows.set(openWindows);
    },
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
    getWindowIndex(windowUUID: string): number {
        return openWindows.findIndex((window) => window.uuid === windowUUID);
    },
    forEach(callback: (window: Window, id: number) => void): void {
        openWindows.forEach(callback);
    },
    open(window: Window): void {
        openWindows.push(window);
        this.render();
    },
    close(windowUUID: string): void {
        openWindows = openWindows.filter((w) => w.uuid !== windowUUID);
        this.render();
    },
    hide(windowUUID: string): void {
        hiddenWindowIDs.push(windowUUID);
        this.render();
    },
    show(windowUUID: string): void {
        hiddenWindowIDs = hiddenWindowIDs.filter((id) => id !== windowUUID);
        this.render();
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
    focusWindow(windowUUID: string, triggerOrderUpdate: boolean = true): void {
        let resolvedWindow = this.getWindow(windowUUID);
        
        if (!resolvedWindow) {
            console.error("Window not found");
            return
        };
        
        this.show(windowUUID);

        // move window in openWindows to first index
        openWindows.splice(this.getWindowIndex(windowUUID), 1);
        openWindows.unshift(resolvedWindow);
        
        if (triggerOrderUpdate) order.update((o) => o + 1);
        console.log("Focused window", resolvedWindow);
    }
}

export default WindowManager;