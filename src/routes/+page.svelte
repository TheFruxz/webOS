<script lang="ts">
    import { onMount } from "svelte";
    import WindowElement from "../lib/components/Window.svelte";
    import Window from "$lib/util/Window";
    import { cursor } from "../store";
    import { BlankWindowContent, BrowserWindowContent, WindowContent } from "$lib/util/WindowContent";
    import manager, { windows } from "$lib/manager/WindowManager";
    import Dock from "$lib/components/Dock.svelte";
    import Browser from "$lib/components/apps/Browser.svelte";
    import WindowManager from "$lib/manager/WindowManager";

    for (let i = 0; i < 2; i++) {
        manager.open(
            new Window(
                WindowContent.blank(),
                "Hello World " + i,
                "https://llllllll.co/uploads/default/original/3X/c/8/c8e62a92b66c348e0cf6fcce04ff9b03f6b37bb8.png",
            )
        )
    }

    manager.open(
        new Window(
            WindowContent.browser("https://abc.xyz"),
            "My Homepage",
            "https://llllllll.co/uploads/default/original/3X/c/8/c8e62a92b66c348e0cf6fcce04ff9b03f6b37bb8.png",
        )
    )

    onMount(() => {
        document.addEventListener('mousemove', (e) => {
            cursor.set({ x: e.clientX, y: e.clientY })
        })
    })


    $: renderingWindows = WindowManager.getVisisbleWindows();
    windows.subscribe((value) => {
        renderingWindows = value;
    })
    
    let desktop: HTMLDivElement;

    onMount(() => {
        
        renderingWindows.forEach((window) => {
            new WindowElement({ target: desktop, props: { window: window, content: window.content } });
        })

    })

</script>
<h1 on:click={() => {
    manager.open(
            new Window(
                WindowContent.blank(),
                "Hello World",
                "https://llllllll.co/uploads/default/original/3X/c/8/c8e62a92b66c348e0cf6fcce04ff9b03f6b37bb8.png",
            )
        )
}}>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div class="desktop" bind:this={desktop}>

    <!-- {#each renderingWindows as entry }
        {#if manager.isShown(entry.uuid)}
            <WindowElement window={entry}>
                {entry.content.built}
            </WindowElement>    
        {/if}
    {/each} -->
    
    <Dock />

</div>

<style>

    .desktop {
        user-select: none;
    }

    

</style>