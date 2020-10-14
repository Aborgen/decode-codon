import AminoAcidData from 'types/AminoAcidData';

describe('Test CRUD operations', () => {
  test('pushCodon pushes codon, as well as its corresponding aminoAcid', () => {
    const aminoAcidData = generateAminoAcidData();
    aminoAcidData.pushCodon('UUU');
    const codons = aminoAcidData.getAllCodons();
    const aminoAcids = aminoAcidData.getAllAminoAcids();
    expect(codons).toStrictEqual(['AUG', 'UAG', 'UUU']);
    expect(aminoAcids).toStrictEqual(['Met', 'Stop', 'Phe']);
  });

  test('pushCodon throws if input is invalid', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.pushCodon('ZZZ');
    expect(result).toThrow();
  });

  test('insertCodon inserts codon at ith index, and does the same with its corresponding aminoAcid', () => {
    const aminoAcidData = generateAminoAcidData();
    aminoAcidData.insertCodon(0, 'UUU');
    const codons = aminoAcidData.getAllCodons();
    const aminoAcids = aminoAcidData.getAllAminoAcids();
    expect(codons).toStrictEqual(['UUU', 'AUG', 'UAG']);
    expect(aminoAcids).toStrictEqual(['Phe', 'Met', 'Stop']);
  });

  test('insertCodon throws if input is invalid', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.insertCodon(0, 'ZZZ');
    expect(result).toThrow();
  });

  test('insertCodon throws if index is out of range', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.insertCodon(-1, 'UUU');
    expect(result).toThrow();
  });

  test('getCodon gets codon at ith index', () => {
    const aminoAcidData = generateAminoAcidData();
    const codon = aminoAcidData.getCodon(0);
    expect(codon).toBe('AUG');
  });

  test('getCodon throws if index is not a number', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.getCodon('ZZZ');
    expect(result).toThrow();
  });

  test('getCodon throws if index is out of range', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.getCodon(-1);
    expect(result).toThrow();
  });

  test('getAllCodons gets all codons', () => {
    const aminoAcidData = generateAminoAcidData();
    const codons = aminoAcidData.getAllCodons();
    expect(codons).toStrictEqual(['AUG', 'UAG']);
  });

  test('getAminoAcid gets aminoAcid at ith index', () => {
    const aminoAcidData = generateAminoAcidData();
    const aminoAcid = aminoAcidData.getAminoAcid(0);
    expect(aminoAcid).toBe('Met');
  });

  test('getAminoAcid throws if index is not a number', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.getAminoAcid('ZZZ');
    expect(result).toThrow();
  });

  test('getAminoAcid throws if index is out of range', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.getAminoAcid(-1);
    expect(result).toThrow();
  });

  test('getAllAminoAcids gets all aminoAcids', () => {
    const aminoAcidData = generateAminoAcidData();
    const aminoAcids = aminoAcidData.getAllAminoAcids();
    expect(aminoAcids).toStrictEqual(['Met', 'Stop']);
  });

  test('setCodon updates codon and aminoAcid at ith index', () => {
    const aminoAcidData = generateAminoAcidData();
    aminoAcidData.setCodon(0, 'UUU');
    const codons = aminoAcidData.getAllCodons();
    const aminoAcids = aminoAcidData.getAllAminoAcids();
    expect(codons).toStrictEqual(['UUU', 'UAG']);
    expect(aminoAcids).toStrictEqual(['Phe', 'Stop']);
  });

  test('setCodon throws if input is invalid', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.setCodon(0, 'ZZZ');
    expect(result).toThrow();
  });

  test('setCodon throws if index is out of range', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.setCodon(-1, 'UUU');
    expect(result).toThrow();
  });
  
  test('deleteCodon deletes codon and aminoAcid at ith index', () => {
    const aminoAcidData = generateAminoAcidData();
    aminoAcidData.deleteCodon(0);
    const codons = aminoAcidData.getAllCodons();
    const aminoAcids = aminoAcidData.getAllAminoAcids();
    expect(codons).toStrictEqual(['UAG']);
    expect(aminoAcids).toStrictEqual(['Stop']);
  });

  test('deleteCodon throws if index is not a number', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.getCodon('ZZZ');
    expect(result).toThrow();
  });

  test('deleteCodon throws if index is out of range', () => {
    const aminoAcidData = generateAminoAcidData();
    const result = () => aminoAcidData.deleteCodon(-1);
    expect(result).toThrow();
  });

});

describe('Test other methods', () => {
  test('length returns length of internal data structures', () => {
    const aminoAcidData = generateAminoAcidData();
    const length = aminoAcidData.length();
    expect(length).toEqual(2);
  });

  test('clearLists empties internal data structures', () => {
    const aminoAcidData = generateAminoAcidData();
    aminoAcidData.clearLists();
    expect(aminoAcidData.getAllAminoAcids()).toStrictEqual([]);
    expect(aminoAcidData.getAllCodons()).toStrictEqual([]);
  });
});

function generateAminoAcidData() {
  const aminoAcidData = new AminoAcidData();
  aminoAcidData.pushCodon('AUG');
  aminoAcidData.pushCodon('UAG');
  return aminoAcidData;
}
