import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter= delimiter;
    }

    public clone(): Name {
        const Klone= Object.create(Object.getPrototypeOf(this)) as AbstractName;
        Klone.delimiter =this.delimiter;
        for(let i=0; i<this.getNoComponents(); i++){Klone.append(this.getComponent(i));}
        return Klone;
    }

    public asString(delimiter: string = this.delimiter): string {
        const escape = (s: string) =>
            s.replace(new RegExp(`[${ESCAPE_CHARACTER}${delimiter}]`, "g"),
                      ch => ESCAPE_CHARACTER + ch);
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(escape(this.getComponent(i)));
        }
        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) return false;
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        const str = this.asDataString();
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) | 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents()==0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for(let i=0;i<other.getNoComponents();i++){this.append(other.getComponent(i));}
    }

}