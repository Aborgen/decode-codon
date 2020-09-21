import { AminoAcid, validateAminoAcid } from './AminoAcid.ts';
import { Codon, validateCodon } from './Codon.ts';
import CodonTable from 'data/CodonTable.ts';

export default class AminoAcidData {
  private aminoAcidList: AminoAcid[];
  private codonList: Codon[];

  constructor() {
    this.aminoAcidList = [];
    this.codonList = [];
  }

  pushCodon(codon: Codon) : void {
    if (!validateCodon(codon)) {
      throw `Bad argument passed to method: ${typeof codon}, should be: 'Codon'`;
    }

    this.codonList.push(codon);
    this.commitAminoAcid(codon);
  }

  getCodon(i: number) : Codon {
    const codon:Codon = this.codonList[i];
    if (!validateCodon(codon)) {
      throw `Codon does not exist at index ${i}: Length === ${this.codonList.length}`;
    }

    return codon;
  }

  getAllCodons() : Codon[] {
    return this.codonList;
  }

  setCodon(i: number, codon:Codon) : void {
    if (!validateCodon(codon)) {
      throw `Bad argument passed to method: ${typeof codon}, should be: 'Codon'`;
    }

    this.codonList.splice(i, 1, codon);
    this.editAminoAcid(i, codon);
  }

  // TODO: What did I do here, again?
  private commitAminoAcid(codon: Codon) : void {
//    const aminoAcid:AminoAcid = CodonTable[3][codon][0] as AminoAcid;
    const foo = CodonTable[3];
    if (typeof foo !== 'object') {
      throw "CodonTable is broken";
    }

    const bar:string[] = foo[String(codon)];
    if (!Array.isArray(bar)) {
      throw "CodonTable is broken";
    }

    const aminoAcid:AminoAcid = bar[0];
    if (!validateAminoAcid(aminoAcid)) {
      throw `Amino acid corresponding with ${codon} does not exist`;
    }

    this.aminoAcidList.push(aminoAcid);
  } 

  getAminoAcid(i: number) : AminoAcid {
    const aminoAcid:AminoAcid = this.aminoAcidList[i];
    if (!validateAminoAcid(aminoAcid)) {
      throw `Amino acid does not exist at index ${i}: ${this.aminoAcidList.length}`;
    }

    return aminoAcid;
  }

  getAllAminoAcids() : AminoAcid[] {
    return this.aminoAcidList;
  }

  private editAminoAcid(i: number, codon: Codon) : void {
    const table = CodonTable[3];
    if (!table) {
      throw 'CodonTable is broken';
    }

    const aminoAcids:AminoAcid = table[codon as string];
    if (!Array.isArray(aminoAcids) || aminoAcids.length !== 1) {
      throw "CodonTable is broken";
    }

    const aminoAcid = aminoAcids[0];
    if (!validateAminoAcid(aminoAcid)) {
      throw `Amino acid corresponding with ${codon} does not exist`;
    }

    this.aminoAcidList.splice(i, 1, aminoAcid);
  }

  clearLists() : void {
    this.aminoAcidList = [];
    this.codonList = [];
  }
}
