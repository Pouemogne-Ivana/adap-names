import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};
function precond (condition: boolean, message: string="precondition failed"):void{
    if(!condition) throw new Error(message);}
export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }
    public delete(): void {
        precond(this.state !== FileState.DELETED, "file does not exist");

        this.state = FileState.DELETED;}

    public open(): void {
        // do something
    }

    public read(noBytes: number): Int8Array {        
        precond(this.state === FileState.OPEN, "precondition failed");
        precond(noBytes > 0, "Number of bytes to read must be positive");
        // read something
        return new Int8Array();
    }

    public close(): void {
        precond(this.state === FileState.OPEN, "the file is not open");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}