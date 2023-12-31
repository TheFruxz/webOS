<script lang="ts">
  import { onMount } from "svelte";

    export let url: string;
    let source: string = "";

    $: source;

    let iframe: HTMLIFrameElement;


    async function renderHTML() {
        let parsed = parseHTML();
        let stylesheets = getImportedStyles(parsed);
        let scripts = getImporedScripts(parsed);
        let images = getImportedImages(parsed);

        let parsedstyles: string[] = await parseStyles(stylesheets);
        let parsedimages:  {source:string, element:Element}[] = await parseImages(images);
        
        

        parsedstyles.forEach((style) => {
            console.log("---- style ----")
            console.log(style);
            let styleTag = document.createElement("style");
            styleTag.innerHTML = style;
            parsed.head.appendChild(styleTag);
            console.log("---- style ----")
            console.log(style);
        })

        let imagerObjects = parsed.querySelectorAll("img");
        parsedimages.forEach((image) => {
            //find image with same src pathname
            imagerObjects.forEach((imageObject) => {
                if(imageObject === image.element){
                    imageObject.src = image.source;
                }
            })

        })

        

        scripts.forEach((script) => {
            let scriptTag = document.createElement("script");
            scriptTag.src = script;
            iframe.contentDocument?.head.appendChild(scriptTag);
        })


        iframe.src = "data:text/html;charset=utf-8," + escape(parsed.documentElement.innerHTML)


       
    }


    export async function updateURL(newUrl: string) {
        url = newUrl;
        const response = await fetch(url)
        source = await response.text()
        renderHTML();
    }

    function parseHTML(): Document {
        let parser = new DOMParser();
        let doc = parser.parseFromString(source, "text/html");
        return doc;
    }

    function getImportedStyles(doc: Document) {
        let styles = doc.querySelectorAll("link[rel='stylesheet']");
        let stylesheets: string[] = [];
        styles.forEach((style) => {
            stylesheets.push(style.href);
        })
        return stylesheets;
    }

    function getImporedScripts(doc: Document) {
        let scripts = doc.querySelectorAll("script[src]");
        let scriptSrcs: string[] = [];
        scripts.forEach((script) => {
            scriptSrcs.push(script.src);
        })
        return scriptSrcs;
    }

    function getImportedImages(doc: Document) {
        let images = doc.querySelectorAll("img[src]");
        let imageSrcs: {source:string, element:Element}[] = [];
        images.forEach((image) => {
            let obj = {
                source: image.src,
                element: image
            }
            imageSrcs.push(obj);
        })
        return imageSrcs;
    }

    /**
     * This function gets all stylesheets to deliver them locally to the iframe
     * 
     * @param styles
     */
    async function parseStyles(styles: string[]){
        let parsedStyles: string[] = [];
        for(let i = 0; i < styles.length; i++){
            let style = styles[i];
            let urlObject = new URL(url);
            let styleURL = new URL(style);
            if(styleURL.hostname === window.location.hostname) style =  urlObject.origin + styleURL.pathname;
            console.log(style);

            let parsedStyle: string = await fetch(style).then((response) => {
                return response.text();
            })
            console.log(parsedStyle);
            await parsedStyles.push(await parsedStyle);
        }
        console.log("---- parsedStyles ----")
        console.log(parsedStyles[0])
        return await parsedStyles; 
    }

    async function parseImages(images: {source:string, element:Element}[]){
        let parsedImages:  {source:string, element:Element}[] = [];
        for(let i = 0; i < images.length; i++){
            let image = images[i];
            let urlObject = new URL(url);
            let imageURL = new URL(image.source);
            if(imageURL.hostname === window.location.hostname) image.source =  urlObject.origin + imageURL.pathname;
            console.log(image);

            await parsedImages.push(image);
        }
        console.log("---- parsedImages ----")
        console.log(parsedImages)
        return await parsedImages; 
    }



    onMount(() => {
        renderHTML();
    })
    

</script>


<div class="html-render">
    <iframe bind:this={iframe} title="HTML Render" frameborder="0" />
</div>


<style>
    .html-render {
        width: 100%;
        height: 100%;
    }

    iframe {
        width: 100%;
        height: 100%;
    }
</style>