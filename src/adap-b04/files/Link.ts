import { Node } from "./Node";
import { Directory } from "./Directory";
function precond (condition: boolean, message: string="precondition failed"):void{
    if(!condition) throw new Error(message);}
export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            precond(tn !== null, "Target node cannot be null");
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        precond(target !== null && target !== undefined, "precondition failed");
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        const target = this.ensureTargetNode(this.targetNode);
        precond(bn !== null && bn !== undefined, "precondition failed");
        precond(bn.trim().length > 0, "precondition failed");

        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        precond(this.targetNode !== null, "Target node is not set");
        const result: Node = this.targetNode as Node;
        return result;
    }
}