import type Window from "$lib/util/Window";
import { writable } from "svelte/store";

export default class WindowManager {

    static openWindows: Window[] = [];
    static hiddenWindowIDs: string[] = []; // UUIDs of the windows

    static windows = writable(this.openWindows);
    static order = writable(0); // TODO rename, to be more expressive
    static globalDesktop = writable<HTMLDivElement>();
    static windowOrder = writable(0)

    static windowOpener: (window: Window) => void = (window: Window) => {};

    static render(): void {
        this.windows.set(this.openWindows);
    }

    static getNextWindowOrderNumber(): number {
        let x = this.openWindows.length;
        this.windowOrder.set(x + 1);
        return x;
    }

    static getVisisbleWindows(): Window[] {
        return this.openWindows.filter((window) => this.hiddenWindowIDs.indexOf(window.uuid) === -1);
    }

    static getHiddenWindows(): Window[] {
        return this.openWindows.filter((window) => this.hiddenWindowIDs.indexOf(window.uuid) !== -1);
    }

    static getWindowByOrder(index: number): Window {
        return this.openWindows[index];
    }

    static getWindow(windowUUID: string): Window | undefined {
        return this.openWindows.find((window) => window.uuid === windowUUID);
    }

    static getWindowIndex(windowUUID: string): number {
        return this.openWindows.findIndex((window) => window.uuid === windowUUID);
    }

    static forEach(callback: (window: Window, id: number) => void): void {
        this.openWindows.forEach(callback);
    }

    static open(window: Window): void {
        this.openWindows.push(window);
        this.windowOpener(window);
        this.focusWindow(window.uuid);
        this.render();
    }

    static close(windowUUID: string): void {
        let window = this.getWindow(windowUUID);

        if (window) {
            let htmlElement: HTMLDivElement | undefined = window.htmlElement;
            if (htmlElement) {
                htmlElement.parentNode?.removeChild(htmlElement)
            }

            this.openWindows = this.openWindows.filter((w) => w.uuid !== windowUUID);
            this.render();

        }
    }

    static hide(windowUUID: string): void {
        this.hiddenWindowIDs.push(windowUUID);
        this.render();
    }

    static show(windowUUID: string): void {
        this.hiddenWindowIDs = this.hiddenWindowIDs.filter((id) => id !== windowUUID);
        this.render();
    }

    static isHidden(windowUUID: string): boolean {
        return this.hiddenWindowIDs.indexOf(windowUUID) !== -1;
    }

    static isShown(windowUUID: string): boolean {
        return !this.isHidden(windowUUID);
    }

    static toggleVisibility(windowUUID: string): void {
        if (this.isHidden(windowUUID)) {
            this.show(windowUUID);
        } else {
            this.hide(windowUUID);
        }
    }

    static getActiveWindow(): Window {
        return this.openWindows[0];
    }

    static isActiveWindow(windowUUID: string): boolean {
        return this.getActiveWindow().uuid === windowUUID;
    }

    static focusWindow(windowUUID: string, triggerOrderUpdate: boolean = true): void {
        let resolvedWindow = this.getWindow(windowUUID);
        
        if (!resolvedWindow) {
            console.error("Window not found");
            return
        };
        
        this.show(windowUUID);

        // move window in openWindows to first index
        this.openWindows.splice(this.getWindowIndex(windowUUID), 1);
        this.openWindows.unshift(resolvedWindow);
        
        if (triggerOrderUpdate) this.order.update((o) => o + 1);
        console.log("Focused window", resolvedWindow);
    }

}