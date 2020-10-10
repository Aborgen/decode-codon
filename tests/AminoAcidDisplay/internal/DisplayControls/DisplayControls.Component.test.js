import { initWrapperGenerator, clearDOM } from 'tests/utils.js';
import DisplayControls from 'components/AminoAcidDisplay/internal/DisplayControls/DisplayControls';

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
  });
});

describe('Test native events', () => {
  test('input: #search-box sets searchBoxValue data field to value of #search-box - 1', async () => {
    const n = 1;
    const wrapper = mountAttachedWrapper();
    const search = wrapper.find('#search-box');
    search.element.value = `${n}`;

    await search.trigger('input');
    expect(wrapper.vm.searchBoxValue).toBe(n-1);
  });
});
