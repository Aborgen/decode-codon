import { AminoAcid, validateAminoAcid } from './AminoAcid.ts';
import { Codon, validateCodon } from './Codon.ts';
import CodonTable from 'data/CodonTable.js';

export default class AminoAcidData {
  private aminoAcidList: AminoAcid[];
  private codonList: Codon[];
  MAX_CODONS = 9999 // Anything more than that looks bad in the superscript index above the codon!

  constructor() {
    this.aminoAcidList = [];
    this.codonList = [];
  }

  pushCodon(codon: Codon) : void {
    if (!validateCodon(codon)) {
      throw `Bad argument passed to method: ${typeof codon}, should be: 'Codon'`;
    }
    else if (this.codonList.length === this.MAX_CODONS) {
      throw `Cannot store any more codons. Max size: ${this.MAX_CODONS}`;
    }

    this.codonList.push(codon);
    this.commitAminoAcid(codon);
  }

  getCodon(i: number) : Codon {
    this.checkIndex(i);
    const codon:Codon = this.codonList[i];
    if (!validateCodon(codon)) {
      throw `codonList has been corrupted! ${codon}@index=${i}`;
    }

    return codon;
  }

  getAllCodons() : Codon[] {
    return this.codonList;
  }

  insertCodon(i: number, codon:Codon) : void {
    this.checkIndex(i);
    if (!validateCodon(codon)) {
      throw `Bad argument passed to method: ${typeof codon}, should be: 'Codon'`;
    }

    this.codonList.splice(i, 0, codon);
    this.insertAminoAcid(i, codon);
  }

  setCodon(i: number, codon:Codon) : void {
    this.checkIndex(i);
    if (!validateCodon(codon)) {
      throw `Bad argument passed to method: ${typeof codon}, should be: 'Codon'`;
    }

    this.codonList.splice(i, 1, codon);
    this.editAminoAcid(i, codon);
  }

  deleteCodon(i: number) : void {
    this.checkIndex(i);
    this.codonList.splice(i, 1);
    this.deleteAminoAcid(i);
  }

  private commitAminoAcid(codon: Codon) : void {
    const aminoAcid = this.translateCodon(codon);
    this.aminoAcidList.push(aminoAcid);
  } 

  getAminoAcid(i: number) : AminoAcid {
    this.checkIndex(i);
    const aminoAcid:AminoAcid = this.aminoAcidList[i];
    if (!validateAminoAcid(aminoAcid)) {
      throw `aminoAcidList has been corrupted! ${aminoAcid}@index=${i}`;
    }

    return aminoAcid;
  }

  getAllAminoAcids() : AminoAcid[] {
    return this.aminoAcidList;
  }

  private insertAminoAcid(i: number, codon: Codon) : void {
    const aminoAcid = this.translateCodon(codon)
    this.aminoAcidList.splice(i, 0, aminoAcid);
  }

  private editAminoAcid(i: number, codon: Codon) : void {
    const aminoAcid = this.translateCodon(codon)
    this.aminoAcidList.splice(i, 1, aminoAcid);
  }

  private deleteAminoAcid(i: number) : void {
    this.aminoAcidList.splice(i, 1);
  }

  private translateCodon(codon: Codon) : AminoAcid {
    const table = CodonTable[3];
    if (!table)  {
      throw 'CodonTable is broken';
    }

    // Not sure what the compiler wants from me here
    // @ts-ignore
    const aminoAcids:AminoAcid = table[codon];
    if (!Array.isArray(aminoAcids) || aminoAcids.length !== 1) {
      throw "CodonTable is broken";
    }

    const aminoAcid = aminoAcids[0];
    if (!validateAminoAcid(aminoAcid)) {
      throw `Amino acid corresponding with ${codon} does not exist`;
    }

    return aminoAcid;
  }

  clearLists() : void {
    this.aminoAcidList = [];
    this.codonList = [];
  }

  length() : number {
    return this.aminoAcidList.length;
  }

  private checkIndex(i: number): void {
    if (Number.isNaN(i) || i < 0 || i > this.codonList.length - 1) {
      throw new RangeError(`Index ${i} is out of bounds [length=${this.codonList.length}]`);
    }
  }
}
