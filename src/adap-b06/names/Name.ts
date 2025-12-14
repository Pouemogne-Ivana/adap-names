import { Equality } from "../common/Equality";
import { Printable } from "../common/Printable";
export interface Name extends Equality, Printable {
    isEmpty(): boolean;
    getNoComponents(): number;
    getComponent(i: number): string;
    getDelimiter(): string;
    inserted(i: number, c: string): Name;
    appended(c: string): Name;
    removed(i: number): Name;
    concatenated(other: Name): Name;
    withComponent(i: number, c: string): Name;
}
