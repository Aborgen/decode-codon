import { mount } from '@vue/test-utils';
import App from 'src/App.vue';
import AminoAcidData from 'types/AminoAcidData';

describe('There are \'CRUD\' type actions which are passed to children as props: ', () => {
  let wrapper = mount(App);
  beforeEach(() => {
    wrapper = mount(App);
    wrapper.vm.pushCodon('AUG');
    wrapper.vm.pushCodon('UUU');
    wrapper.vm.pushCodon('UAG');
  });

  test('pushCodon pushes a codon when editMode is false', () => {
    wrapper.vm.pushCodon('AAA');
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual(['AUG', 'UUU', 'UAG', 'AAA']);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual(['Met', 'Phe', 'Stop', 'Lys']);
  });

  test('pushCodon inserts a codon at selectedAminoAcid when editMode is false and selectedAminoAcid is not null', () => {
    wrapper.vm.selectedAminoAcid = 1;
    wrapper.vm.pushCodon('GAC');
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual(['AUG', 'GAC', 'UUU', 'UAG']);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual(['Met', 'Asp', 'Phe', 'Stop']);
  });

  test('pushCodon throws when editMode is true', () => {
    wrapper.vm.editMode = true;
    const result = () => wrapper.vm.pushCodon('AAA');
    expect(result).toThrow();
  });

  test('editCodon edits an existing codon found at selectedAminoAcid when editMode is true selectedAminoAcid is not null', () => {
    wrapper.vm.editMode = true;
    wrapper.vm.selectedAminoAcid = 1;
    wrapper.vm.editCodon('GAC');
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual(['AUG', 'GAC', 'UAG']);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual(['Met', 'Asp', 'Stop']);
  });

  test('editCodon throws when editMode is false and selectedAminoAcid is not null', () => {
    wrapper.vm.selectedAminoAcid = 1;
    const result = () => wrapper.vm.editCodon('AAA');
    expect(result).toThrow();
  });

  test('editCodon throws when editMode is true and selectedAminoAcid is null', () => {
    wrapper.vm.editMode = true;
    const result = () => wrapper.vm.editCodon('AAA');
    expect(result).toThrow();
  });

  test('deleteCodon deletes an existing codon found at selectedAminoAcid when selectedAminoAcid is not null', () => {
    wrapper.vm.selectedAminoAcid = 1;
    wrapper.vm.deleteCodon();
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual(['AUG', 'UAG']);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual(['Met', 'Stop']);
    expect(wrapper.vm.selectedAminoAcid).toBeNull();
  });

  test('deleteCodon throws when selectedAminoAcid is null', () => {
    const result = () => wrapper.vm.deleteCodon();
    expect(result).toThrow();
  });

  test('clearAminoAcidData clears the contents of aminoAcidData (2 string[])', () => {
    wrapper.vm.clearAminoAcidData();
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual([]);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual([]);
  });

  test('selectAminoAcid assigns [0, n-1] inclusive, where n is number of codons within aminoAcidData, to selectedAminoAcid data field', () => {
    wrapper.vm.selectAminoAcid(0);
    expect(wrapper.vm['selectedAminoAcid']).toBe(0);
  });

  test.each([-1, 5000])('selectAminoAcid throws when index is out of bounds: [0, n-1] inclusive, where n is number of codons within aminoAcidData', (i) => {
    const result = () => wwrapper.vm.selectAminoAcid(i);
    expect(result).toThrow();
  });

  test('deselectAminoAcid assigns null to selectedAminoAcid data field', () => {
    wrapper.vm.deselectAminoAcid();
    expect(wrapper.vm['selectedAminoAcid']).toBeNull();
  });

  test.each([false, true])('toggleEditMode negates the boolean value of editMode', (editMode) => {
    wrapper.vm.editMode = editMode;
    wrapper.vm.toggleEditMode();
    expect(wrapper.vm['editMode']).toBe(!editMode);
  });
});
