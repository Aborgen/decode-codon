<template>
<div class='amino-acid-container'>
  <chain-display
    :chain="codonChain"
    :selected-amino-acid="selectedAminoAcid"
    chain-type="codon" />
  <chain-display
    :chain="aminoAcidChain"
    :selected-amino-acid="selectedAminoAcid"
    chain-type="amino-acid" />
  <section class='amino-acid-controls'>
    <div class='amino-acid-search'>
      <input
        @input="searchBoxValue = Number.parseInt($event.target.value)-1"
        id='search-box'
        type='number'
        min=1
        :max="aminoAcidChain.length"></input>
      <button
        @click="selectedAminoAcid !== searchBoxValue ? setSelectedAminoAcid() : unsetSelectedAminoAcid()">{{ selectedAminoAcid !== searchBoxValue ? 'select' : 'deselect' }}</button>
    </div>
    <template v-if="selectedAminoAcid !== null" class='amino-acid-modify'>
      <button
        @click="toggleEditMode">toggle edit</button>
      <button
        @click="deleteCodon">delete</button>
    </template>
    <button
      @click="clearLists"
      id='amino-acid-clear'>clear all</button>
  </section>
</div>
</template>

<script lang='ts'>
import ChainDisplay from './internal/ChainDisplay/ChainDisplay.vue';

function setSelectedAminoAcid(this: any) : void {
  const input:HTMLInputElement = document.getElementById('search-box') as HTMLInputElement;
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

function toggleEditMode(this: any) : void {
  if (this.selectedAminoAcid === null) {
    return;
  }

  this.notifyParentToggleEditMode();
}

function deleteCodon(this: any) : void {
  const result = window.confirm(`Delete selected? [ ${this.codonChain[this.selectedAminoAcid]} <--> ${this.aminoAcidChain[this.selectedAminoAcid]} ]`);
  if (result) {
    this.onDeleteCodon();
  }
}

function clearLists(this: any) : void {
  this.onClearLists();
}

export default {
  name: 'AminoAcidDisplay',
  components: {
    ChainDisplay
  },
  data() {
    return {
      searchBoxValue: ''
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
    onDeleteCodon: {
      type: Function,
      required: true
    },
    codonChain: {
      type: Array,
      required: true
    },
    selectedAminoAcid: {
      type: Number,
      required: false,
      default: null
    },
    notifyParentToggleEditMode: {
      type: Function,
      required: true
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
    deleteCodon,
    toggleEditMode,
    scrollChains,
    setSelectedAminoAcid,
    unsetSelectedAminoAcid
  },
  watch: {
    selectedAminoAcid: {
      immediate: true,
      handler: function(val: number, oldVal: number) : void {
        if (val === null) {
          const selectInput:HTMLInputElement = document.getElementById('search-box') as HTMLInputElement;
          if (!(selectInput instanceof HTMLInputElement)) {
            return;
          }

          selectInput.value = '';
        }
      }
    }
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
