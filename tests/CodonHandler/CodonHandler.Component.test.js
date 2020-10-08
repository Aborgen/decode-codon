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
