<script lang="ts">
    import { onMount } from "svelte";
    import WindowElement from "../lib/components/Window.svelte";
    import Window from "$lib/util/Window";
    import { cursor } from "../store";
    import { WindowContent } from "$lib/util/WindowContent";
    import manager from "$lib/manager/WindowManager";
    import Dock from "$lib/components/Dock.svelte";
    import WindowManager from "$lib/manager/WindowManager";
    import NavBar from "$lib/components/NavBar.svelte";

    for (let i = 0; i < 2; i++) {
        manager.open(
            new Window(
                WindowContent.blank(),
                "Hello World " + i,
            )
        )
    }

    manager.open(
        new Window(
            WindowContent.browser("https://collection-software.com"),
            "My Homepage",
        )
    )

    onMount(() => {
        document.addEventListener('mousemove', (e) => {
            cursor.set({ x: e.clientX, y: e.clientY })
        })
    })


    $: renderingWindows = WindowManager.getVisisbleWindows();
    WindowManager.windows.subscribe((value) => {
        renderingWindows = value;
    })
    
    let desktop: HTMLDivElement;

    onMount(() => {
        
        manager.windowOpener = (window: Window) => {
            new WindowElement({ target: desktop, props: { window: window, content: window.content } });
        }

        renderingWindows.forEach(manager.windowOpener);

    })

</script>
<h1 on:click={() => {
    manager.open(
            new Window(
                WindowContent.blank(),
                "Hello World",
                "https://thispersondoesnotexist.com/"
            )
        )
}}>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div class="desktop" bind:this={desktop}>
    
    <NavBar />
    <Dock />

</div>

<style>

    :global(body) {
        user-select: none;
        padding-top: 3rem;
    }

</style>