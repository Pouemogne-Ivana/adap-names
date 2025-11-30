import { Node } from "./Node";
function precond (condition: boolean, message: string="precondition failed"):void{
    if(!condition) throw new Error(message);}

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        precond(bn !== null && bn !== undefined,"precondition failed");
        precond(bn.trim().length > 0, "precondition failed");
        precond(pn !== null && pn !== undefined, "precondition failed");
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        precond(cn !== null && cn !== undefined, "precondition failed");
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        precond(cn !== null && cn !== undefined, "precondition failed");
        precond(!this.childNodes.has(cn), "precondition failed");
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        precond(cn !== null && cn !== undefined, "precondition failed");
        precond(this.childNodes.has(cn), "precondition failed");
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}