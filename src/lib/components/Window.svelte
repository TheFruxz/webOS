<script lang="ts">
    import WindowManager, { order, windows } from "$lib/manager/WindowManager";
    import type Window from "$lib/util/Window";
    import { fly } from "svelte/transition";
    import { cursor } from "../../store";
    import { onMount } from "svelte";
    import Constants from "$lib/util/Constants";
    import type Vector from "$lib/util/Vector";
    import type { WindowContent } from "$lib/util/WindowContent";

    export let window: Window;
    export let content: WindowContent | undefined = undefined;

    $: width = window.size.x;
    $: height = window.size.y;
    $: x = window.position.x;
    $: y = window.position.y;

    let windowLevel: number;
    $: windowIndex = windowLevel;

    let windowObject: HTMLDivElement;
    let buttonClose: HTMLDivElement;
    let buttonMaximize;
    let buttonMinimize;
    
    let isMoving = false;
    let moveLocation = { x: 0, y: 0 };

    let windowContentTarget: HTMLDivElement;

    let _isActive = false;
    $: isActive = _isActive;

    windows.subscribe((value) => {
        setTimeout(() => {
            _isActive = value[0].uuid === window.uuid
        }, 0)
    })

    function updateGlobalPosition(cursorPosition: Vector) {
        let localX = cursorPosition.x
        let localY = cursorPosition.y

        localX += moveLocation.x
        localY += moveLocation.y

        window.position.x = localX
        window.position.y = localY
    }

    function onTake(e: MouseEvent) {
        e.stopPropagation()
        isMoving = true;
        moveLocation.x = x - e.clientX
        moveLocation.y = y - e.clientY
        WindowManager.focusWindow(window.uuid)
        windowContentTarget.style.pointerEvents = "none"
    }

    function onDrop(e: MouseEvent) {
        e.stopPropagation()
        isMoving = false;
        updateGlobalPosition({ x: e.clientX, y: e.clientY })
        windowContentTarget.style.pointerEvents = "all"
    }

    function onClick(e: MouseEvent) {
        console.log("focus window...")
        WindowManager.focusWindow(window.uuid)
        windowContentTarget.style.pointerEvents = "all"
    }

    function onResize(e) {
        window.size.x = e.target.clientWidth
        window.size.y = e.target.clientHeight
        windowContentTarget.style.pointerEvents = "none"

    }

    onMount(() => {
        buttonClose.addEventListener('click', () => {
            WindowManager.close(window.uuid)
        })

        content?.build(windowContentTarget)

        cursor.subscribe((position) => {
            if(!isMoving) return
            
            updateGlobalPosition(position)
        })

        order.subscribe(() => {
            // delayed update for bugging reasons
            setTimeout(() => {
                console.log("window uuid: " + window.uuid + " level " + windowLevel)
                windowLevel = Constants.MAX_WINDOW_AMOUNT -  WindowManager.getWindowIndex(window.uuid)
                console.log("updated level: " + windowLevel)
            }, 0)
        })

        window.htmlElement = windowObject

    })

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="window" style="--height: {height}px; --width: {width}px; --y: {y}px; --x: {x}px; --windowIndex: {windowIndex}" bind:this={windowObject} transition:fly on:mousedown={onClick} on:resize={onResize} class:active={isActive} class:levitating={isMoving}>
    <div class="window-header" on:mousedown={onTake} on:mouseup={onDrop}>
        <div class="control-group">
            <div class="control material-symbols-outlined control-close" bind:this={buttonClose}>
                <i class="control-symbol material-symbols-outlined">close</i>
            </div>
            <div class="control material-symbols-outlined control-minimize" bind:this={buttonMinimize}>
                <i class="control-symbol material-symbols-outlined">minimize</i>
            </div>
            <div class="control material-symbols-outlined control-maximize" bind:this={buttonMaximize}>
                <i class="control-symbol material-symbols-outlined">open_in_full</i>
            </div>
        </div>
        <p class="window-title">{window.title}</p>
    </div>
    <div class="window-content" bind:this={windowContentTarget} />
</div>

<style lang="scss">

    .window {
        width: var(--width);
        height: var(--height);
        top: var(--y);
        left: var(--x);
        z-index: var(--windowIndex);

        position: absolute;
        background-color: rgba(255, 255, 255, .1);
        backdrop-filter: blur(15px);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .25);
        overflow: hidden;
        transition: background-color .1s ease-in-out, box-shadow .1s ease-in-out, transform .1s ease-in-out, backdop-filter .1s ease-in-out, border .1s ease-in-out;
        border: solid 1px rgba(0, 0, 0, .1);
        resize: both;
        min-width: 15rem;
        min-height: 5rem;
        padding: 1px;

        &:active {
            @extend .active;
            z-index: 101;
        }

        &.levitating {
            background-color: rgba(255, 255, 255, .2);
            box-shadow: 0 0 25px rgba(0, 0, 0, .15);
            // transform: scale(1.02);
            backdrop-filter: blur(25px);
            border: solid 1px rgba(0, 0, 0, .2);
        }

        .window-header {
            width: 100%;
            height: 3rem;
            border-bottom: solid 1px rgba(0, 0, 0, .1);
            background-color: rgba(255, 255, 255, .5);
            display: flex;
            flex-direction: row;
            align-items: center;
            user-select: none;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;

            .control-group {
                display: flex;
                flex-direction: row;
                gap: .4rem;
                padding: 0 1rem;

                .control {
                    width: 15px;
                    height: 15px;
                    box-sizing: border-box;
                    aspect-ratio: 1/1;
                    gap: 1rem;
                    border-radius: 5px;
                    background-color: gray;
                    transition: all .1s ease-in-out;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: solid 1px rgba(#000, 0);

                    &:active {
                        filter: brightness(120%);
                    }

                    .control-symbol {
                        transition: all .1s ease-in-out;
                        user-select: none;
                        text-align: center;
                        font-size: .8rem;
                        padding: 0;
                        margin: 0;
                        color: #222;
                        opacity: 0;

                    }

                }

            }

            .window-title {
                font-weight: 500;
            }

        }
        
        &.active, .control-group:hover {
            .control {
                border: solid 1px rgba(#000, .1);

                &.control-close {
                    background-color: #FF5F56;
                }

                &.control-minimize {
                    background-color: #FEBB2E;
                }

                &.control-maximize {
                    background-color: #28C840;
                }
                .control-symbol {
                    opacity: 1;
                }
            }
        }

    }

    .window-content {
        width: 100%;
        height: 100%;
        /* background-color: var(--theme-bg); */
    }

</style>