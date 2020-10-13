import { initWrapperGenerator, clearDOM } from 'tests/utils.js';
import ChainDisplay from 'components/AminoAcidDisplay/internal/ChainDisplay/ChainDisplay';

const props = {
  chain: [],
  chainType: ''
};

const { mountAttachedWrapper } = initWrapperGenerator(ChainDisplay, props);
describe('Reactive attributes based on props', () => {
  test('.chain-display has an id based on chainType prop', async () => {
    const wrapper = mountAttachedWrapper();
    const display = wrapper.find('.chain-display');
    expect(display.exists()).toBe(true);

    await wrapper.setProps({ chainType: 'test' });
    expect(display.attributes('id')).toBe('test-chain');
    wrapper.destroy();
  });

  test('A child of .chain-field gains .selected-amino-acid that corresponds to selectedAminoAcid prop', async () => {
    const wrapper = mountAttachedWrapper();
    await wrapper.setProps({ chain: [1, 2, 3] });
    const children = wrapper.findAll('.chain-field > *');
    expect(children.length).toEqual(3);

    const n = 1;
    await wrapper.setProps({ selectedAminoAcid: n });
    expect(children.at(n).attributes('class')).toBe('selected-amino-acid');
    wrapper.destroy();
  });
});

describe('Reactive attributes based on data', () => {
  test('.list-separator\'s value is set based on separator data field', async () => {
    const wrapper = mountAttachedWrapper();
    const list = wrapper.find('.list-separator');
    expect(list.exists()).toBe(true);
    expect(list.attributes('value')).toBe(wrapper.vm.selector);

    const nextSelector = list.find(':nth-child(2)');
    expect(nextSelector.exists()).toBe(true);
    await wrapper.setData({ separator: nextSelector.attributes('value') });
    expect(list.attributes('value')).toBe(wrapper.vm.selector);
    wrapper.destroy();
  });

  test('.chain-field contains text nodes with value equal to separator data field, when chain prop length > 1', async () => {
    const wrapper = mountAttachedWrapper();
    await wrapper.setProps({ chain: [1, 2] });

    const field = wrapper.find('.chain-field');
    expect(field.exists()).toBe(true);
    expect(field.html()).toMatch(new RegExp(wrapper.vm.field));
    wrapper.destroy();
  });
});

describe('Nodes generated using the v-for directive', () => {
  test('.chain-field has children based on chain prop', async () => {
    const chain = ['1', '2', '3'];
    const wrapper = mountAttachedWrapper();
    await wrapper.setProps({ chain });

    const children = wrapper.findAll('.chain-field > *');
    expect(children.length).toEqual(3);
    children.wrappers.forEach((child, i) => expect(child.text()).toBe(chain[i]))
    wrapper.destroy();
  });

  test('.chain-field has text inserted before all but the first child equal to separator data fieldm when chain prop length > 1', async () => {
    const chain = ['1', '2', '3'];
    const wrapper = mountAttachedWrapper();
    await wrapper.setProps({ chain });

    const field = wrapper.find('.chain-field');
    const re = new RegExp(`> *${wrapper.vm.separator}`, 'g');
    expect(field.exists()).toBe(true);
    expect(field.html().match(re).length).toEqual(chain.length - 1);
    wrapper.destroy();
  });

  test('.list-separator has children based on possibleSeparators data field', async () => {
    const wrapper = mountAttachedWrapper();
    const keys = Object.keys(wrapper.vm.possibleSeparators);

    const children = wrapper.findAll('.list-separator > *');
    expect(children.length).toEqual(keys.length);
    children.wrappers.forEach((child, i) => {
      expect(child.attributes('value')).toBe(keys[i]);
      expect(child.text()).toBe(wrapper.vm.possibleSeparators[keys[i]]);
    });

    wrapper.destroy();
  });
});
