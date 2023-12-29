<script lang="ts">
    export let url: string = "https://google.com"
</script>

<div class="browser">
    <iframe title="Browser app for {url}" src="{url}" frameborder="0" />
</div>

<style lang="scss">

    .browser {
        width: 100%;
        height: 100%;

        iframe {
            width: 100%;
            height: 100%;
        }

    }

</style>