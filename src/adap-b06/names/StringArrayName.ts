import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

/**
 * Represents an immutable name consisting of an array of string components.
 */
export class StringArrayName extends AbstractName {
    private readonly components: readonly string[];

    
    constructor(source: readonly string[], delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(source != null, "source array cannot be null");
        super(delimiter);
        this.components = [...source]; 
    }

    getNoComponents(): number {
        return this.components.length;
    }

    getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, `Index ${i} is out of bounds`);
        return this.components[i];
    }

    
    withComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, `Index ${i} is out of bounds`);
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const next = [...this.components];
        next[i] = c;
        return new StringArrayName(next, this.getDelimiter());
    }

    
    inserted(i: number, c: string): Name {
        IllegalArgumentException.assert(i >= 0 && i <= this.components.length, `Index ${i} is out of bounds`);
        IllegalArgumentException.assert(c != null, "Component cannot be null");

        const next = [...this.components];
        next.splice(i, 0, c);
        return new StringArrayName(next, this.getDelimiter());
    }

    
    appended(c: string): Name {
        IllegalArgumentException.assert(c != null, "Component cannot be null");
        return new StringArrayName([...this.components, c], this.getDelimiter());
    }

    removed(i: number): Name {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, `Index ${i} is out of bounds`);

        const next = [...this.components];
        next.splice(i, 1);
        return new StringArrayName(next, this.getDelimiter());
    }


    concatenated(other: Name): Name {
        IllegalArgumentException.assert(other != null, "Other name cannot be null");
        IllegalArgumentException.assert(this.getDelimiter() === other.getDelimiter(), "Delimiter mismatch");

        const combined: string[] = [...this.components];
        for (let i = 0; i < other.getNoComponents(); i++) {
            combined.push(other.getComponent(i));
        }

        return new StringArrayName(combined, this.getDelimiter());
    }
}

