<template>
<div class='app'>
  <div class='app-container'>
    <amino-acid-display
      :amino-acid-chain="aminoAcidData.getAllAminoAcids()"
      :codon-chain="aminoAcidData.getAllCodons()"
      :on-clear-lists="clearAminoAcidData"
      :on-delete-codon="deleteCodon"
      :selected-amino-acid="selectedAminoAcid"
      :notify-parent-toggle-edit-mode="toggleEditMode"
      :notify-parent-select-amino-acid="selectAminoAcid"
      :notify-parent-deselect-amino-acid="deselectAminoAcid"
    />
    <codon-handler
      :edit-mode="editMode"
      :on-codon-edit="editCodon"
      :on-codon-submit="pushCodon"
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
  // Ideally, there is no way for this to happen
  if (this.editMode) {
    throw 'Cannot submit a new codon while in edit mode!'
  }
  else if (this.selectedAminoAcid !== null) {
    this.aminoAcidData.insertCodon(this.selectedAminoAcid, codon);
  }
  else {
    this.aminoAcidData.pushCodon(codon);
  }
}

function editCodon(this: any, codon: string) : void {
  if (!this.editMode) {
    throw 'A codon cannot be edited until editMode has been set to true';
  }
  else if (this.selectedAminoAcid === null) {
    throw 'Cannot edit a codon when no codon has been selected!';
  }

  this.aminoAcidData.setCodon(this.selectedAminoAcid, codon);
}

function deleteCodon(this: any) : void {
  if (this.editMode) {
    this.toggleEditMode();
  }

  if (this.selectedAminoAcid === null) {
    throw 'Cannot delete a codon if no codon has been selected!';
  }

  this.aminoAcidData.deleteCodon(this.selectedAminoAcid);
  this.selectedAminoAcid = null;
}

function clearAminoAcidData(this: any) : void {
  if (this.editMode) {
    this.toggleEditMode();
  }

  this.aminoAcidData.clearLists();
  this.deselectAminoAcid();
}

function selectAminoAcid(this: any, i: number) : void {
  if (typeof i !== 'number') {
    throw `Cannot accept ${i}, as it is not a number, but of type ${typeof i}`;
  }
  else if (i < 0 || i >= this.aminoAcidData.length()) {
    throw RangeError(`Index ${i} is not within range [0, ${this.aminoAcidData.length()}] (inclusive)`);
  }

  this.selectedAminoAcid = i;
  this.$nextTick(() => this.scrollChains());
}

function scrollChains(this: any) : void {
  document.querySelectorAll('.chain-field').forEach((field) => {
    const selectedChild = field.querySelector('.selected-amino-acid');
    if (selectedChild) {
      selectedChild.scrollIntoView(true);
    }
  });
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
    deleteCodon,
    deselectAminoAcid,
    editCodon,
    toggleEditMode,
    pushCodon,
    scrollChains,
    selectAminoAcid
  }
};
</script>

<style>
html, body {
  background: #c0d3e3;
  margin: 0;
  padding: 0;
  font-size: 19px;
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
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  margin-top: 0; 
}

@media (min-width: 330px) {
  .app-container {
    margin-top: 0;
  }
}
@media (min-width: 550px) {
  .app-container {
    margin-top: 2em;
  }
}
@media (min-width: 992px) {
  .app-container {
    margin-top: 4em;
  }
}
@media (min-width: 1200px) {
  .app-container {
    margin-top: 3em;
  }
}
</style>
