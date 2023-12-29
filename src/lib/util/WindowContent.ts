import Blank from "$lib/components/apps/Blank.svelte"
import Browser from "$lib/components/apps/Browser.svelte"
import type { SvelteComponent } from "svelte"

export abstract class WindowContent {

    isBlank(): boolean {
        return this instanceof BlankWindowContent
    }

    isBrowser(): boolean {
        return this instanceof BrowserWindowContent
    }

    public static blank(): BlankWindowContent {
        return new BlankWindowContent()
    }

    public static browser(url: string): BrowserWindowContent {
        return new BrowserWindowContent(url)
    }

}

export class BlankWindowContent extends WindowContent { }

export class BrowserWindowContent extends WindowContent {
    
        constructor(public url: string) {
            super()
        }

}