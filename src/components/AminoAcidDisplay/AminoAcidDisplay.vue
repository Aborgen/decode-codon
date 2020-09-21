<template>
<div class='amino-acid-container'>
  <section class='chain-display'>
      <ol class='chain-field' id='codon-field'>
        <template v-for="(codon, i) in codonChain">
          <template v-if="i > 0">{{ codonSeparator }}</template>
          <li :class="{'selected-amino-acid':i === selectedAminoAcid}">{{ codon }}</li>
        </template>
      </ol>
      <button
        @click="copyCodonsToClipboard"
        class='copy-button'>copy</button>
      <select v-model="codonSeparator" name='codon separator'>
        <option v-for="[separator, description] in Object.entries(possibleSeparators)"
          :value="separator">{{ description }}</option>
      </select>
  </section>
  <section class='chain-display amino-acid-chain'>
      <ol class='chain-field' id='amino-acid-field'>
        <template v-for="(aminoAcid, i) in aminoAcidChain">
          <template v-if="i > 0">{{ aminoAcidSeparator }}</template>
          <li :class="{'selected-amino-acid':i === selectedAminoAcid}">{{ aminoAcid }}</li>
        </template>
      </ol>
      <button
        @click="copyAminoAcidsToClipboard"
        class='copy-button'>copy</button>
      <select v-model="aminoAcidSeparator" name='amino acid separator'>
        <option v-for="[separator, description] in Object.entries(possibleSeparators)"
          :value="separator">{{ description }}</option>
      </select>
  </section>
  <section class='amino-acid-controls'>
    <div class='amino-acid-search'>
      <input
        class='search-box'
        type='number'
        min=1
        :max="aminoAcidChain.length"></input>
      <button
        @click="setSelectedAminoAcid">select</button>
    </div>
    <button
      @click="clearLists"
      id='amino-acid-clear'>clear all</button>
  </section>
</div>
</template>

<script lang='ts'>
// Not finalized... might not work in all instances. clipboard.js?
function copyToClipboard(s: string) : void {
  const textarea:HTMLTextAreaElement = document.createElement("textarea");
  document.body.appendChild(textarea);
  textarea.value = s;
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
  const s:string = this.aminoAcidChain.join(this.aminoAcidSeparator);
  this.copyToClipboard(s);
}

function copyCodonsToClipboard(this: any) {
  const s:string = this.codonChain.join(this.codonSeparator);
  this.copyToClipboard(s);
}

function setSelectedAminoAcid(this: any) : void {
  const input:HTMLInputElement = document.querySelector('.search-box') as HTMLInputElement;
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const i = Number.parseInt(input.value) - 1;
  if (Number.isNaN(i) || i < 0 || i > this.aminoAcidChain.length-1) {
    return;
  }

  this.notifyParentSelectAminoAcid(i);
  this.$nextTick(() => this.scrollChains());
}

function unsetSelectedAminoAcid(this: any) :void {
  this.notifyParentDeselectAminoAcid();
}

function scrollChains(this: any) : void {
  document.querySelectorAll('.chain-field').forEach((field) => {
    const selectedChild = field.querySelector('.selected-amino-acid');
    if (selectedChild) {
      selectedChild.scrollIntoView(true);
    }
  });
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
        ',' :'comma',
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
    },
    selectedAminoAcid: {
      type: Number,
      default: null
    },
    notifyParentSelectAminoAcid: {
      type: Function,
      required: true
    },
    notifyParentDeselectAminoAcid: {
      type: Function,
      required: true
    }
  },
  methods: {
    clearLists,
    copyAminoAcidsToClipboard,
    copyCodonsToClipboard,
    copyToClipboard,
    scrollChains,
    setSelectedAminoAcid,
    unsetSelectedAminoAcid
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
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  height: 80%;
  border: 2px inset black;
  box-sizing: border-box;
  font-size: 0.7em;
  padding: 0;
  margin: 0;
  white-space: nowrap;
  overflow-x: scroll;
  list-style-type: none;
}

.chain-field li {
  display: inline;
}

.selected-amino-acid {
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
