<script lang="ts">
    import type Window from "$lib/util/Window";
    import { windows } from "$lib/manager/WindowManager";

    let candidates: Window[] = [];
    windows.subscribe((value) => {
        candidates = value;
    })
    $: renderingWindows = candidates;

    // icon size + gap (only in between gap)
    $: dockWidth = (renderingWindows.length * 4) + (renderingWindows.length - 1) * 1

</script>

<div class="dock" style="--width: {dockWidth}rem">
    {#each renderingWindows as entry }
        <div class="dock-item">
            <img class="dock-icon" src="{entry.icon}" alt="App-Icon from {entry.title}">
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
        width: var(--width);
        transform: translateX(-50%);
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
        transition: all .2s ease-in-out;
        z-index: 1000;

        .dock-item {
            height: var(--nav-item-height);

            .dock-icon {
                height: 4rem;
                width: 4rem;
                box-sizing: border-box;
                border-radius: 22.37%;
                transition: all 50ms ease-in-out;
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