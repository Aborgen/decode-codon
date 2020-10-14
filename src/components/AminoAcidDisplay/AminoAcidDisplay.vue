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
  <display-controls
    :chain-length="aminoAcidChain.length"
    :notify-parent-deselect-amino-acid="notifyParentDeselectAminoAcid"
    :notify-parent-select-amino-acid="notifyParentSelectAminoAcid"
    :notify-parent-toggle-edit-mode="notifyParentToggleEditMode"
    :on-clear-lists="onClearLists"
    :on-delete-codon="onDeleteCodon"
    :selected-amino-acid="selectedAminoAcid" />
</div>
</template>

<script lang='ts'>
import ChainDisplay from './internal/ChainDisplay/ChainDisplay.vue';
import DisplayControls from './internal/DisplayControls/DisplayControls.vue';

export default {
  name: 'AminoAcidDisplay',
  components: {
    ChainDisplay,
    DisplayControls
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
  }
};
</script>

<style scoped>
.amino-acid-container {
  height: 15rem;
  max-width: 16rem;
  flex: 1 1 50%;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content:space-evenly;
  padding: 1%;
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

@media (min-width: 330px) {
  .amino-acid-container {
    max-width: 16rem;
  }
}
@media (min-width: 550px) {
  .amino-acid-container {
    max-width: 27rem;
  }
}
@media (min-width: 768px) {
  .amino-acid-container {
    max-width: 40rem;
  }
}
@media (min-width: 992px) {
  .amino-acid-container {
    max-width: 50rem;
  }
}
@media (min-width: 1200px) {
  .amino-acid-container {
    max-width: 50rem;
  }
}
</style>
