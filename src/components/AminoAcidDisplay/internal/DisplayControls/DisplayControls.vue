<template>
<section class='display-controls'>
  <div class='display-search'>
    <input
      @input="searchBoxValue = Number.parseInt($event.target.value)-1"
      id='search-box'
      type='number'
      min=1
      :max="chainLength"></input>
    <button
      @click="handleSelectButtonClick">{{ selectedAminoAcid !== null && selectedAminoAcid === searchBoxValue ? 'deselect' : 'select' }}</button>
  </div>
  <template v-if="selectedAminoAcid !== null" class='amino-acid-modify'>
    <button
      @click="toggleEditMode">toggle edit</button>
    <button
      @click="deleteCodon">delete</button>
  </template>
  <button
    @click="onClearLists"
    id='display-clear'>clear all</button>
</section>
</template>

<script lang='ts'>
function deleteCodon(this: any) : void {
  const result = window.confirm('Delete selected?');
  if (result) {
    this.onDeleteCodon();
  }
}

function handleSelectButtonClick(this: any) : void {
  if (this.selectedAminoAcid !== null && this.selectedAminoAcid === this.searchBoxValue) {
    this.unsetSelectedAminoAcid();
  }
  else {
    this.setSelectedAminoAcid();
  }
}

function setSelectedAminoAcid(this: any) : void {
  const input:HTMLInputElement = document.getElementById('search-box') as HTMLInputElement;
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const i = Number.parseInt(input.value) - 1;
  if (Number.isNaN(i) || i < 0 || i > this.chainLength-1) {
    return;
  }

  this.notifyParentSelectAminoAcid(i);
}

function toggleEditMode(this: any) : void {
  if (this.selectedAminoAcid === null) {
    return;
  }

  this.notifyParentToggleEditMode();
}

function unsetSelectedAminoAcid(this: any) :void {
  this.notifyParentDeselectAminoAcid();
}


export default {
  name: 'DisplayControls',
  data() {
    return {
      searchBoxValue: null
    };
  },
  props: {
    chainLength: {
      type: Number,
      required: true,
      default: 0
    },
    notifyParentDeselectAminoAcid: {
      type: Function,
      required: true
    },
    notifyParentSelectAminoAcid: {
      type: Function,
      required: true
    },
    notifyParentToggleEditMode: {
      type: Function,
      required: true
    },
    onDeleteCodon: {
      type: Function,
      required: true
    },
    onClearLists: {
      type: Function,
      required: true
    },
    selectedAminoAcid: {
      type: Number,
      required: false,
      default: null
    }
  },
  methods: {
    deleteCodon,
    handleSelectButtonClick,
    setSelectedAminoAcid,
    toggleEditMode,
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
.display-controls {
  flex-basis: 40%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  background: green;
  width: 8rem;
  align-self: flex-end;
}

#display-clear {
  font-size: 0.8em;
}
</style>
