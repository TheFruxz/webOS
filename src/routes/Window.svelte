<script>
// @ts-nocheck

    import { windows } from "../store";
    import { cursor } from "../store";
    import { onMount } from "svelte";

    export let windowDetails = {
        id: 0,
        content: "404",
        width: 500,
        height: 300,
        x: 0,
        y: 0,
        title: "Unknown",
        icon: "https://llllllll.co/uploads/default/original/3X/c/8/c8e62a92b66c348e0cf6fcce04ff9b03f6b37bb8.png"
    };
    export let closeFunction;

    $: width = windowDetails.width;
    $: height = windowDetails.height;
    $: x = windowDetails.x;
    $: y = windowDetails.y;

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
    
    let isMoving = false;
    let moveLocation = { x: 0, y: 0 };
    let mover;

    cursor.subscribe((position) => {
        if(!isMoving) return
        let localX = position.x
        let localY = position.y

        localX += moveLocation.x
        localY += moveLocation.y

        windowDetails.x = localX
        windowDetails.y = localY

    })

    function drag(e) {
        isMoving = true;
        moveLocation.x = x - e.clientX
        moveLocation.y = y - e.clientY
    }

    function drop(e) {
        isMoving = false;
    }

    onMount(() => {
        buttonClose.addEventListener('click', closeFunction(windowDetails.id))
    })

</script>

<div class="window" style="height: {height}px; width: {width}px; top: {y}px; left: {x}px; z-index: {windowIndex}" bind:this={windowObject}>
    <div class="window-header" on:mousedown={drag} on:mouseup={drop}>
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
        border-bottom: solid 1px rgba(0, 0, 0, .1);
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
        aspect-ratio: 1/1;
        gap: 1rem;
        border-radius: 5px;
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
        /* background-color: var(--theme-bg); */
    }

</style>