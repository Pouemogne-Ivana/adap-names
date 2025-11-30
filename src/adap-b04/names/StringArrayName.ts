import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components=[...source];
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i>=0 && i<this.getNoComponents())
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(i>=0 && i<this.getNoComponents())
        this.components[i]=c;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(i>=0 && i<=this.getNoComponents())
        this.components.splice(i,0,c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i>=0 && i<this.getNoComponents())
        this.components.splice(i,1);
    }
}