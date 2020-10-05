<template>
<section class='display-controls'>
  <div class='display-search'>
    <input
      @input="searchBoxValue = Number.parseInt($event.target.value)-1"
      @keyup.enter="handleKeyboardSelect($event.target)"
      id='search-box'
      type='number'
      min=1
      :max="chainLength"></input>
    <button
      @click="handleSelectButtonClick">{{ selectedAminoAcid !== null && selectedAminoAcid === searchBoxValue ? 'deselect' : 'select' }}</button>
  </div>
  <div class='display-modify'>
    <template v-if="selectedAminoAcid !== null" class='amino-acid-modify'>
      <button
        @click="toggleEditMode">toggle edit</button>
      <button
        @click="deleteCodon">delete</button>
    </template>
    <button
      @click="onClearLists"
      id='display-clear'>clear all</button>
  </div>
</section>
</template>

<script lang='ts'>
function deleteCodon(this: any) : void {
  const result = window.confirm('Delete selected?');
  if (result) {
    this.onDeleteCodon();
  }
}

// If user inputs a number less than 1 when there is at least one element in chain, then the number is replaced with 1.
// If user inputs a number > chainLength, it is replaced with chainLength.
function handleKeyboardSelect(this: any, target: HTMLInputElement) : void {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (!target.validity.valid) {
    if (target.validity.rangeUnderflow) {
      target.value = target.min;
    }
    else if (target.validity.rangeOverflow) {
      target.value = target.max;
    }

    target.dispatchEvent(new Event('input'));
  }
  else if (this.selectedAminoAcid !== Number.parseInt(target.value)-1) {
    this.setSelectedAminoAcid();
    target.blur();
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
    throw 'Either DOM is not loaded, or some structure has changed: Missing input element with id #search-box';
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
      required: false,
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
    handleKeyboardSelect,
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
  flex: 0 0 40%;
  display: flex;
  width: 60%;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-end;
  background: green;
  align-self: flex-end;
}

.display-search {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
}

#search-box {
  width: 4em;
}

#display-clear {
  
}
</style>
