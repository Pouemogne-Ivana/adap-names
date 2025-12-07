import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";
export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    private toArray(): string[] {
        const array = [];
        try {
            for (let i = 0; i < this.noComponents; i++) {
                array.push(this.getComponent(i));
            }
        } catch (error) {
            if (error instanceof IllegalArgumentException) {
                throw error;
            }
            throw new ServiceFailureException("Failed to convert name to array");
    }
    return array;
    }
   
    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source!== null, "")
        super(delimiter);
        this.name = source;
        this.noComponents = this.computeNoComponents();
        this.checkInvariant();
    }
    private computeNoComponents(): number {
        if (!this.name.length) return 0;
        let echap = false;
        let count = 1;
        try {
            for (const char of this.name) {
                if (echap) {
                    echap = false;
                    continue;
                }
                if (char === ESCAPE_CHARACTER) {
                    echap = true;
                    continue;
                }
                if (char === this.delimiter) {
                    count++;
                }
            }
        } catch (error) {
            throw new ServiceFailureException("Failed to compute component count");
        }
        return count;
    }

    public clone(): Name {
        try {
            return new StringName(this.name, this.delimiter);
        } catch (error) {
            throw new ServiceFailureException("Failed to clone StringName");}
    }

    public getNoComponents(): number {
        return this.noComponents;
    }
    public getComponent(i: number): string {
        IllegalArgumentException.assert(i>=0 && i<this.noComponents)
        let curComp ="";
        let index= 0;
        let echap = false; 
        try {
            for (const char of this.name) {
                if (echap) {
                   curComp += char;
                    echap = false;
                } else if (char === ESCAPE_CHARACTER) {
                    echap = true;
                } else if (char === this.delimiter) {
                    if (index === i) {
                        return curComp;
                    }
                    index++;
                    curComp = "";
                } else {
                    curComp += char;
                }
            }
        } catch (error) {
            throw new ServiceFailureException(`Failed to retrieve component at index ${i}`);
            }
        return curComp;
    }
    private reconstruieren(komponenten: string[]): void {
        InvalidStateException.assert(komponenten != null)
        if (komponenten.length===0) {
            this.noComponents = 0;
            this.name = "";
            return;
        }
        try {
            this.name = komponenten
                .map(c => {
                    IllegalArgumentException.assert(
                        c != null,
                        "component cannot be null"
                    );
                    IllegalArgumentException.assert(
                        typeof c === "string",
                        "component must be a string"
                    );
                    
                    return c.replace(
                        new RegExp(`[${ESCAPE_CHARACTER}${this.delimiter}]`, "g"),
                        char => ESCAPE_CHARACTER + char
                    );
                })
                .join(this.delimiter);
            
            this.noComponents =komponenten.length;
        } catch (error) {
            if (error instanceof IllegalArgumentException) {
                throw error;
            }
            throw new ServiceFailureException("Failed to reconstruct name from components");
        }
        this.checkInvariant();
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents)
        const before = this.noComponents;
        const komponenten= this.toArray(); 
        komponenten[i]=c;
        this.reconstruieren(komponenten);
        MethodFailedException.assert(this.noComponents === before);
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents);
        const before = this.noComponents;
        const komponenten = this.toArray();
         
        try {
            komponenten.splice(i, 0, c);
        } catch (error) {
            throw new ServiceFailureException(`Failed to insert component at index ${i}`);
        }

        this.reconstruieren(komponenten);
        MethodFailedException.assert(this.noComponents === before+1);
    }

    public append(c: string) {
        const before = this.noComponents;
        const komponenten = this.toArray();
       try {
            komponenten.push(c);
        } catch (error) {
            throw new ServiceFailureException("Failed to append component");
        }
        this.reconstruieren(komponenten);
        MethodFailedException.assert(this.noComponents === before + 1)
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "index out of range");
        const before = this.noComponents;
        const komponenten = this.toArray();
        try {
            komponenten.splice(i, 1);
        } catch (error) {
            throw new ServiceFailureException(`Failed to remove component at index ${i}` );
        }
        this.reconstruieren(komponenten);
        MethodFailedException.assert(this.noComponents === before - 1)
    }

    public concat(other: Name): void {
        IllegalArgumentException.assert(other !== null);
        const before = this.noComponents;
        const komponenten = this.toArray();
        try {
            for (let i = 0; i < other.getNoComponents(); i++) {
                komponenten.push(other.getComponent(i));
            }
        } catch (error) {
            if (error instanceof IllegalArgumentException) {
                throw error;
            }
            throw new ServiceFailureException("Failed to concatenate names");
        }
        this.reconstruieren(komponenten);
        MethodFailedException.assert(
            this.noComponents === before+other.getNoComponents());
        
    } 
    
}