export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    //@methodtype constructor
    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        this.delimiter = delimiter;
        if(typeof other=="string"){
            this,components= this.parseDataString(other);
        }else {this.components=[...other];}
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    //@methodtype get-method
    public asString(delimiter: string = this.delimiter): string {
       return this,components.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    //@methodtype get-method
    public asDataString(): string {
        return this.components.map(c=>this.escapeComponent(c)).join(DEFAULT_DELIMITER);
    }

    //@methodtype get-method
    /** Returns properly masked component string */
    
    public getComponent(i: number): string {
        if (i<0 || i>= this.components.length)
            throw new Error("index not valable");
        return this.components[i];
    }

    //@methodtype set-method
    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
         if (i<0 || i>= this.components.length)
            throw new Error("index not valid");
         this.components[i] = c;
    }
     //@methodtype get-method
     /** Returns number of components in Name instance */
     public getNoComponents(): number {
         return this.components.length;
    }
    //@methodtype insert-method
    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        if (i <0 || i> this.components.length)
            throw new Error("Index invalid");
        this.components.splice(i, 0, c);
    }
    // @methodtype append-method
    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        this.components.push(c);
    }
    //@methodtype remove-method
    public remove(i: number): void {
       if (i < 0 || i >= this.components.length)
            throw new Error("invalid Index");
        this.components.splice(i, 1);
    }

}
