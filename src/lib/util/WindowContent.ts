export abstract class WindowContent {

    abstract render(): string

    public static blank(): BlankWindowContent {
        return BlankWindowContent.instance
    }

}

class BlankWindowContent extends WindowContent {
    
    render(): string {
        return ""
    }

    static instance = new BlankWindowContent() 
}