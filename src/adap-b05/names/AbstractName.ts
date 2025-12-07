import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";


export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter != null, "delimiter cannot be null");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be exactly 1 character");
        this.delimiter= delimiter;
        this.checkInvariant();
    }
    protected checkInvariant(): void {
        InvalidStateException.assert(
            typeof this.delimiter === "string" && this.delimiter.length === 1);
        InvalidStateException.assert(
            this.getNoComponents() >= 0);
    }

    public clone(): Name {
        const initialCount = this.getNoComponents();
        try {
            const Klone = Object.create(Object.getPrototypeOf(this)) as AbstractName;
            Klone.delimiter = this.delimiter;
            
            for (let i = 0; i < this.getNoComponents(); i++) {
                Klone.append(this.getComponent(i));
            }
            
            Klone.checkInvariant();
            MethodFailedException.assert(
                Klone.getNoComponents() === initialCount,"clone component count mismatch");
            
            return Klone;
        } catch (error) {
            if (error instanceof TypeError || error instanceof ReferenceError) {
                throw new ServiceFailureException(`Failed to clone object due to system error: ${error.message}`);
            }
            throw error;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
       try {
            const escape = (s: string) =>
                s.replace(new RegExp(`[${ESCAPE_CHARACTER}${delimiter}]`, "g"),
                          ch => ESCAPE_CHARACTER + ch);
            
            const parts: string[] = [];
            for (let i = 0; i < this.getNoComponents(); i++) {
                parts.push(escape(this.getComponent(i)));
            }
            
            const result = parts.join(delimiter);
            
            MethodFailedException.assert(
                typeof result === "string",
                "result is not a string");
            
            return result;
        } catch (error) {
            if (error instanceof TypeError || error instanceof RangeError) {
                throw new ServiceFailureException(`String operation failed due to system error: ${error.message}`);
            }
            throw error;
        }
    }

    public toString(): string {
        try {
            return this.asDataString();
        } catch (error) {
            if (error instanceof ServiceFailureException) {
                throw error;
            }
            throw new ServiceFailureException(
                `toString conversion failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other!= null, "other cannot be null");
        try {
            if (this.getNoComponents() !== other.getNoComponents()) {
                return false;
            }
            
            for (let i = 0; i < this.getNoComponents(); i++) {
                if (this.getComponent(i) !== other.getComponent(i)) {
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            if (error instanceof TypeError || error instanceof ReferenceError) {
                throw new ServiceFailureException(
                    `Comparison failed due to system error: ${error.message}`);
            }
            throw error;
        }
    }

    public getHashCode(): number {
       try {
            const str = this.asDataString();
            let hash = 0;
            
            for (let i = 0; i < str.length; i++) {
                hash = (hash * 31 + str.charCodeAt(i)) | 0;
            }
            
            MethodFailedException.assert(
                typeof hash === "number" && !isNaN(hash),"hash calculation produced invalid result");
            
            return hash;
        } catch (error) {
            if (error instanceof TypeError || error instanceof RangeError) {
                throw new ServiceFailureException(`Hash calculation failed due to system error: ${error.message}`);
            }
            throw error;
        }
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
        IllegalArgumentException.assert(other!= null, "other cannot be null");
        const before = this.getNoComponents();
         try {
            for (let i = 0; i < other.getNoComponents(); i++) {
                this.append(other.getComponent(i));
            }
            
            MethodFailedException.assert(
                this.getNoComponents() === before + other.getNoComponents(),"concat did not append correct number of components");
            
            this.checkInvariant();
        } catch (error) {
            if (error instanceof RangeError || 
                (error instanceof TypeError && error.message.includes("memory"))) {
                throw new ServiceFailureException(`Concatenation failed due to system resource error: ${error.message}`);
            }
            throw error;}
    }
}