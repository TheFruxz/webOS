<script lang="ts">
    import { onMount } from "svelte";
    import WindowElement from "./Window.svelte";
    import Window from "$lib/util/Window";
    import { cursor } from "../store";
    import { WindowContent } from "$lib/util/WindowContent";
    import manager, { windows } from "$lib/manager/WindowManager";

    manager.open(
        new Window(
            WindowContent.blank(),
            "Hello World",
            "https://llllllll.co/uploads/default/original/3X/c/8/c8e62a92b66c348e0cf6fcce04ff9b03f6b37bb8.png",
        )
    )

    onMount(() => {
        document.addEventListener('mousemove', (e) => {
            cursor.set({ x: e.clientX, y: e.clientY })
        })
    })

    let renderingCandidates: Window[] = [];
    windows.subscribe((value) => {
        renderingCandidates = value;
    })
    $: renderingWindows = renderingCandidates;

</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div class="desktop">

    {#each renderingWindows as entry }
        {#if manager.isShown(entry)}
            <WindowElement window={entry}>
                {entry.content.render()}
            </WindowElement>    
        {/if}
    {/each}

    <div class="taskbar">
        {#each renderingWindows as entry }
            <div class="taskbar-item">
                <img class="taskbar-icon" src="{entry.icon}" width="150px" height="150px">
            </div>
        {/each}
    </div>
</div>

<style>

    .desktop {
        user-select: none;
    }

    .taskbar {
        position: fixed;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        bottom: 0;
        height: var(--nav-height);
        overflow: hidden;
        background-color: rgba(0, 0, 0, .2);
        border: solid 1px rgba(0, 0, 0, .4);
        backdrop-filter: blur(15px);
        min-width: 4rem;
        margin: 1rem;
        border-radius: 15px;
        gap: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .taskbar .taskbar-icon {
        height: 4rem;
        width: 4rem;
        box-sizing: border-box;
        border-radius: 15px;
    }

    .taskbar .taskbar-item {
        height: var(--nav-item-height);
    }

</style>