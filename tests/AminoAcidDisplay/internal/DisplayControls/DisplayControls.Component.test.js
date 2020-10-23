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

const { mountWrapper, mountAttachedWrapper } = initWrapperGenerator(DisplayControls, props);
describe('DisplayControls\' behavior changes depending on selectedAminoAcid prop', () => {
  test('The text value of .search-button is the same as the default when selectedAminoAcid is not null and selectedAminoAcid differs from searchBoxValue data field', async () => {
    const wrapper = mountAttachedWrapper();
    const button = wrapper.find('.search-button');
    const defaultText = button.text();
    await wrapper.setProps({ selectedAminoAcid: 1 });
    await wrapper.setData({ searchBoxValue: 2 });

    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('select');
    expect(button.text()).toBe(defaultText);
    wrapper.destroy();
  });

  test('The text value of .search-button changes when selectedAminoAcid prop is not null and selectedAminoAcid is the same as searchBoxValue data field', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const button = wrapper.find('.search-button');
    await wrapper.setProps({ selectedAminoAcid: n });
    await wrapper.setData({ searchBoxValue: n });

    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('deselect');
    wrapper.destroy();
  });

  test('#display-edit and #display-delete are only rendered if selectedAminoAcid prop is not null', async () => {
    const wrapper = mountAttachedWrapper();
    let editButton = wrapper.find('#display-edit');
    let deleteButton = wrapper.find('#display-delete');
    expect(editButton.exists()).toBe(false);
    expect(deleteButton.exists()).toBe(false);

    await wrapper.setProps({ selectedAminoAcid: 1 });
    editButton = wrapper.find('#display-edit');
    deleteButton = wrapper.find('#display-delete');
    expect(editButton.exists()).toBe(true);
    expect(deleteButton.exists()).toBe(true);
    wrapper.destroy();
  });
});

describe('Reactive attributes', () => {
  test('#search-box\'s max attribute is linked to chainLength prop', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const search = wrapper.find('#search-box');
    expect(wrapper.vm.chainLength).toEqual(0)
    expect(search.exists()).toBe(true);
    expect(search.attributes('max')).toBe('0');

    await wrapper.setProps({ chainLength: n });
    expect(search.attributes('max')).toBe(`${n}`);
    wrapper.destroy();
  });
});

describe('Test native events', () => {
  test('oninput: #search-box sets searchBoxValue data field to value of #search-box - 1', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const search = wrapper.find('#search-box');
    await search.setValue(`${n}`);
    expect(search.exists()).toBe(true);

    await search.trigger('input');
    expect(wrapper.vm.searchBoxValue).toBe(n-1);
    wrapper.destroy();
  });

  test('onkeyup enter: #search-box sets selecedAminoAcid if chainLength > 0 and value <= chainLength', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn((n) => {
      Vue.config.silent = true;
      wrapper.vm.selectedAminoAcid = n;
      Vue.config.silent = false;
    });

    const search = wrapper.find('#search-box');
    await search.setValue(`${n}`);
    await wrapper.setProps({
      chainLength: n,
      notifyParentSelectAminoAcid: mockFunc
    });

    expect(search.exists()).toBe(true);

    await search.trigger('keyup', { keyCode: 13 /* enter */ });
    expect(mockFunc).toHaveBeenCalled();
    expect(wrapper.vm.selectedAminoAcid).toBe(n-1);
    wrapper.destroy();
  });

  test('onkeyup enter: #search-box does nothing if chainLength > 0 and value > chainLength', async () => {
    const n = 2;
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn((n) => {
      Vue.config.silent = true;
      wrapper.vm.selectedAminoAcid = n;
      Vue.config.silent = false;
    });

    const search = wrapper.find('#search-box');
    await search.setValue(`${n}`);
    await wrapper.setProps({
      chainLength: 1,
      notifyParentSelectAminoAcid: mockFunc
    });

    expect(search.exists()).toBe(true);

    await search.trigger('keyup', { keyCode: 13 /* enter */ });
    expect(mockFunc).not.toHaveBeenCalled();
    expect(wrapper.vm.selectedAminoAcid).toBeNull();
    wrapper.destroy();
  });

  test('onkeyup enter: #search-box does nothing if chainLength is 0', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn((n) => {
      Vue.config.silent = true;
      wrapper.vm.selectedAminoAcid = n;
      Vue.config.silent = false;
    });

    const search = wrapper.find('#search-box');
    await search.setValue(`${n}`);
    await wrapper.setProps({
      chainLength: 0,
      notifyParentSelectAminoAcid: mockFunc
    });

    expect(search.exists()).toBe(true);

    await search.trigger('keyup', { keyCode: 13 /* enter */ });
    expect(mockFunc).not.toHaveBeenCalled();
    expect(wrapper.vm.selectedAminoAcid).toBeNull();
    wrapper.destroy();
  });

  test('onkeyup enter: #search-box sets value to an empty string if chainLength is 0 and value is a number', async () => {
    const wrapper = mountAttachedWrapper();
    const search = wrapper.find('#search-box');
    await search.setValue('5');
    expect(search.exists()).toBe(true);

    await search.trigger('keyup', { keyCode: 13 /* enter */ });
    expect(search.element.value).toBe('');
    wrapper.destroy();
  });

  test('onkeyup enter: #search-box sets value to 1 if chainLength > 0 and value is a number less than 1', async () => {
    const wrapper = mountAttachedWrapper();
    const search = wrapper.find('#search-box');
    await search.setValue('0');
    await wrapper.setProps({ chainLength: 5 });
    expect(search.exists()).toBe(true);

    await search.trigger('keyup', { keyCode: 13 /* enter */ });
    expect(search.element.value).toBe('1');
    wrapper.destroy();
  });

  test('onkeyup enter: #search-box sets value to chainLength if chainLength > 0 and value is a number greater than chainLength', async () => {
    const wrapper = mountAttachedWrapper();
    const search = wrapper.find('#search-box');
    await search.setValue('10');
    await wrapper.setProps({ chainLength: 5 });
    expect(search.exists()).toBe(true);

    await search.trigger('keyup', { keyCode: 13 /* enter */ });
    expect(search.element.value).toBe('5');
    wrapper.destroy();
  });

  test('onclick: .search-button sets selectedAminoAcid if selectedAminoAcid is null', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn((n) => {
      Vue.config.silent = true;
      wrapper.vm.selectedAminoAcid = n;
      Vue.config.silent = false;
    });

    const button = wrapper.find('.search-button');
    const search = wrapper.find('#search-box');
    await search.setValue(n);
    await wrapper.setProps({
      chainLength: n,
      notifyParentSelectAminoAcid: mockFunc
    });
    
    expect(button.exists()).toBe(true);
    expect(search.exists()).toBe(true);
    expect(wrapper.vm.selectedAminoAcid).toBeNull();

    await button.trigger('click');
    expect(mockFunc).toHaveBeenCalled();
    expect(wrapper.vm.selectedAminoAcid).toBe(n-1);
    wrapper.destroy();
  });

  test('onclick: .search-button sets selectedAminoAcid if selectedAminoAcid is not null and selectedAminoAcid is not searchBoxValue data field', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn((n) => {
      Vue.config.silent = true;
      wrapper.vm.selectedAminoAcid = n;
      Vue.config.silent = false;
    });

    const button = wrapper.find('.search-button');
    const search = wrapper.find('#search-box');
    await search.setValue(n);
    await wrapper.setProps({
      chainLength: 2,
      notifyParentSelectAminoAcid: mockFunc,
      selectedAminoAcid: 1
    });

    expect(button.exists()).toBe(true);
    expect(search.exists()).toBe(true);
    
    await button.trigger('click');
    expect(mockFunc).toHaveBeenCalled();
    expect(wrapper.vm.selectedAminoAcid).toBe(n-1);
    wrapper.destroy();
  });

  test('onclick: .search-button sets selectedAminoAcid to null if selectedAminoAcid is not null and selectedAminoAcid equals searchBoxValue data field', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn((n) => {
      Vue.config.silent = true;
      wrapper.vm.selectedAminoAcid = null;
      Vue.config.silent = false;
    });

    const button = wrapper.find('.search-button');
    const search = wrapper.find('#search-box');
    await search.setValue(n);
    await wrapper.setProps({
      chainLength: 2,
      notifyParentDeselectAminoAcid: mockFunc,
      selectedAminoAcid: n
    });

    await wrapper.setData({ searchBoxValue: n });
    expect(button.exists()).toBe(true);
    expect(search.exists()).toBe(true);
    
    await button.trigger('click');
    expect(mockFunc).toHaveBeenCalled();
    expect(wrapper.vm.selectedAminoAcid).toBeNull();
    wrapper.destroy();
  });

  test('onclick: #display-edit calls prop function if selectedAminoAcid is not null (sets editMode in parent, not available to this component)', async () => {
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn();
    await wrapper.setProps({
      selectedAminoAcid: 1,
      notifyParentToggleEditMode: mockFunc
    });

    const button = wrapper.find('#display-edit');
    expect(button.exists()).toBe(true);
    expect(wrapper.vm.editMode).toBeUndefined();

    await button.trigger('click');
    expect(mockFunc).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('onclick: #display-delete calls prop function if user confirms', async () => {
    const wrapper = mountAttachedWrapper();
    const spy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    const mockFunc = jest.fn();
    await wrapper.setProps({
      selectedAminoAcid: 1,
      onDeleteCodon: mockFunc
    });

    const button = wrapper.find('#display-delete');
    expect(button.exists()).toBe(true);

    await button.trigger('click');
    expect(spy).toHaveBeenCalled();
    expect(mockFunc).toHaveBeenCalled();
    wrapper.destroy();
  });

  test('onclick: #display-delete does nothing if user declines', async () => {
    const wrapper = mountAttachedWrapper();
    const spy = jest.spyOn(window, 'confirm').mockImplementation(() => false);
    const mockFunc = jest.fn();
    await wrapper.setProps({
      selectedAminoAcid: 1,
      onDeleteCodon: mockFunc
    });

    const button = wrapper.find('#display-delete');
    expect(button.exists()).toBe(true);

    await button.trigger('click');
    expect(spy).toHaveBeenCalled();
    expect(mockFunc).not.toHaveBeenCalled();
    wrapper.destroy();
  });

  test('onclick: #display-clear invokes prop function', async () => {
    const wrapper = mountAttachedWrapper();
    const mockFunc = jest.fn();
    await wrapper.setProps({ onClearLists: mockFunc });
    const button = wrapper.find('#display-clear');
    expect(button.exists()).toBe(true);

    await button.trigger('click');
    expect(mockFunc).toHaveBeenCalled();
    wrapper.destroy();
  });
});
