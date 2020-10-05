import { initWrapperGenerator } from 'tests/utils.js';
import ChainDisplay from 'components/AminoAcidDisplay/internal/ChainDisplay/ChainDisplay';
const props = {
  chain: [],
  chainType: ''
};

const { mountWrapper } = initWrapperGenerator(ChainDisplay, props);
describe('ChainDisplay unit tests', () => {
  test('copyToClipboard is presumed to be successful if it does not throw', () => {
    const wrapper = mountWrapper();
    const result = () => wrapper.vm.copyToClipboard;
    expect(result).not.toThrow();
  });
});
