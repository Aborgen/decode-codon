import { initWrapperGenerator } from 'tests/utils.js';
import DisplayControls from 'components/AminoAcidDisplay/internal/DisplayControls/DisplayControls';
import Vue from 'vue';

const props = {
  notifyParentDeselectAminoAcid: function() {},
  notifyParentSelectAminoAcid: function() {},
  notifyParentToggleEditMode: function() {},
  onDeleteCodon: function() {},
  onClearLists: function() {}
};

const { mountWrapper, mountAttachedWrapper } = initWrapperGenerator(DisplayControls, props);
describe('DisplayControls has several private methods available to it, most involve mutating state, some are helpers', () => {
  test('deleteCodon invokes callback from parent if user confirms', () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const spy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    wrapper.setProps({ onDeleteCodon: mockFunction });
    wrapper.vm.deleteCodon();
    expect(spy).toHaveBeenCalled();
    expect(mockFunction).toHaveBeenCalled();
  });

  test('deleteCodon does nothing if user declines', () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const spy = jest.spyOn(window, 'confirm').mockImplementation(() => false);
    wrapper.setProps({ onDeleteCodon: mockFunction });
    wrapper.vm.deleteCodon();
    expect(spy).toHaveBeenCalled();
    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('handleKeyboardSelect will replace selected input\'s number with 1 if user inputs a number less than 1', () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('min', 1);
    input.setAttribute('max', 10);
    input.value = '-1';
    input.addEventListener('input', mockFunction);
    wrapper.vm.handleKeyboardSelect(input);
    expect(input.value).toBe('1');
    expect(mockFunction).toHaveBeenCalled();
  });

  test('handleKeyboardSelect will replace selected input\'s number with n if user inputs a number greater than n', () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('min', 1);
    input.setAttribute('max', 10);
    input.value = '11';
    input.addEventListener('input', mockFunction);
    wrapper.vm.handleKeyboardSelect(input);
    expect(input.value).toBe('10');
    expect(mockFunction).toHaveBeenCalled();
  });

  test.only('handleKeyboardSelect will set selectedAminoAcid if (user\'s input - 1) !== selectedAminoAcid', () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    // If I use wrapper.setProps, the test hangs
    const mockBlur = jest.fn(() => {
      Vue.config.silent = true;
      wrapper.vm.selectedAminoAcid = 1;
      Vue.config.silent = false;
    });

    wrapper.setProps({ selectedAminoAcid: 0 });
    wrapper.vm.setSelectedAminoAcid = mockFunction;

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('min', 1);
    input.setAttribute('max', 10);
    input.value = '2';
    input.blur = mockBlur;
    wrapper.vm.handleKeyboardSelect(input);
    expect(mockFunction).toHaveBeenCalled();
    expect(mockBlur).toHaveBeenCalled();
  });

  test('handleKeyboardSelect will do nothing if (user\'s input-1) === selectedAminoAcid', () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const mockBlur = jest.fn();
    wrapper.setProps({ selectedAminoAcid: 0 });
    wrapper.vm.setSelectedAminoAcid = mockFunction;

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('min', 1);
    input.setAttribute('max', 10);
    input.value = '1';
    input.blur = mockBlur;
    wrapper.vm.handleKeyboardSelect(input);
    expect(mockFunction).not.toHaveBeenCalled();
    expect(mockBlur).not.toHaveBeenCalled();
  });
});
