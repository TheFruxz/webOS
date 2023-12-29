import Blank from "$lib/components/apps/Blank.svelte"
import Browser from "$lib/components/apps/Browser.svelte"
import type { SvelteComponent } from "svelte"
import type { ContextMenuEntry } from "./ContextMenu"

export interface NavbarEntry {
    title: string
    entries: ContextMenuEntry[]
}

export abstract class WindowContent {

    abstract build(target: Element | Document | ShadowRoot): SvelteComponent

    abstract contextMenu: ContextMenuEntry[]
    abstract navbarMenu: NavbarEntry[]

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

export class BlankWindowContent extends WindowContent {
    contextMenu: ContextMenuEntry[] = []
    navbarMenu: NavbarEntry[] = []

    override build(target: Element | Document | ShadowRoot): SvelteComponent {
        return new Blank({ target: target })
    }

}

export class BrowserWindowContent extends WindowContent {
    contextMenu: ContextMenuEntry[] = []
    navbarMenu: NavbarEntry[] = [
        {
            title: "File",
            entries: [
                {
                    title: "New Window",
                    action: () => {}
                }
            ]
        }
    ]
    
    constructor(public url: string) {
        super()
    }

    override build(target: Element | Document | ShadowRoot): SvelteComponent {
        return new Browser({ target: target, props: { url: this.url } })
    }

}