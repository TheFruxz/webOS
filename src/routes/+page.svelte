<script>
    import { onMount } from "svelte";
    import Window from "./Window.svelte";
    import { cursor } from "../store";

    let openWindows = [];
    let hiddenWindows = [];

    openWindows.push("test");
    openWindows.push("test");

    function cursorMove(e) {
        cursor.set({ x: e.clientX, y: e.clientY })
    }

    onMount(() => {
        document.addEventListener('mousemove', cursorMove)
    })

</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div class="desktop">
    {#each openWindows as window}
        <Window closeWindow={openWindows = openWindows.filter((e) => e !== window)}>
            {window}
        </Window>
    {/each}
</div>

<style>
    .desktop {
        user-select: none;
    }
</style>