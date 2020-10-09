import { initWrapperGenerator } from 'tests/utils.js';
import CodonHandler from 'components/CodonHandler/CodonHandler';

const props = {
  editMode: false,
  notifyParentToggleEditMode: function() {},
  onCodonEdit: function() {},
  onCodonSubmit: function() {}
};

const { mountWrapper, mountAttachedWrapper } = initWrapperGenerator(CodonHandler, props);
describe('CodonHandler\'s appearance changes depending on editMode prop', () => {
  test('Uppermost div does not have .edit-mode class if editMode is false', () => {
    const wrapper = mountAttachedWrapper();
    expect(wrapper.vm.editMode).toBe(false);

    const div = wrapper.find('.codon-handler');
    expect(div.exists()).toBe(true);
    expect(div.element.tagName.toLowerCase()).toBe('div');
    expect(div.classes()).toStrictEqual(['codon-handler']);
    wrapper.destroy();
  });

  test('Uppermost div gains .edit-mode class if editMode is true', async () => {
    const wrapper = mountAttachedWrapper();
    await wrapper.setProps({ editMode: true });

    const div = wrapper.find('.codon-handler');
    expect(div.exists()).toBe(true);
    expect(div.element.tagName.toLowerCase()).toBe('div');
    expect(div.classes().sort()).toStrictEqual(['edit-mode', 'codon-handler'].sort());
    wrapper.destroy();
  });

  test('Header\'s text contains insert if editMode is false', () => {
    const wrapper = mountAttachedWrapper();
    expect(wrapper.vm.editMode).toBe(false);

    const header = wrapper.find('header');
    expect(header.exists()).toBe(true);
    expect(header.element.tagName.toLowerCase()).toBe('header');
    expect(header.text()).toMatch(/insert/i);
    wrapper.destroy();
  });

  test('Header\'s text contains edit if editMode is true', async () => {
    const wrapper = mountAttachedWrapper();
    await wrapper.setProps({ editMode: true });

    const header = wrapper.find('header');
    expect(header.exists()).toBe(true);
    expect(header.element.tagName.toLowerCase()).toBe('header');
    expect(header.text()).toMatch(/edit/i);
    wrapper.destroy();
  });

  test('Submit button\'s click event will attempt to submit a codon if editMode is false', async () => {
    const wrapper = mountAttachedWrapper();
    const mockSubmit = jest.fn();
    const mockEdit = jest.fn();
    wrapper.vm.maybeSubmitCodon = mockSubmit;
    wrapper.vm.editCodon = mockEdit;
    expect(wrapper.vm.editMode).toBe(false);

    const button = wrapper.find('.codon-commit');
    expect(button.exists()).toBe(true);
    expect(button.element.tagName.toLowerCase()).toBe('button');
    await button.trigger('click');
    expect(mockSubmit).toHaveBeenCalled();
    expect(mockEdit).not.toHaveBeenCalled();
    wrapper.destroy();
  });

  test('Submit button\'s click event will involve editing a codon if editMode is false', async () => {
    const wrapper = mountAttachedWrapper();
    const mockSubmit = jest.fn();
    const mockEdit = jest.fn();
    wrapper.vm.maybeSubmitCodon = mockSubmit;
    wrapper.vm.editCodon = mockEdit;
    await wrapper.setProps({ editMode: true });

    const button = wrapper.find('.codon-commit');
    expect(button.exists()).toBe(true);
    expect(button.element.tagName.toLowerCase()).toBe('button');
    await button.trigger('click');
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(mockEdit).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('Toggle button is enabled when editMode is false', () => {
    const wrapper = mountAttachedWrapper();
    expect(wrapper.vm.editMode).toBe(false);

    const button = wrapper.find('.codon-mode-toggle');
    expect(button.exists()).toBe(true);
    expect(button.element.tagName.toLowerCase()).toBe('button');
    expect(button.attributes('disabled')).toBeFalsy();
    wrapper.destroy();
  });

  test('Toggle button is disabled when editMode is true', async () => {
    const wrapper = mountAttachedWrapper();
    await wrapper.setProps({ editMode: true });

    const button = wrapper.find('.codon-mode-toggle');
    expect(button.exists()).toBe(true);
    expect(button.element.tagName.toLowerCase()).toBe('button');
    expect(button.attributes('disabled')).toBeTruthy();
    wrapper.destroy();
  });
});

describe('Test elements generated through Vue v-for directive', () => {
  test('There is an .amino-acid-option for each element in possibleAminoAcids data field', async () => {
    const possibleAminoAcids = ['1', '2', '3', '4', '5'];
    const wrapper = mountAttachedWrapper();
    await wrapper.setData({ possibleAminoAcids });
    const options = wrapper.findAll('.amino-acid-option');

    expect(options.length).toEqual(possibleAminoAcids.length);
    options.wrappers.forEach((option, i) => {
      expect(option.text()).toBe(possibleAminoAcids[i]);
    });

    wrapper.destroy();
  });

  test('There are no .amino-acid-options if possibleAminoAcids is empty', async () => {
    const wrapper = mountAttachedWrapper();
    const options = wrapper.findAll('.amino-acid-option');
    expect(options.length).toEqual(0);
    wrapper.destroy();
  });

  test('There are 3 .base-inserts', () => {
    const wrapper = mountAttachedWrapper();
    const inserts = wrapper.findAll('.base-insert');
    expect(inserts.length).toEqual(3);
    wrapper.destroy();
  });

  test('Each .base-insert has expected values for their reactive properties', () => {
    const wrapper = mountAttachedWrapper();
    const inserts = wrapper.findAll('.base-insert');
    expect(inserts.length).toBeGreaterThan(0);

    inserts.wrappers.forEach((insert, i) => {
      expect(insert.attributes('id')).toBe(`base-${i+1}`)
      expect(insert.attributes('data-base-id')).toBe(`${i+1}`)
    });

    wrapper.destroy();
  });

  test('There are 4 .base-buttons', () => {
    const wrapper = mountAttachedWrapper();
    const buttons = wrapper.findAll('.base-button');
    expect(buttons.length).toEqual(4);

    buttons.wrappers.forEach(button => {
      expect(button.text()).toMatch(/[UCAG]{1}/);
    });

    wrapper.destroy();
  });

  test('Each .base-button has expected values for their reactive properties', () => {
    const wrapper = mountAttachedWrapper();
    const buttons = wrapper.findAll('.base-button');
    expect(buttons.length).toBeGreaterThan(0);

    buttons.wrappers.forEach(button => {
      expect(button.attributes('data-base-value')).toMatch(button.text());
    });

    wrapper.destroy();
  });
});

describe.only('Test native events', () => {
  test('onclick: .base-insert elements set currentlySelectedInput data field', async () => {
    const wrapper = mountAttachedWrapper();
    const insert = wrapper.find('.base-insert');
    expect(insert.exists()).toBe(true);

    await insert.trigger('click');
    expect(wrapper.vm.currentlySelectedInput).toBe(insert.element);
    wrapper.destroy();
  });

  test('onblur: .base-insert elements set currentlySelectedInput to null', async () => {
    const wrapper = mountAttachedWrapper();
    const insert = wrapper.find('.base-insert');
    expect(insert.exists()).toBe(true);
    wrapper.vm.currentlySelectedInput = insert.element;

    await insert.trigger('blur');
    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    wrapper.destroy();
  });

  test('onblur: .base-insert elements do nothing if blurLocked data field is true', async () => {
    const wrapper = mountAttachedWrapper();
    const insert = wrapper.find('.base-insert');
    expect(insert.exists()).toBe(true);
    wrapper.vm.currentlySelectedInput = insert.element;
    wrapper.vm.blurLocked = true;

    await insert.trigger('blur');
    expect(wrapper.vm.currentlySelectedInput).toBe(insert.element);
    wrapper.destroy();
  });

  test('oninput: .base-insert elements set next empty base data field to input value', async () => {
    const wrapper = mountAttachedWrapper();
    const value = 'U';
    const insert = wrapper.find('.base-insert');
    expect(insert.exists()).toBe(true);
    insert.element.value = value;

    await insert.trigger('input');
    expect(wrapper.vm.bases['1']).toBe(value);
    wrapper.destroy();
  });

  test('onmousedown: .base-button elements set blurLocked to true', async () => {
    const wrapper = mountAttachedWrapper();
    const button = wrapper.find('.base-button');
    expect(button.exists()).toBe(true);
    expect(wrapper.vm.blurLocked).toBe(false);

    await button.trigger('mousedown');
    expect(wrapper.vm.blurLocked).toBe(true);
    wrapper.destroy();
  });

  test('onclick: .base-button elements set next empty base data field to button data value', async () => {
    const wrapper = mountAttachedWrapper();
    const button = wrapper.find('.base-button');
    expect(button.exists()).toBe(true);

    await button.trigger('click');
    expect(wrapper.vm.bases['1']).toBe(button.attributes('data-base-value'));
    wrapper.destroy();
  });

  test('onmousedown + onclick: .base-button elements set base data field, corresponding to currentlySelectedInput, to button data value', async () => {
    const wrapper = mountAttachedWrapper();
    const insert = wrapper.find('.base-insert');
    const button = wrapper.find('.base-button');
    expect(insert.exists()).toBe(true);
    expect(button.exists()).toBe(true);
    wrapper.vm.currentlySelectedInput = insert.element;

    await button.trigger('mousedown');
    await button.trigger('click');
    expect(wrapper.vm.bases[insert.attributes('data-base-id')]).toBe(button.attributes('data-base-value'));
    expect(wrapper.vm.blurLocked).toBe(false);
    wrapper.destroy();
  });

  test('click: .codon-commit element calls prop function from parent if bases data fields are all filled', async () => {
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn();
    const button = wrapper.find('.codon-commit');
    expect(button.exists()).toBe(true);
    wrapper.setProps({ onCodonSubmit: mockFunc });
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';

    await button.trigger('click');
    expect(mockFunc).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('click: .codon-commit element resets possibleAminoAcids, .base-insert elements, and currentlySelectedInput data field if bases data fields are all filled', async () => {
    const wrapper = mountAttachedWrapper();
    const inserts = wrapper.findAll('.base-insert');
    const button = wrapper.find('.codon-commit');
    expect(button.exists()).toBe(true);
    expect(inserts.length).toBeGreaterThan(0);
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.possibleAminoAcids = [''];
    wrapper.vm.currentlySelectAminoAcid = inserts.at(0).element;

    await button.trigger('click');
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual([]);
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': '', '3': '' });
    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    wrapper.destroy();
  });

  test('click: .codon-commit element does nothing if there are any empty base data fields', async () => {
    const wrapper = mountAttachedWrapper();
    const inserts = wrapper.findAll('.base-insert');
    const button = wrapper.find('.codon-commit');
    expect(button.exists()).toBe(true);
    expect(inserts.length).toBeGreaterThan(0);
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = '';
    wrapper.vm.possibleAminoAcids = [''];
    wrapper.vm.currentlySelectedInput = inserts.at(0).element;

    await button.trigger('click');
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual(['']);
    expect(wrapper.vm.bases).toStrictEqual({ '1': 'U', '2': 'U', '3': '' });
    expect(wrapper.vm.currentlySelectedInput).toBe(inserts.at(0).element);
    wrapper.destroy();
  });

  test('click: .codon-commit element calls two distinct prop functions from parent if editMode is true and all base data fields are filled', async () => {
    const wrapper = mountAttachedWrapper();
    const mockSubmit = jest.fn();
    const mockEdit = jest.fn();
    const mockNotify = jest.fn();
    const button = wrapper.find('.codon-commit');
    expect(button.exists()).toBe(true);
    await wrapper.setProps({
      onCodonSubmit: mockSubmit,
      onCodonEdit: mockEdit,
      notifyParentToggleEditMode: mockNotify,
      editMode: true
    });

    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';

    await button.trigger('click');
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(mockEdit).toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('click: .codon-commit element resets possibleAminoAcids, .base-insert elements, and currentlySelectedInput data field if bases data fields are all filled and editMode is true', async () => {
    const wrapper = mountAttachedWrapper();
    const inserts = wrapper.findAll('.base-insert');
    const button = wrapper.find('.codon-commit');
    expect(button.exists()).toBe(true);
    expect(inserts.length).toBeGreaterThan(0);
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.possibleAminoAcids = [''];
    wrapper.vm.currentlySelectAminoAcid = inserts.at(0).element;

    await button.trigger('click');
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual([]);
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': '', '3': '' });
    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    wrapper.destroy();
  });

  test('click: .codon-mode-toggle element sets mode data field to AUTO if field is MANUAL', async () => {
    const wrapper = mountAttachedWrapper();
    const button = wrapper.find('.codon-mode-toggle');
    expect(button.exists()).toBe(true);
    wrapper.vm.mode = 0;

    await button.trigger('click');
    expect(wrapper.vm.mode).toEqual(1);
    wrapper.destroy();
  });

  test('click: .codon-mode-toggle element sets mode data field to MANUAL if field is AUTO', async () => {
    const wrapper = mountAttachedWrapper();
    const button = wrapper.find('.codon-mode-toggle');
    expect(button.exists()).toBe(true);
    wrapper.vm.mode = 1;

    await button.trigger('click');
    expect(wrapper.vm.mode).toEqual(0);
    wrapper.destroy();
  });

  test('click: .codon-mode-toggle element calls prop function from parent if mode data field is set to AUTO from MANUAL and bases data fields are all filled', async () => {
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn();
    const button = wrapper.find('.codon-mode-toggle');
    expect(button.exists()).toBe(true);
    wrapper.setProps({ onCodonSubmit: mockFunc });
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.mode = 0;

    await button.trigger('click');
    expect(wrapper.vm.mode).toEqual(1);
    expect(mockFunc).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('click: .codon-mode-toggle element resets possibleAminoAcids, .base-insert elements, and currentlySelectedInput data field if mode data field is set to AUTO from MANUAL and bases data fields are all filled', async () => {
    const wrapper = mountAttachedWrapper();
    const inserts = wrapper.findAll('.base-insert');
    const button = wrapper.find('.codon-mode-toggle');
    expect(button.exists()).toBe(true);
    expect(inserts.length).toBeGreaterThan(0);
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.possibleAminoAcids = [''];
    wrapper.vm.mode = 0;
    wrapper.vm.currentlySelectAminoAcid = inserts.at(0).element;

    await button.trigger('click');
    expect(wrapper.vm.mode).toEqual(1);
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual([]);
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': '', '3': '' });
    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    wrapper.destroy();
  });

  test('click: .codon-clear element resets possibleAminoAcids, .base-insert elements, and currentlySelectedInput data field', async () => {
    const wrapper = mountAttachedWrapper();
    const inserts = wrapper.findAll('.base-insert');
    const button = wrapper.find('.codon-clear');
    expect(button.exists()).toBe(true);
    expect(inserts.length).toBeGreaterThan(0);
    wrapper.vm.bases['1'] = 'U';
    wrapper.vm.bases['2'] = 'U';
    wrapper.vm.bases['3'] = 'U';
    wrapper.vm.possibleAminoAcids = [''];
    wrapper.vm.currentlySelectAminoAcid = inserts.at(0).element;

    await button.trigger('click');
    expect(wrapper.vm.possibleAminoAcids).toStrictEqual([]);
    expect(wrapper.vm.bases).toStrictEqual({ '1': '', '2': '', '3': '' });
    expect(wrapper.vm.currentlySelectedInput).toBeNull();
    wrapper.destroy();
  });
});
