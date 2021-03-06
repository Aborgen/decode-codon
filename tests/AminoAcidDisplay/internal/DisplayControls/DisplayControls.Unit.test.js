import { initWrapperGenerator, clearDOM } from 'tests/utils.js';
import DisplayControls from 'components/AminoAcidDisplay/internal/DisplayControls/DisplayControls';
import Vue from 'vue';

const props = {
  notifyParentDeselectAminoAcid: function() {},
  notifyParentSelectAminoAcid: function() {},
  notifyParentToggleEditMode: function() {},
  onDeleteCodon: function() {},
  onClearLists: function() {}
};

const { mountWrapper } = initWrapperGenerator(DisplayControls, props);
describe('DisplayControls has several private methods available to it, most involve mutating state, some are helpers', () => {
  test('deleteCodon invokes callback from parent if user confirms', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const spy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    await wrapper.setProps({ onDeleteCodon: mockFunction });
    wrapper.vm.deleteCodon();
    expect(spy).toHaveBeenCalled();
    expect(mockFunction).toHaveBeenCalled();
  });

  test('deleteCodon does nothing if user declines', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const spy = jest.spyOn(window, 'confirm').mockImplementation(() => false);
    await wrapper.setProps({ onDeleteCodon: mockFunction });
    wrapper.vm.deleteCodon();
    expect(spy).toHaveBeenCalled();
    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('handleKeyboardSelect will replace selected input\'s number with 1 if user inputs a number less than 1 and chainLength > 0', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const input = document.createElement('input');
    await wrapper.setProps({ chainLength: 1 });
    input.setAttribute('type', 'number');
    input.setAttribute('min', 1);
    input.setAttribute('max', 10);
    input.value = '-1';
    input.addEventListener('input', mockFunction);
    wrapper.vm.handleKeyboardSelect(input);
    expect(input.value).toBe('1');
    expect(mockFunction).toHaveBeenCalled();
  });

  test('handleKeyboardSelect will replace selected input\'s number with an empty string if chainLength === 0', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const input = document.createElement('input');
    await wrapper.setProps({ chainLength: 0 });
    input.setAttribute('type', 'number');
    input.setAttribute('min', 1);
    input.setAttribute('max', 10);
    input.value = '-1';
    input.addEventListener('input', mockFunction);
    wrapper.vm.handleKeyboardSelect(input);
    expect(input.value).toBe('');
    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('handleKeyboardSelect will replace selected input\'s number with n if user inputs a number greater than n and chainLength > 0', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const input = document.createElement('input');
    await wrapper.setProps({ chainLength: 1 });
    input.setAttribute('type', 'number');
    input.setAttribute('min', 1);
    input.setAttribute('max', 10);
    input.value = '11';
    input.addEventListener('input', mockFunction);
    wrapper.vm.handleKeyboardSelect(input);
    expect(input.value).toBe('10');
    expect(mockFunction).toHaveBeenCalled();
  });

  test('handleKeyboardSelect will set selectedAminoAcid if (user\'s input - 1) !== selectedAminoAcid and chainLength > 0', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    // If I use wrapper.setProps, the test hangs
    const mockBlur = jest.fn(() => {
      Vue.config.silent = true;
      wrapper.vm.selectedAminoAcid = 1;
      Vue.config.silent = false;
    });

    await wrapper.setProps({
      selectedAminoAcid: 0,
      chainLength: 1
    });

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

  test('handleKeyboardSelect will do nothing if (user\'s input-1) === selectedAminoAcid', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    const mockBlur = jest.fn();
    await wrapper.setProps({ selectedAminoAcid: 0 });
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

  test('handleSelectButtonClick will invoke setSelectedAminoAcid if selectedAminoAcid is null and chainLength > 0', () => {
    const mockSelectFunction = jest.fn();
    const mockUnselectFunction = jest.fn();
    const wrapper = mountWrapper();
    expect(wrapper.vm.selectedAminoAcid).toBeNull();

    wrapper.vm.handleSelect = mockSelectFunction;
    wrapper.vm.unsetSelectedAminoAcid = mockUnselectFunction;
    wrapper.vm.handleSelectButtonClick();
    expect(mockSelectFunction).toHaveBeenCalled();
    expect(mockUnselectFunction).not.toHaveBeenCalled();
  });

  test('handleSelectButtonClick will invoke handleSelect if selectedAminoAcid is not null and is different from searchBoxValue', async () => {
    const mockSelectFunction = jest.fn();
    const mockUnselectFunction = jest.fn();
    const wrapper = mountWrapper();
    await wrapper.setProps({ selectedAminoAcid: 1 });

    wrapper.vm.searchBoxValue = 2;
    wrapper.vm.handleSelect = mockSelectFunction;
    wrapper.vm.unsetSelectedAminoAcid = mockUnselectFunction;
    wrapper.vm.handleSelectButtonClick();
    expect(mockSelectFunction).toHaveBeenCalled();
    expect(mockUnselectFunction).not.toHaveBeenCalled();
  });

  test('handleSelectButtonClick will invoke unsetSelectedAminoAcid if selectedAminoAcid is not null and is equal to searchBoxValue', async () => {
    const mockSelectFunction = jest.fn();
    const mockUnselectFunction = jest.fn();
    const wrapper = mountWrapper();
    await wrapper.setProps({ selectedAminoAcid: 0 });
    wrapper.vm.searchBoxValue = 0;
    wrapper.vm.handleSelect = mockSelectFunction;
    wrapper.vm.unsetSelectedAminoAcid = mockUnselectFunction;
    wrapper.vm.handleSelectButtonClick();
    expect(mockSelectFunction).not.toHaveBeenCalled();
    expect(mockUnselectFunction).toHaveBeenCalled();
  });

  test('setSelectedAminoAcid delegates to prop function if number in search box input is valid', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    await wrapper.setProps({
      notifyParentSelectAminoAcid: mockFunction,
      chainLength: 5
    });

    const input = document.createElement('input');
    input.id = 'search-box';
    input.value = '3';
    document.body.appendChild(input);

    wrapper.vm.setSelectedAminoAcid();
    expect(mockFunction).toHaveBeenCalled();
    clearDOM();
  });

  test('setSelectedAminoAcid does nothing if value in search box input is not a number', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    await wrapper.setProps({
      notifyParentSelectAminoAcid: mockFunction,
      chainLength: 5
    });

    const input = document.createElement('input');
    input.id = 'search-box';
    input.value = 'hello';
    document.body.appendChild(input);

    wrapper.vm.setSelectedAminoAcid();
    expect(mockFunction).not.toHaveBeenCalled();
    clearDOM();
  });

  test('setSelectedAminoAcid does nothing if number in search box is less than 0', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    await wrapper.setProps({
      notifyParentSelectAminoAcid: mockFunction,
      chainLength: 5
    });

    const input = document.createElement('input');
    input.id = 'search-box';
    input.value = '-5';
    document.body.appendChild(input);

    wrapper.vm.setSelectedAminoAcid();
    expect(mockFunction).not.toHaveBeenCalled();
    clearDOM();
  });

  test('setSelectedAminoAcid does nothing if number in search box is greater than chainLength', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    await wrapper.setProps({
      notifyParentSelectAminoAcid: mockFunction,
      chainLength: 5
    });

    const input = document.createElement('input');
    input.id = 'search-box';
    input.value = '6';
    document.body.appendChild(input);

    wrapper.vm.setSelectedAminoAcid();
    expect(mockFunction).not.toHaveBeenCalled();
    clearDOM();
  });

  test('toggleEditMode delegates to prop function', async () => {
    const wrapper = mountWrapper();
    await wrapper.setProps({ selectedAminoAcid: 1 });
    const mockFunction = jest.fn();
    await wrapper.setProps({ notifyParentToggleEditMode: mockFunction });
    wrapper.vm.toggleEditMode();
    expect(mockFunction).toHaveBeenCalled();
  });

  test('toggleEditMode does nothing if selectedAminoAcid is null', async () => {
    const wrapper = mountWrapper();
    expect(wrapper.vm.selectedAminoAcid).toBeNull();
    const mockFunction = jest.fn();
    await wrapper.setProps({ notifyParentToggleEditMode: mockFunction });
    wrapper.vm.toggleEditMode();
    expect(mockFunction).not.toHaveBeenCalled();
  });

  test('unsetSelectedAminoAcid delegates to prop function', async () => {
    const wrapper = mountWrapper();
    const mockFunction = jest.fn();
    await wrapper.setProps({ notifyParentDeselectAminoAcid: mockFunction });
    wrapper.vm.unsetSelectedAminoAcid();
    expect(mockFunction).toHaveBeenCalled();
  });
});
