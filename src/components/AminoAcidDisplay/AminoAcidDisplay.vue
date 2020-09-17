<template>
<div class='amino-acid-container'>
  <section class='chain-display'>
      <div class='chain-field' id='codon-field'>{{ codonChain.join(codonSeparator) }}</div>
      <button
        @click="copyCodonsToClipboard"
        class='copy-button'>copy</button>
      <select v-model="codonSeparator" name='codon separator'>
        <option v-for="[separator, description] in Object.entries(possibleSeparators)"
          :value="separator">{{ description }}</option>
      </select>
  </section>
  <section class='chain-display amino-acid-chain'>
      <div class='chain-field' id='amino-acid-field'>{{ aminoAcidChain.join(aminoAcidSeparator) }}</div>
      <button
        @click="copyAminoAcidsToClipboard"
        class='copy-button'>copy</button>
      <select v-model="aminoAcidSeparator" name='amino acid separator'>
        <option v-for="[separator, description] in Object.entries(possibleSeparators)"
          :value="separator">{{ description }}</option>
      </select>
  </section>
  <section class='amino-acid-controls'>
    <button
      @click="clearLists"
      id='amino-acid-clear'>clear all</button>
  </section>
</div>
</template>

<script lang='ts'>

// Not finalized... might not work in all instances. clipboard.js?
function copyToClipboard(target: HTMLDivElement) : void {
  if (!(target instanceof HTMLDivElement)) {
    return;
  }

  const textarea:HTMLTextAreaElement = document.createElement("textarea");
  document.body.appendChild(textarea);
  textarea.value = target.textContent as string;
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    console.log('Copied to clipboard');
  }
  catch (err) {
    console.log('Unable to copy');
  }
  finally {
    document.body.removeChild(textarea);
  }
}

function copyAminoAcidsToClipboard(this: any) {
  const target = document.querySelector('#amino-acid-field');
  this.copyToClipboard(target);
}

function copyCodonsToClipboard(this: any) {
  const target = document.querySelector('#codon-field');
  this.copyToClipboard(target);
}

function clearLists(this: any) : void {
  this.onClearLists();
}

export default {
  name: 'AminoAcidDisplay',
  data() {
    return {
      aminoAcidSeparator: '-',
      codonSeparator: '-',
      possibleSeparators: {
        '-' :'dash',
        ''  :'none',
        ' ' :'space',
        ',' :'comma',
        ', ':'comma space',
        '_' :'underscore'
      }
    };
  },
  props: {
    aminoAcidChain: {
      type: Array,
      required: true
    },
    onClearLists: {
      type: Function,
      required: true
    },
    codonChain: {
      type: Array,
      required: true
    }
  },
  methods: {
    clearLists,
    copyAminoAcidsToClipboard,
    copyCodonsToClipboard,
    copyToClipboard
  }
};
</script>

<style scoped>
.amino-acid-container {
  height: 15rem;
  max-width: 50rem;
  flex: 1 1 50%;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content:space-evenly;
  padding: 2rem;
}

.chain-display {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
  flex: 0 0 23%;
  background: green;
  font-family: monospace;
}

.chain-field {
  flex: 0 1 70%;
  background: #fff;
  height: 80%;
  border: 2px inset black;
  box-sizing: border-box;
  font-size: 0.7em;
  padding: 0;
  margin: 0;
  white-space: nowrap;
  overflow-x: scroll;
}

.chain-field >>> .selected-amino-acid {
  background: orange;
}

.copy-button {
  width: 4em;
  font-size: 0.7em;
  padding: 0;
  margin: 0;
}

.amino-acid-controls {
  flex-basis: 40%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  background: green;
  width: 8rem;
  align-self: flex-end;
}

#amino-acid-clear {
  font-size: 0.8em;
}

</style>
