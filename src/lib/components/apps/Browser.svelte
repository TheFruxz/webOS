<script lang="ts">
    import HtmlRender from "../HTMLRender.svelte";
    import { onMount } from "svelte";

    export let url: string;

    let updateSource: any;

    onMount(async () => {
        updateSource(url);
    })

</script>

<div class="browser">
    <!-- <iframe bind:this={iframe} title="Browser app for {url}" src="{url}" frameborder="0" /> -->
    <HtmlRender url={url} bind:updateURL={updateSource}/>
</div>

<style lang="scss">

    .browser {
        width: 100%;
        height: 100%;
    }

</style>