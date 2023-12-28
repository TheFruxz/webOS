<script lang="ts">
    import { onMount } from "svelte";
    import WindowElement from "../lib/components/Window.svelte";
    import Window from "$lib/util/Window";
    import { cursor } from "../store";
    import { WindowContent } from "$lib/util/WindowContent";
    import manager, { windows } from "$lib/manager/WindowManager";
    import Dock from "$lib/components/Dock.svelte";

    for (let i = 0; i < 4; i++) {
        manager.open(
            new Window(
                WindowContent.blank(),
                "Hello World " + i,
                "https://llllllll.co/uploads/default/original/3X/c/8/c8e62a92b66c348e0cf6fcce04ff9b03f6b37bb8.png",
            )
        )
    }

    onMount(() => {
        document.addEventListener('mousemove', (e) => {
            cursor.set({ x: e.clientX, y: e.clientY })
        })
    })

    let renderingCandidates: Window[] = [];
    windows.subscribe((value) => {
        renderingCandidates = value;
        console.log(value)
    })
    $: renderingWindows = renderingCandidates;

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

<div class="desktop">

    {#each renderingWindows as entry }
        {#if manager.isShown(entry)}
            <WindowElement window={entry}>
                {@html entry.content.render()}
            </WindowElement>    
        {/if}
    {/each}
    
    <Dock />

</div>

<style>

    .desktop {
        user-select: none;
    }

    

</style>