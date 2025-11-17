import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        this.components=[...source];
    }

    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return this.components.length===0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.components[i]=c;
    }

    public insert(i: number, c: string) {
        this.components.splice(i,0,c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        this.components.splice(i,1);
    }

    public concat(other: Name): void {
        for(let i=0; i<other.getNoComponents();i++){this.components.push(other.getComponent(i));}
    }
}