export default class NumberRange implements Iterable<number> {

    constructor(
        public start: number,
        public end: number,
    ) { }

    [Symbol.iterator](): Iterator<number, any, undefined> {
        let current = this.start;
        return {
            next: () => {
                if (current <= this.end) {
                    return { done: false, value: current++ };
                } else {
                    return { done: true, value: undefined };
                }
            }
        };
    }

    public contains(value: number): boolean {
        return value >= this.start && value <= this.end;
    }

    public forEach(callback: (value: number) => void): void {
        for (let value of this) {
            callback(value);
        }
    }

    public get(index: number, overflow: NumberOverflowBehavior = NumberOverflowBehavior.ERROR): number {
        if (overflow === NumberOverflowBehavior.ERROR && (index < 0 || index >= this.length)) {
            throw new Error(`Index ${index} out of range ${this.start}..${this.end} with size ${this.length}`);
        }

        let value = this.start + index;

        if (overflow === NumberOverflowBehavior.WRAP) {
            value = this.start + ((index % this.length) + this.length) % this.length;
        } else if (overflow === NumberOverflowBehavior.CLAMP) {
            value = Math.max(this.start, Math.min(this.end, value));
        }


        return value;
    }

    public get length(): number {
        return this.end - this.start + 1;
    }

    public get random(): number {
        return Math.floor(Math.random() * this.length) + this.start;
    }

    public get randomFloat(): number {
        return Math.random() * this.length + this.start;
    }

    public get randomInt(): number {
        return Math.floor(this.randomFloat);
    }

}

export enum NumberOverflowBehavior {

    /**
     * Throws the typical number overflow exception
     */
    ERROR,

    /**
     * Wraps the number around and continues counting from the other end
     */
    WRAP,

    /**
     * Clamps the number to the maximum or minimum value
     */
    CLAMP,

}