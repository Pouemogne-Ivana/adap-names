import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.computeNoComponents();
    }
    private computeNoComponents(): number {
        let echap = false;
        let count = 1;
        if (!this.name.length) return 0;

        for (const char of this.name) {
            if (echap) {
                echap = false;
                continue;
            }
            if (char===ESCAPE_CHARACTER) {
                echap = true;
                continue;
            }
            if (char===this.delimiter) count++;
        }
        return count;
    }

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        return this.noComponents;
    }
    public getComponent(i: number): string {
        if (i<0||i>= this.noComponents) throw new RangeError();
        let curComp ="";
        let index= 0;
        let echap = false; 
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
                char => ESCAPE_CHARACTER +char)).join(this.delimiter);
        this.noComponents= komponenten.length;
    }

    public setComponent(i: number, c: string) {
        const komponenten= this.toArray(); 
        komponenten[i]=c;
        this.reconstruieren(komponenten);
    }

    public insert(i: number, c: string) {
        const komponenten = this.toArray();
        komponenten.splice(i,0,c);
        this.reconstruieren(komponenten);
    }

    public append(c: string) {
        const komponenten = this.toArray();
        komponenten.push(c);
        this.reconstruieren(komponenten);
    }

    public remove(i: number) {
        const komponenten = this.toArray();
        komponenten.splice(i,1);
        this.reconstruieren(komponenten);
    }

    public concat(other: Name): void {
        const komponenten = this.toArray();
        for (let i = 0; i < other.getNoComponents(); i++) {
            komponenten.push(other.getComponent(i));}
        this.reconstruieren(komponenten);
    } 
    private toArray(): string[] {
    const array = [];
    for (let i = 0; i< this.noComponents; i++) {
        array.push(this.getComponent(i));
    }
    return array;
}   
 

}