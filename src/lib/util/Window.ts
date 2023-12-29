import WindowManager from "$lib/manager/WindowManager";
import type Vector from "./Vector";
import type { WindowContent } from "./WindowContent";

export default class Window {

    constructor(
        public content: WindowContent,
        public title: string,
        public icon: string = "default-icon.svg",
        public size: Vector = { x: 500, y: 300 },
        public position: Vector = { x: 0, y: 0 },
        public uuid: string = crypto.randomUUID(),
        public order: number = WindowManager.getNextWindowOrderNumber(),
    ) { }

}