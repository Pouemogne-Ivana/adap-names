import { Name } from "../names/Name";
import { Directory } from "./Directory";
function precond (condition: boolean, message: string="precondition failed"):void{
    if(!condition) throw new Error(message);}
export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        precond(bn !== null && bn !== undefined, "precondition failed");
        precond(pn !== null && pn !== undefined, "precondition failed");
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        precond(pn !== null && pn !== undefined, "precondition failed");
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        precond(to !== null && to !== undefined, "precondition failed");
        precond(to !== this.parentNode,"precondition failed");
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        precond(this.parentNode !== null && this.parentNode !== undefined, "precondition failed");
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        precond(bn !== null && bn !== undefined, "precondition failed");
        precond(bn.trim().length > 0, "precondition failed");
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        precond(this.parentNode !== null && this.parentNode !== undefined, "precondition failed");
        return this.parentNode;
    }

}
