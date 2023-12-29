<script lang="ts">
    import type { ContextMenuEntry } from "$lib/util/ContextMenu";
    import type Vector from "$lib/util/Vector";

    export let location: Vector;
    export let entries: ContextMenuEntry[];

    let contextMenu: HTMLDivElement;

    $: disappear = false;

    function close() {
        disappear = true;
        setTimeout(() => {
            disappear = false;
            contextMenu.parentNode?.removeChild(contextMenu)
        }, 200);
    }

</script>

<svelte:window on:click={close} />

<div class="context-menu" style="--x: {location.x}px; --y: {location.y}px;" class:disappear={disappear} bind:this={contextMenu}>
    {#each entries as entry}
        <div class="context-menu-entry" on:click={entry.action}>
            {entry.title}
        </div>
    {/each}
</div>

<style lang="scss">

    @keyframes appear {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .context-menu {
        z-index: 10000;
        position: absolute;
        top: var(--y);
        left: var(--x);
        width: 10rem;
        background-color: rgba(#fff, .7);
        backdrop-filter: blur(15px);
        min-height: 2rem;
        border: solid 1px rgba(0, 0, 0, .2);
        padding: .5rem;
        border-radius: 5px;
        opacity: 1;

        animation-name: appear;
        animation-duration: .2s;
        animation-timing-function: ease-in-out;

        .context-menu-entry {
            padding: .5rem .5rem;
            border-radius: 5px;
            transition: all .1s ease-in-out;

            &:hover {
                background-color: rgba(rgb(0, 136, 255), .9);
                cursor: pointer;
            }

        }

        &.disappear {
            transition: all .2s ease-in-out;
            opacity: 0;
            pointer-events: none;
        }
    }

</style>