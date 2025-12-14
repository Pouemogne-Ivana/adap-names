import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    protected constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter != null, "delimiter cannot be null");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be exactly 1 character");
        this.delimiter = delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    private escapeRegExp(ch: string): string {
        return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    public asString(delimiter: string = this.delimiter): string {
        const escapedDelimiter = this.escapeRegExp(delimiter);

        const escape = (s: string) =>
            s.replace(
                new RegExp(`[${ESCAPE_CHARACTER}${escapedDelimiter}]`, "g"),
                ch => ESCAPE_CHARACTER + ch
            );

        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(escape(this.getComponent(i)));
        }
        return parts.join(delimiter);}

    public toString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: unknown): boolean {
    if (this === other) return true;
    if (other == null) return false;

    const o = other as Name;
    if (typeof o.getNoComponents !== "function") return false;

    if (this.delimiter !== o.getDelimiterCharacter()) return false;
    if (this.getNoComponents() !== o.getNoComponents()) return false;

    for (let i = 0; i < this.getNoComponents(); i++) {
        if (this.getComponent(i) !== o.getComponent(i)) {
            return false;
        }
    }
    return true;
    }
    public getDelimiter(): string {
        return this.delimiter;
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }


    public getHashCode(): number {
        let hash = 17;
        hash = hash * 31 + this.delimiter.charCodeAt(0);

        for (let i = 0; i < this.getNoComponents(); i++) {
            const s = this.getComponent(i);
            for (let j = 0; j < s.length; j++) {
                hash = hash * 31 + s.charCodeAt(j);
            }
        }
        return hash | 0;
    }

    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;

    abstract withComponent(i: number, c: string): Name;
    abstract inserted(i: number, c: string): Name;
    abstract appended(c: string): Name;
    abstract removed(i: number): Name;
    abstract concatenated(other: Name): Name;
}