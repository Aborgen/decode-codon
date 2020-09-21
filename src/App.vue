<template>
<div class='app'>
  <div class='app-container'>
    <amino-acid-display
      :amino-acid-chain="aminoAcidData.getAllAminoAcids()"
      :codon-chain="aminoAcidData.getAllCodons()"
      :on-clear-lists="clearAminoAcidData"
      :selected-amino-acid="selectedAminoAcid"
      :notify-parent-toggle-edit-mode="toggleEditMode"
      :notify-parent-select-amino-acid="selectAminoAcid"
      :notify-parent-deselect-amino-acid="deselectAminoAcid"
    />
    <codon-handler
      :edit-mode="editMode"
      :on-codon-edit="editCodon"
      :on-codon-submit="pushCodon"
      :notify-parent-deselect-amino-acid="deselectAminoAcid"
      :notify-parent-toggle-edit-mode="toggleEditMode"
    />
  </div>
</div>
</template>

<script lang='ts'>
import AminoAcidData from 'types/AminoAcidData.ts';
import AminoAcidDisplay from 'components/AminoAcidDisplay/AminoAcidDisplay.vue';
import CodonHandler from 'components/CodonHandler/CodonHandler.vue';

function pushCodon(this: any, codon: any) : void {
  this.aminoAcidData.pushCodon(codon);
}

function editCodon(this: any, codon: string) : void {
  this.aminoAcidData.setCodon(this.selectedAminoAcid, codon);
}

function clearAminoAcidData(this: any) : void {
  this.aminoAcidData.clearLists();
}

function selectAminoAcid(this: any, i: number) : void {
  if (typeof i !== 'number' || i < 0) {
    throw `Cannot accept ${i}, as it is not a number, but of type ${typeof i}`;
  }

  this.selectedAminoAcid = i;
}

function deselectAminoAcid(this: any) : void {
  this.selectedAminoAcid = null;
}

function toggleEditMode(this: any) : void {
  this.editMode = !this.editMode;
}

export default {
  name: 'app',
  data() {
    return {
      aminoAcidData: new AminoAcidData(),
      editMode: false,
      selectedAminoAcid: null
    }
  },
  components: {
    AminoAcidDisplay,
    CodonHandler
  },
  methods: {
    clearAminoAcidData,
    deselectAminoAcid,
    editCodon,
    toggleEditMode,
    pushCodon,
    selectAminoAcid
  }
};
</script>

<style>
html, body {
  background: #3571a638;
  margin: 0;
  padding: 0;
}

.app {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin: 0;
  padding: 0;
}

.app-container {
  flex: 0 0 70%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
</style>
