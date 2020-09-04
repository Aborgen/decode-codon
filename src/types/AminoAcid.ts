import AminoAcidKey from 'data/AminoAcidKey.ts';

//type AminoAcid = string & { __aminoAcid: true };
type AminoAcid = string;
function validateAminoAcid(s: string) : s is AminoAcid {
  return typeof s === 'string' && s in AminoAcidKey;
}

export {
  AminoAcid,
  validateAminoAcid
};
