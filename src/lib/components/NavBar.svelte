<script lang="ts">
    import { windows } from "$lib/manager/WindowManager";
    import { openContextMenu } from "$lib/util/ContextMenu";
    import type Window from "$lib/util/Window";
    import type { NavbarEntry } from "$lib/util/WindowContent";


let _currentApp: Window | undefined = undefined;
$: currentApp = _currentApp;
$: navbar = _currentApp?.content?.navbarMenu || [];

windows.subscribe((value) => {
    setTimeout(() => {
        _currentApp = value[0]
    }, 0)
})

function openContext(e: MouseEvent, entry: NavbarEntry) {
    let clicked = e.target as HTMLElement;
    let x = clicked.offsetLeft;
    let y = clicked.offsetTop + (clicked.offsetHeight * 1.5);

    console.log(x, y)

    setTimeout(() => {
        openContextMenu({x, y}, entry.entries)
    }, 0)
}

</script>

<div class="nav-bar">
    <div class="brand nav-item">
        <img src="/logo.svg" alt="Logo" draggable="false">
    </div>
    <div class="app-name">
        <p class="nav-item">{currentApp?.title || "webOS"}</p>
    </div>
    <div class="actions">
        {#each navbar as entry}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="nav-item" on:click={(e) => { openContext(e, entry)}}>{entry.title}</div>
        {/each}
    </div>
</div>

<style lang="scss">

    .nav-bar {
        width: 100vw;
        height: 3rem;
        position: fixed;
        top: 0;
        left: 0;
        box-sizing: border-box;
        background-color: rgba(#fff, .7);
        backdrop-filter: blur(15px);
        display: flex;
        align-items: center;
        flex-direction: row;
        padding-left: 1rem;
        gap: .1rem;

        .brand {
            height: 60%;

            img {
                height: 2rem;
                filter: invert(1);
            }
        }

        .app-name {
            font-weight: 600;
        }

        .actions {
            display: flex;
            flex-direction: row;
            gap: .5rem;
        }

        .nav-item {
            height: min-content;
            border-radius: 5px;
            transition: all .1s ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            margin: 0;
            padding: .3rem .5rem;
            font-size: .9rem;

            &:hover {
                background-color: rgba(#000, .1);
            }

            &:active {
                background-color: rgba(#000, .2);
                transform: scale(.95);
            }

        }

    }

</style>