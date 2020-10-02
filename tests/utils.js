import { mount } from '@vue/test-utils';

function clearDOM() {
  document.getElementsByTagName('html')[0].innerHTML = '';
}

function generateWrapper(component, props) {
  return (root = null) => mount(component, {
    propsData: props,
    attachTo: root
  }); 
}

// If this function is used, it is necessary to use clearDOM() after each test
function mountAttachedWrapper(generator) {
  return () => {
    const id = 'root';
    if (document.getElementById(id)) {
      throw 'Duplicate root node: please use clearDOM after each test';
    }

    const root = document.createElement('div');
    root.id = id;
    document.body.appendChild(root);
    return generator(`#${id}`);
  };
}

function mountWrapper(generator) {
  return () => generator();
}

function initWrapperGenerator(component, props) {
  const generator = generateWrapper(component, props);
  const attached = mountAttachedWrapper(generator);
  const unattached = mountWrapper(generator);
  return {
    'generateWrapper': generator,
    'mountAttachedWrapper': attached,
    'mountWrapper': unattached
  };
}

export {
  clearDOM,
  initWrapperGenerator
};
