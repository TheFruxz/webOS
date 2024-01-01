<script lang="ts">
    import type Window from "$lib/util/Window";
    import WindowManager from "$lib/manager/WindowManager";
    import { openContextMenu } from "$lib/util/ContextMenu";
    import { onMount } from "svelte";

    let _renderingWindows: Window[] = []
    $: renderingWindows = _renderingWindows;
    WindowManager.windows.subscribe((value) => {
        _renderingWindows = value.toSorted((a, b) => a.order - b.order);
    })

    let dock: HTMLDivElement;

    // icon size + gap (only in between gap)
    $: dockWidth = (renderingWindows.length * (4 + .2)) + (renderingWindows.length - 1 * .5) * 1 // TODO animation currently disabled

    function openContext(e: MouseEvent, window: Window) {
        let base = [
            {
                title: "Quit",
                action: () => {
                    WindowManager.close(window.uuid)
                }
            }
        ]

        openContextMenu(e, base.concat(window.content.contextMenu))
    }

    onMount(() => {
        WindowManager.dock = dock;
    })

</script>

<div class="dock" style="--width: {dockWidth}rem" bind:this={dock}>
    {#each renderingWindows as entry }
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="dock-item" class:active={WindowManager.isActiveWindow(entry.uuid)} on:click={() => {WindowManager.focusWindow(entry.uuid)}} on:contextmenu|preventDefault={(e) => { openContext(e, entry) }}>
            <img class="dock-icon" src="{entry.icon}" alt="App-Icon from {entry.title}" draggable="false">
        </div>
    {/each}
</div>

<style lang="scss">

    .dock {
        position: fixed;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        bottom: 0;
        left: 50%;
        width: min-content;
        transform: translateX(-50%);
        height: var(--nav-height);
        overflow: hidden;
        background-color: rgba(0, 0, 0, .2);
        border: solid 1px rgba(0, 0, 0, .4);
        backdrop-filter: blur(15px);
        min-width: 4rem;
        margin: 1rem;
        border-radius: 15px;
        gap: .5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        transition: all .2s ease-in-out;
        z-index: 1000;
        user-select: none;

        .dock-item {
            height: calc(4rem + .4rem);
            width: calc(4rem + .4rem);
            padding: 0;
            margin: 0;
            border-radius: 25%;
            border: solid 2px transparent;
            transition: border .2s ease-in-out;

            &.active {
                border: solid 2px rgb(0, 136, 255);
            }

            .dock-icon {
                height: 4rem;
                width: 4rem;
                box-sizing: border-box;
                border-radius: 22.37%;
                transition: all 50ms ease-in-out;
                background-color: white;
                margin: .2rem;
            }

            &:active {
                .dock-icon {
                    transform: scale(.9);
                    filter: brightness(80%);
                }
            }

        }

    }

</style>