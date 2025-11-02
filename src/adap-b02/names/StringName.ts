import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.delimiter =delimiter?? DEFAULT_DELIMITER;
        this.name= source?? "";
        this.noComponents= this.name? this.name.split(this.delimiter).length:0;
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter===this.delimiter) {
            return this.name;
        }
        return this.name.split(this.delimiter).join(delimiter);
    }

    public asDataString(): string {
        return this.name.replaceAll(this.delimiter, ESCAPE_CHARACTER+ this.delimiter
        );
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name.length ===0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const teile= this.name.split(this.delimiter)
        return teile[x] ;
    }

    public setComponent(n: number, c: string): void {
        const teile= this.name.split(this.delimiter); 
        teile[n]=c;
        this.name= teile.join(this.delimiter);
        this.noComponents= teile.length;
    }

    public insert(n: number, c: string): void {
        const teile =this.name.split(this.delimiter);
        teile.splice(n,0,c);
        this.name= teile.join(this.delimiter)
        this.noComponents= teile.length
    }

    public append(c: string): void {
        if(this.isEmpty()){this.name=c;}
        else{this.name+= this.delimiter+c;} 
        this.noComponents++;
    }

    public remove(n: number): void {
        const teile= this.name.split(this.delimiter);
        teile.splice(n,1);
        this.name= teile.join(this.delimiter);
        this.noComponents= teile.length;
    }

    public concat(other: Name): void {
        const andereTeile=[];
        for(let i=0; i<other.getNoComponents(); i++){
            andereTeile.push(other.getComponent(i));
        }
        const andereString= andereTeile.join(this.delimiter);
        if (this.isEmpty()){this.name=andereString;}
        else{this.name+=this.delimiter+andereString;}
        this.noComponents+= andereTeile.length;
    }

}