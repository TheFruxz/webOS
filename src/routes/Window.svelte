<script>
    import { windows } from "../store";
    import { onMount } from "svelte";

    export let closeWindow;
    export let width = 500;
    export let height = 300;
    export let x = 0;
    export let y = 0;

    let windowLevel;
    $: windowIndex = windowLevel;
    /**
     * @type {HTMLDivElement}
     */
    let windowObject;
    /**
     * @type {HTMLDivElement}
     */
    let buttonClose;
    /**
     * @type {HTMLDivElement}
     */
    let buttonMaximize;
    /**
     * @type {HTMLDivElement}
     */
    let buttonMinimize;

    onMount(() => {
        buttonClose.addEventListener("click", () => {
            closeWindow();
        });
    });

    function close() {
        windowObject.parentNode.removeChild(windowObject)
    }

    let isMoving = false;
    let moveLocation = { x: 0, y: 0 };

    function drag(e) {
        isMoving = true
        // moveLocation = the relative position of the mouse to the window
        moveLocation = { x: x - e.clientX, y: y - e.clientY }
        windows.update((n) => {
            let x = n + 1;
            windowLevel = x;
            return x;
        });
    }

    function drop(e) {
        isMoving = false
    }

    function move(e) {
        if(!isMoving) return

        x = e.clientX
        y = e.clientY
        
        x += moveLocation.x
        y += moveLocation.y
    }

</script>

<div class="window" style="height: {height}px; width: {width}px; top: {y}px; left: {x}px; z-index: {windowIndex}" bind:this={windowObject}>
    <div class="window-header" on:mousedown={drag} on:mousemove={move} on:mouseup={drop}>
        <div class="control-group">
            <div class="control control-close" bind:this={buttonClose}/>
            <div class="control control-minimize" bind:this={buttonMinimize}/>
            <div class="control control-maximize" bind:this={buttonMaximize}/>
        </div>
    </div>
    <div class="window-content">
        <slot />
    </div>
</div>

<style>

    .window {
        position: absolute;
        background-color: rgba(255, 255, 255, .1);
        backdrop-filter: blur(15px);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .25);
        overflow: hidden;
    }

    .window-header {
        width: 100%;
        height: 3rem;
        border-bottom: solid 1px white;
        display: flex;
        flex-direction: row;
        align-items: center;
        user-select: none;
    }

    .window-header .control-group {
        display: flex;
        flex-direction: row;
        gap: .4rem;
        padding: 0 1rem;
    }

    .window-header .control {
        width: 15px;
        height: 15px;
        gap: 1rem;
        border-radius: 200px;
    }

    .control-close {
        background-color: #FF5F56;
    }

    .control-minimize {
        background-color: #FEBB2E;
    }

    .control-maximize {
        background-color: #28C840;
    }

    .window-content {
        width: 100%;
        height: 100%;
        background-color: var(--theme-bg);
    }

</style>