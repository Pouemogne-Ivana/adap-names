import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ServiceFailureException } from "../common/ServiceFailureException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(source != null, "source array cannot be null");
        super(delimiter);

        try {
            this.components = [...source];
        } catch (Exception) {
            throw new ServiceFailureException("Failed to initialize name components");
        }

        this.checkInvariant();
        
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(),
            `index ${i} out of bounds`);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
       IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(),
                `index ${i} out of bounds`);
        IllegalArgumentException.assert(c != null, "component cannot be null");

        try {
            this.components[i] = c;
        } catch (e) {
            throw new ServiceFailureException(`Failed to set component at index ${i}`);
        }

        this.checkInvariant();
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), `index ${i} out of bounds`);
        IllegalArgumentException.assert(c != null, "component cannot be null");

        try {
            this.components.splice(i, 0, c);
        } catch (e) {
            throw new ServiceFailureException(`Failed to insert component at index ${i}`);
        }

        this.checkInvariant();
    }

    public append(c: string) {
        IllegalArgumentException.assert(c != null, "component cannot be null");

        const before = this.getNoComponents();
        try {
            this.components.push(c);
        } catch (e) {
            throw new ServiceFailureException("Failed to append component");
        }
        IllegalArgumentException.assert(
            this.getNoComponents() === before + 1, "append did not add a new component"
        );

        this.checkInvariant();
    }

    public remove(i: number) {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(),`index ${i} out of bounds`);

        const before = this.getNoComponents();
        try {
            this.components.splice(i, 1);
        } catch (e) {
            throw new ServiceFailureException(`Failed to remove component at index ${i}`);
        }

        IllegalArgumentException.assert(
            this.getNoComponents() === before - 1,"remove did not remove exactly one component"
        );

        this.checkInvariant();
    }
}