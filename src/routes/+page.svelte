<script>
    import { onMount } from "svelte";
    import Window from "./Window.svelte";
    import { cursor } from "../store";

    let openWindows = [];
    let hiddenWindowIDs = [];

    openWindows.push({
        id: 0,
        content: "Hello World",
        width: 500,
        height: 300,
        x: 0,
        y: 0,
        title: "Hello World",
        icon: "https://llllllll.co/uploads/default/original/3X/c/8/c8e62a92b66c348e0cf6fcce04ff9b03f6b37bb8.png"
    });

    function cursorMove(e) {
        cursor.set({ x: e.clientX, y: e.clientY })
    }

    function closeWindow(id) {
        return () => {
            openWindows = openWindows.filter((window) => window.id !== id)
        }
    }

    onMount(() => {
        document.addEventListener('mousemove', cursorMove)
    })

</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div class="desktop">
    {#each openWindows as windowObject}
        {#if !hiddenWindowIDs.some((id) => id === windowObject.id)}
            <Window windowDetails={windowObject} closeFunction={closeWindow}>
                {windowObject.content}
            </Window>
        {/if}
    {/each}


    <div class="taskbar">
        {#each openWindows as openWindow }
            <div class="taskbar-item">
                <img class="taskbar-icon" src="{openWindow.icon}" width="150px" height="150px">
            </div>
            <div class="taskbar-item">
                <img class="taskbar-icon" src="{openWindow.icon}" width="150px" height="150px">
            </div>
            <div class="taskbar-item">
                <img class="taskbar-icon" src="{openWindow.icon}" width="150px" height="150px">
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
        height: var(--nav-item-height);
        width: var(--nav-item-height);
        border-radius: 15px;
    }

    .taskbar .taskbar-item {
        height: var(--nav-item-height);
    }

</style>