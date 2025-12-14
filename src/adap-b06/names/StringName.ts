import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source !== null, "source cannot be null");
        super(delimiter);
        this.name = source;
        this.noComponents = this.computeNoComponents();
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    private computeNoComponents(): number {
        if (!this.name.length) return 0;
        let escaped = false;
        let count = 1;

        try {
            for (const char of this.name) {
                if (escaped) {
                    escaped = false;
                    continue;
                }
                if (char === ESCAPE_CHARACTER) {
                    escaped = true;
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

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Component index out of range");

        let curComp = "";
        let index = 0;
        let escaped = false;

        try {
            for (const char of this.name) {
                if (escaped) {
                    curComp += char;
                    escaped = false;
                } else if (char === ESCAPE_CHARACTER) {
                    escaped = true;
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
            
            if (index === i) {
                return curComp;
            }
        } catch (error) {
            throw new ServiceFailureException(`Failed to retrieve component at index ${i}`);
        }
        throw new ServiceFailureException(`Internal error: Could not find component ${i}`);
    }
    private toArray(): string[] {
        const array: string[] = [];
        for (let i = 0; i < this.noComponents; i++) {
            array.push(this.getComponent(i));
        }
        return array;
    }
    private reconstruct(components: string[]): string {
        IllegalArgumentException.assert(components !== null);
        
        try {
            return components
                .map(c => {
                    IllegalArgumentException.assert(c !== null && typeof c === "string", "Component cannot be null or non-string");
                    return c.replace(
                        new RegExp(`[${ESCAPE_CHARACTER}${this.delimiter}]`, "g"),
                        char => ESCAPE_CHARACTER + char
                    );
                })
                .join(this.delimiter);
        } catch (error) {
            if (error instanceof IllegalArgumentException) {
                throw error;
            }
            throw new ServiceFailureException("Failed to reconstruct name from components");
        }
    }

    public withComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of range for replacement");
        
        const newComponents = this.toArray();
        newComponents[i] = c;
        
        const newNameString = this.reconstruct(newComponents);
        return new StringName(newNameString, this.delimiter);
    }

    public inserted(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "Index out of range for insertion");
        
        const newComponents = this.toArray();
        newComponents.splice(i, 0, c);
        
        const newNameString = this.reconstruct(newComponents);

        return new StringName(newNameString, this.delimiter);
    }

    public appended(c: string): Name {
        const newComponents = this.toArray();
        newComponents.push(c);
        
        const newNameString = this.reconstruct(newComponents);
        return new StringName(newNameString, this.delimiter);
    }

    public removed(i: number): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Index out of range for removal");
        
        const newComponents = this.toArray();
        newComponents.splice(i, 1);
        
        const newNameString = this.reconstruct(newComponents);
        return new StringName(newNameString, this.delimiter);
    }

    public concatenated(other: Name): Name {
        IllegalArgumentException.assert(other !== null, "Other name cannot be null");
        
        const newComponents = this.toArray();
        
        for (let i = 0; i < other.getNoComponents(); i++) {
            newComponents.push(other.getComponent(i));
        }

        const newNameString = this.reconstruct(newComponents);
        return new StringName(newNameString, this.delimiter);
    }
    public clone(): Name {

        return new StringName(this.name, this.delimiter);
    }

}