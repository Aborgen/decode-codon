import { initWrapperGenerator } from 'tests/utils.js';
import CodonHandler from 'components/CodonHandler/CodonHandler';

const props = {
  editMode: false,
  notifyParentToggleEditMode: function() {},
  onCodonEdit: function() {},
  onCodonSubmit: function() {}
};

const { mountWrapper, mountAttachedWrapper } = initWrapperGenerator(CodonHandler, props);
describe('CodonHandler has several private methods available to it, most involve mutating state, some are helpers', () => {
  test('collectBases returns concatenated strings in state if all are filled', () => {
    const wrapper = mountWrapper();
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    const result = wrapper.vm.collectBases();
    expect(result).toBe('UUU');
  });

  test('collectBases returns null if there are less than three filled strings in state', () => {
    const wrapper = mountWrapper();
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    const result = wrapper.vm.collectBases();
    expect(result).toBeNull();
  });

  test('lockBaseInputBlur sets blurLocked data field to true', () => {
    const wrapper = mountWrapper();
    expect(wrapper.vm.blurLocked).toBe(false);
    wrapper.vm.lockBaseInputBlur();
    expect(wrapper.vm.blurLocked).toBe(true);
  });

  test('unlockBaseInputBlur sets blurLocked data field to false', () => {
    const wrapper = mountWrapper();
    wrapper.vm.blurLocked = true;
    wrapper.vm.unlockBaseInputBlur();
    expect(wrapper.vm.blurLocked).toBe(false);
  });

  test('maybeResetSelectedInput sets currentlySelectedInput data field to null if blurLocked is false', () => {
    const wrapper = mountWrapper();
    expect(wrapper.vm.blurLocked).toBe(false);
    wrapper.vm.currentlySelectedInput = document.createElement('input');
    wrapper.vm.maybeResetSelectedInput();
    expect(wrapper.vm.currentlySelectedInput).toBeNull();
  });

  test('maybeResetSelectedInput does nothing if blurLocked is true', () => {
    const wrapper = mountWrapper();
    wrapper.vm.blurLocked = true;
    wrapper.vm.currentlySelectedInput = '';
    wrapper.vm.maybeResetSelectedInput();
    expect(wrapper.vm.currentlySelectedInput).toBe('');
  });

  test('resetInputs sets base data inputs to empty strings, possibleAminoAcids to an empty array, and currentlySelectedInput to null', () => {
    const wrapper = mountAttachedWrapper();
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.currentlySelectedInput = document.createElement('input');
    wrapper.vm.possibleAminoAcids = [''];
    wrapper.vm.resetInputs();
    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    expect(wrapper.vm.bases).toStrictEqual({'1': '', '2': '', '3': ''});
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual([]);
    wrapper.destroy();
  });

  test('isModeAuto returns true if mode data field is EMode.AUTO', () => {
    const wrapper = mountWrapper();
    // EMode is a typescript enum that is not being exported. MANUAL = 0, AUTO = 1.
    wrapper.vm.mode = 1;
    const result = wrapper.vm.isModeAuto();
    expect(result).toBe(true);
  });

  test('toggleMode sets mode data field to EMode.AUTO when mode data field is EMode.MANUAL', () => {
    const wrapper = mountWrapper();
    expect(wrapper.vm.mode).toBe(0);
    wrapper.vm.toggleMode();
    expect(wrapper.vm.mode).toBe(1);
  });

  test('toggleMode sets mode data field to EMode.MANUAL when mode data field is EMode.AUTO', () => {
    const wrapper = mountWrapper();
    wrapper.vm.mode = 1;
    wrapper.vm.toggleMode();
    expect(wrapper.vm.mode).toBe(0);
  });

  test('maybeSubmitCodon will throw if editMode is true' ,() => {
    const wrapper = mountWrapper();
    wrapper.setProps({ editMode: true });
    const result = () => wrapper.vm.maybeSubmitCodon();
    expect(result).toThrow();
  });

  test('maybeSubmitCodon will do nothing if editMode is false and there are base data fields that are blank' ,() => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    expect(wrapper.vm.editMode).toBe(false);
    wrapper.setProps({ onCodonSubmit: mockFunction });
    wrapper.vm.bases['1'] = '';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.maybeSubmitCodon();
    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('maybeSubmitCodon will call parent callback and clear base data fields', () => {
    const wrapper = mountAttachedWrapper();
    const mockFunction = jest.fn();
    expect(wrapper.vm.editMode).toBe(false);
    wrapper.setProps({ onCodonSubmit: mockFunction });
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.maybeSubmitCodon();
    expect(mockFunction).toHaveBeenCalled();
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': '', '3': '' });
    wrapper.destroy();
  });

  test('editCodon will call parent callback and clear base data fields', () => {
    const wrapper = mountAttachedWrapper();
    const mockFunction = jest.fn();
    wrapper.setProps({
      onCodonEdit: mockFunction,
      editMode: true
    });

    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.editCodon();
    expect(mockFunction).toHaveBeenCalled();
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': '', '3': '' });
    wrapper.destroy();
  });

  test('editCodon does nothing if any base data inputs are empty', () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    wrapper.setProps({
      onCodonEdit: mockFunction,
      editMode: true
    });

    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.editCodon();
    expect(mockFunction).not.toHaveBeenCalled();
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': 'U', '3': 'U' });
  });

  test('editCodon will throw if editMode is false', () => {
    const wrapper = mountWrapper();
    wrapper.setProps({ editMode: false });
    const result = () => wrapper.vm.editCodon();
    expect(result).toThrow();
  });

  test('pushBase updates base field as well as possibleAminoAcids', () => {
    const wrapper = mountWrapper();
    wrapper.vm.pushBase('1', 'U');
    expect(wrapper.vm.bases).toStrictEqual({ '1': 'U', '2': '', '3': '' });
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual(["Phe", "Leu", "Ser", "Tyr", "Stop", "Cys", "Trp"]);
  });

  test('pushBase throws if baseId is not a string in the group of [\'1\', \'2\', \'3\']', () => {
    const wrapper = mountWrapper();
    const result = () => wrapper.vm.pushBase(1, 'U');
    expect(result).toThrow();
  });

  test('pushBase throws if base is not a string in the group of [\'U\', \'C\', \'A\', \'G\']', () => {
    const wrapper = mountWrapper();
    const result = () => wrapper.vm.pushBase('1', 'Z');
    expect(result).toThrow();
  });

  test('updateAminoAcids does nothing if there are no filled base fields', () => {
    const wrapper = mountWrapper();
    wrapper.vm.updateAminoAcids();
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual([]);
  });

  test('updateAminoAcids sets possibleAminoAcids according to src/data/CodonTable.js', () => {
    const wrapper = mountWrapper();
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.updateAminoAcids();
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual(["Phe", "Leu", "Ser", "Tyr", "Stop", "Cys", "Trp"]);
  });

  test.each([['', '', 'U'], ['U', '', 'U'], ['', 'U', 'U']])('updateAminoAcids sets possibleAminoAcids to [\'?\'] when there are gaps in the base fields, left to right [%s, %s, %s]', (a, b, c) => {
    const wrapper = mountWrapper();
    wrapper.vm.bases['1'] = a;
    wrapper.vm.bases['2'] = b;
    wrapper.vm.bases['3'] = c;
    wrapper.vm.updateAminoAcids();
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual(['?']);
  });
});

describe('CodonHandler has a few methods that involve the DOM', () => {
  test('getNextEmptyInput returns the next HTMLInputElement that has an empty value', () => {
    const wrapper = mountAttachedWrapper();
    wrapper.vm.currentlySelectedInput = '';
    const bases = wrapper.findAll('.base-insert');
    bases.at(0).element.value = 'U';
    const result = wrapper.vm.getNextEmptyInput();
    expect(result).toStrictEqual(bases.at(1).element);
    expect(wrapper.vm.currentlySelectedInput).toStrictEqual(bases.at(1).element);
    wrapper.destroy();
  });

  test('getNextEmptyInput returns null if there are no empty HTMLInputElements and sets currentlySelectedInput to null', () => {
    const wrapper = mountAttachedWrapper();
    const bases = wrapper.findAll('.base-insert');
    bases.at(0).element.value = 'U';
    bases.at(1).element.value = 'U';
    bases.at(2).element.value = 'U';
    wrapper.vm.currentlySelectedInput = bases.at(0).element;

    const result = wrapper.vm.getNextEmptyInput();
    expect(result).toBeNull();
    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    wrapper.destroy();
  });

  test('selectBaseByButton will use button data property to set base data input when there are any empty, and also selects next empty, if any', () => {
    const wrapper = mountAttachedWrapper();
    const bases = wrapper.findAll('.base-insert');
    bases.at(0).element.value = 'U';
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.blurLocked = true;

    const button = document.createElement('button');
    button.dataset.baseValue = 'U';
    wrapper.vm.selectBaseByButton(button);

    expect(wrapper.vm.currentlySelectedInput).toStrictEqual(bases.at(2).element);
    expect(wrapper.vm.bases).toStrictEqual({ '1': 'U', '2': 'U', '3': '' });
    expect(wrapper.vm.blurLocked).toBe(false);
    wrapper.destroy();
  });

  test('selectBaseByButton will do nothing if all base data inputs are filled', () => {
    const wrapper = mountAttachedWrapper();
    const bases = wrapper.findAll('.base-insert');
    bases.at(0).element.value = 'U';
    bases.at(1).element.value = 'U';
    bases.at(2).element.value = 'U';
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.blurLocked = true;

    const button = document.createElement('button');
    button.dataset.baseValue = 'U';
    wrapper.vm.selectBaseByButton(button);

    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    expect(wrapper.vm.bases).toStrictEqual({ '1': 'U', '2': 'U', '3': 'U' });
    expect(wrapper.vm.blurLocked).toBe(false);
    wrapper.destroy();
  });

  test('selectBaseByButton will automatically commit codon when mode is EMode.AUTO, and highlight the first input element', () => {
    const wrapper = mountAttachedWrapper();
    const bases = wrapper.findAll('.base-insert');
    bases.at(0).element.value = 'U';
    bases.at(1).element.value = 'U';
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.blurLocked = true;
    wrapper.vm.mode = 1;

    const button = document.createElement('button');
    button.dataset.baseValue = 'U';
    wrapper.vm.selectBaseByButton(button);

    expect(wrapper.vm.currentlySelectedInput).toStrictEqual(bases.at(0).element);
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': '', '3': '' });
    expect(wrapper.vm.blurLocked).toBe(false);
    wrapper.destroy();
  });

  test('selectBaseByTextInsertion inserts value inside input into corresponding base data field', () => {
    const wrapper = mountAttachedWrapper();
    const bases = wrapper.findAll('.base-insert');
    const input = bases.at(0).element;
    input.value = 'U';
    wrapper.vm.selectBaseByTextInsertion(input);

    expect(wrapper.vm.currentlySelectedInput).toStrictEqual(bases.at(1).element);
    expect(wrapper.vm.bases).toStrictEqual({ '1': 'U', '2': '', '3': '' });
    wrapper.destroy();
  });

  test('selectBaseByTextInsertion sets currentlySelectedInput to null if inserted base is last unfilled', () => {
    const wrapper = mountAttachedWrapper();
    const bases = wrapper.findAll('.base-insert');
    bases.at(0).element.value = 'U';
    bases.at(1).element.value = 'U';
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';

    const input = bases.at(2).element;
    input.value = 'U';
    wrapper.vm.selectBaseByTextInsertion(input);

    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    expect(wrapper.vm.bases).toStrictEqual({ '1': 'U', '2': 'U', '3': 'U' });
    wrapper.destroy();
  });

  test('selectBaseByTextInsertion does not insert or change currentlySelectedInput if value in input is invalid', () => {
    const wrapper = mountAttachedWrapper();
    const bases = wrapper.findAll('.base-insert');
    const input = bases.at(0).element;
    input.value = 'Bad input';
    wrapper.vm.selectBaseByTextInsertion(input);

    expect(wrapper.vm.currentlySelectedInput).toStrictEqual(input);
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': '', '3': '' });
    wrapper.destroy();
  });

  test('selectBaseByTextInsertion accepts lowercase letters and sets them to uppercase, if valid.', () => {
    const wrapper = mountAttachedWrapper();
    const bases = wrapper.findAll('.base-insert');
    const input = bases.at(0).element;
    input.value = 'u';
    wrapper.vm.selectBaseByTextInsertion(input);

    expect(wrapper.vm.currentlySelectedInput).toStrictEqual(bases.at(1).element);
    expect(wrapper.vm.bases).toStrictEqual({ '1': 'U', '2': '', '3': '' });
    wrapper.destroy();
  });

  test('selectedInput sets currentlySelectedElement, and has browser select it', () => {
    const wrapper = mountAttachedWrapper();
    const input = document.createElement('input');
    document.body.appendChild(input);
    wrapper.vm.selectedInput(input);
    expect(wrapper.vm.currentlySelectedInput).toStrictEqual(input);
    expect(wrapper.vm.currentlySelectedInput).toStrictEqual(document.activeElement);
    wrapper.destroy();
  });

  test('selectedInput throws if anything other than an HTMLInputElement is given to it', () => {
    const wrapper = mountAttachedWrapper();
    const span = document.createElement('span');
    const result = () => wrapper.vm.selectedInput(span);
    expect(result).toThrow();
    wrapper.destroy();
  });
});
