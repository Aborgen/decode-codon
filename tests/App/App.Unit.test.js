import { initWrapperGenerator } from 'tests/utils.js'; 
import App from 'src/App'; 
import AminoAcidData from 'types/AminoAcidData';
 
const props = {};
const { mountWrapper } = initWrapperGenerator(App, props);
describe('There are \'CRUD\' type actions which are passed to children as props: ', () => {
  test('pushCodon pushes a codon when editMode is false', () => {
    const wrapper = mountWrapper();
    wrapper.vm.pushCodon('AAA');
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual(['AAA']);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual(['Lys']);
  });

  test('pushCodon inserts a codon at selectedAminoAcid when editMode is false and selectedAminoAcid is not null', () => {
    const wrapper = prepopulate(mountWrapper());
    wrapper.vm.selectedAminoAcid = 1;

    wrapper.vm.pushCodon('GAC');
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual(['AUG', 'GAC', 'UUU', 'UAG']);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual(['Met', 'Asp', 'Phe', 'Stop']);
  });

  test('pushCodon throws when editMode is true', () => {
    const wrapper = mountWrapper();
    const result = () => wrapper.vm.pushCodon('AAA');
    wrapper.vm.editMode = true;
    expect(result).toThrow();
  });

  test('editCodon edits an existing codon found at selectedAminoAcid when editMode is true selectedAminoAcid is not null', () => {
    const wrapper = prepopulate(mountWrapper());
    wrapper.vm.editMode = true;
    wrapper.vm.selectedAminoAcid = 1;

    wrapper.vm.editCodon('GAC');
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual(['AUG', 'GAC', 'UAG']);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual(['Met', 'Asp', 'Stop']);
  });

  test('editCodon throws when editMode is false and selectedAminoAcid is not null', () => {
    const wrapper = mountWrapper();
    const result = () => wrapper.vm.editCodon('AAA');
    wrapper.vm.selectedAminoAcid = 1;
    expect(result).toThrow();
  });

  test('editCodon throws when editMode is true and selectedAminoAcid is null', () => {
    const wrapper = mountWrapper();
    const result = () => wrapper.vm.editCodon('AAA');
    wrapper.vm.editMode = true;
    expect(result).toThrow();
  });

  test('deleteCodon deletes an existing codon found at selectedAminoAcid when selectedAminoAcid is not null', () => {
    const wrapper = prepopulate(mountWrapper());
    wrapper.vm.selectedAminoAcid = 1;

    wrapper.vm.deleteCodon();
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual(['AUG', 'UAG']);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual(['Met', 'Stop']);
    expect(wrapper.vm.selectedAminoAcid).toBeNull();
  });

  test('deleteCodon throws when selectedAminoAcid is null', () => {
    const wrapper = mountWrapper();
    const result = () => wrapper.vm.deleteCodon();
    expect(wrapper.vm.selectedAminoAcid).toBeNull();
    expect(result).toThrow();
  });

  test('clearAminoAcidData clears the contents of aminoAcidData (2 string[])', () => {
    const wrapper = prepopulate(mountWrapper());
    wrapper.vm.clearAminoAcidData();
    expect(wrapper.vm['aminoAcidData'].getAllCodons()).toStrictEqual([]);
    expect(wrapper.vm['aminoAcidData'].getAllAminoAcids()).toStrictEqual([]);
  });

  test('selectAminoAcid assigns [0, n-1] inclusive, where n is number of codons within aminoAcidData, to selectedAminoAcid data field', () => {
    const wrapper = prepopulate(mountWrapper());
    wrapper.vm.selectAminoAcid(0);
    expect(wrapper.vm['selectedAminoAcid']).toBe(0);
  });

  test.each([-1, 5000])('selectAminoAcid throws when index is out of bounds: [0, n-1] inclusive, where n is number of codons within aminoAcidData', (i) => {
    const wrapper = mountWrapper();
    const result = () => wwrapper.vm.selectAminoAcid(i);
    expect(result).toThrow();
  });

  test('deselectAminoAcid assigns null to selectedAminoAcid data field', () => {
    const wrapper = mountWrapper();
    wrapper.vm.selectedAminoAcid = 1;
    wrapper.vm.deselectAminoAcid();
    expect(wrapper.vm['selectedAminoAcid']).toBeNull();
  });

  test.each([false, true])('toggleEditMode negates the boolean value of editMode', (editMode) => {
    const wrapper = mountWrapper();
    wrapper.vm.editMode = editMode;
    wrapper.vm.toggleEditMode();
    expect(wrapper.vm['editMode']).toBe(!editMode);
  });
});

function prepopulate(wrapper) {
  wrapper.vm.pushCodon('AUG');
  wrapper.vm.pushCodon('UUU');
  wrapper.vm.pushCodon('UAG');
  return wrapper;
}
