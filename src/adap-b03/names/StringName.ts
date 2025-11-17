import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        this.name = source;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
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
        return this.noComponents===0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }
    public getComponent(i: number): string {
        if (i<0 || i >= this.noComponents) throw new RangeError();
        let echap = false;
        let index= 0;
        let curComp ="";
        for (const char of this.name) {
            if (echap) {
                curComp += char;
                echap =false;
            }else if (char=== this.delimiter) {
                if (index===i) return curComp;
                index++;
                curComp = "";
            } else if (char === ESCAPE_CHARACTER) {
                echap = true;}
            else {
                curComp +=char;
            }
        }
        return curComp;
    }
    private reconstruieren(komponenten: string[]): void {
        if (komponenten.length===0) {
            this.noComponents = 0;
            this.name = "";
            return;
        }
        this.name=komponenten.map(c =>
            c.replace(
                new RegExp(`[${ESCAPE_CHARACTER}${this.delimiter}]`,"g"),
                char => ESCAPE_CHARACTER + char)).join(this.delimiter);
        this.noComponents= komponenten.length;
    }

    public setComponent(i: number, c: string) {
        const komponenten= []; //leer für alle Namen Komponenten
        for (let j =0; j< this.noComponents; j++) {
            komponenten.push(j===i? c : this.getComponent(j));
        }
        this.reconstruieren(komponenten);
    }

    public insert(i: number, c: string) {
        const komponenten = [];
        for (let j = 0; j < this.noComponents; j++) {
            if (j === i) komponenten.push(c);
            komponenten.push(this.getComponent(j));}
        if (i ===this.noComponents) komponenten.push(c);
        this.reconstruieren(komponenten);
    }

    public append(c: string) {
        const komponenten = [];
        for (let k = 0; k <this.noComponents; k++) {
            komponenten.push(this.getComponent(k));}
        komponenten.push(c);
        this.reconstruieren(komponenten);
    }

    public remove(i: number) {
        const komponenten = [];
        for (let l = 0; l < this.noComponents; l++) {
            if (l!== i) komponenten.push(this.getComponent(l));}
        this.reconstruieren(komponenten);
    }

    public concat(other: Name): void {
        const komponenten = [];
        for (let i = 0; i < other.getNoComponents(); i++) {
            komponenten.push(other.getComponent(i));}
        for (let i = 0; i <this.noComponents; i++) {
            komponenten.push(this.getComponent(i));
        }
        this.reconstruieren(komponenten);
    } 
}