<template>
<div class='amino-acid-container'>
  <section class='chain-display codon-chain'>
      <textarea v-model="codonChain.join(codonSeparator)" id='codon-field' cols='1' rows='1' readonly></textarea>
      <button
        @click="copyCodonsToClipboard"
        class='copy-button'>copy</button>
      <select v-model="codonSeparator" name='codon separator'>
        <option v-for="[separator, description] in Object.entries(possibleSeparators)"
          :value="separator">{{ description }}</option>
      </select>
  </section>
  <section class='chain-display amino-acid-chain'>
      <textarea v-model="aminoAcidChain.join(aminoAcidSeparator)" id='amino-acid-field' cols='1' rows='1' readonly></textarea>
      <button
        @click="copyAminoAcidsToClipboard"
        class='copy-button'>copy</button>
      <select v-model="aminoAcidSeparator" name='amino acid separator'>
        <option v-for="[separator, description] in Object.entries(possibleSeparators)"
          :value="separator">{{ description }}</option>
      </select>
  </section>
  <section class='chain-display extra'></section>
</div>
</template>

<script lang='ts'>
// Not finalized... might not work in all instances. clipboard.js?
function copyToClipboard(target: HTMLTextAreaElement) : void {
  if (!(target instanceof HTMLTextAreaElement)) {
    return;
  }

  target.focus();
  target.select();
  try {
    document.execCommand('copy');
    console.log('Copied to clipboard');
  }
  catch (err) {
    console.log('Unable to copy');
  }
}

function copyAminoAcidsToClipboard(this: any) {
  const target = document.querySelector('#amino-acid-field');
  this.copyToClipboard(target);
}

function copyCodonsToClipboard(this: any) {
  const target = document.querySelector('#codon-field');
  this.copyToClipboard(target);
  console.log(this.codonSeparator);
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
    codonChain: {
      type: Array,
      required: true
    }
  },
  methods: {
    copyAminoAcidsToClipboard,
    copyCodonsToClipboard,
    copyToClipboard
  }
};
</script>

<style scoped>
.amino-acid-container {
  height: 15rem;
  flex-basis: 50%;
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
  flex-basis: 23%;
  background: green;
}

.chain-display textarea {
  flex-basis: 70%;
  background: white;
  color: black;
  height: 80%;
  border: 2px inset black;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  resize: none;
  font-size: 0.7em;
  white-space: nowrap;
}

.copy-button {
  width: 4em;
  font-size: 0.7em;
  padding: 0;
  margin: 0;
}
</style>
