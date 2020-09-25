import { AminoAcid, validateAminoAcid } from './AminoAcid.ts';
import { Codon, validateCodon } from './Codon.ts';
import CodonTable from 'data/CodonTable';

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

  insertCodon(i: number, codon:Codon) : void {
    if (!validateCodon(codon)) {
      throw `Bad argument passed to method: ${typeof codon}, should be: 'Codon'`;
    }

    this.codonList.splice(i, 0, codon);
    this.insertAminoAcid(i, codon);
  }

  setCodon(i: number, codon:Codon) : void {
    if (!validateCodon(codon)) {
      throw `Bad argument passed to method: ${typeof codon}, should be: 'Codon'`;
    }

    this.codonList.splice(i, 1, codon);
    this.editAminoAcid(i, codon);
  }

  deleteCodon(i: number) : void {
    if (i < 0 || i > this.codonList.length) {
      throw `Index ${i} is out of bounds of codonList[length=${this.codonList.length}]`
    }

    this.codonList.splice(i, 1);
    this.deleteAminoAcid(i);
  }

  private commitAminoAcid(codon: Codon) : void {
    const aminoAcid = this.translateCodon(codon);
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

  private insertAminoAcid(i: number, codon: Codon) : void {
    const aminoAcid = this.translateCodon(codon)
    this.aminoAcidList.splice(i, 0, aminoAcid);
  }

  private editAminoAcid(i: number, codon: Codon) : void {
    const aminoAcid = this.translateCodon(codon)
    this.aminoAcidList.splice(i, 1, aminoAcid);
  }

  private deleteAminoAcid(i: number) : void {
    if (i < 0 || i > this.aminoAcidList.length) {
      throw `Index ${i} is out of bounds of aminoAcidList[length=${this.aminoAcidList.length}]`
    }

    this.aminoAcidList.splice(i, 1);
  }

  private translateCodon(codon: Codon) : AminoAcid {
    const table = CodonTable[3];
    if (!table) {
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
}
