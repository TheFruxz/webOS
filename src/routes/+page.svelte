<script>
    import { onMount } from "svelte";
    import Window from "./Window.svelte";
    import { cursor } from "../store";

    let openWindows = [];
    let hiddenWindows = [];

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
        <Window windowDetails={windowObject} closeFunction={closeWindow}>
            {windowObject.content}
        </Window>
    {/each}
</div>

<style>
    .desktop {
        user-select: none;
    }
</style>