<template> <div 
  :class="{'edit-mode': editMode}"
  class='codon-handler'>
  <header class='codon-instruction'>{{ editMode ? 'Edit Codon' : 'Codon Insertion' }}</header>
  <section class='amino-acid-choices'>
    <ul>
      <li v-for="aminoAcid in possibleAminoAcids"
        class='amino-acid-option'>{{ aminoAcid }}</li>
    </ul>
  </section>
  <section class='base-display'>
    <input required v-for="n in 3"
      @click="setSelectedInput($event.target)"
      @blur="maybeResetSelectedInput"
      @input="selectBaseByTextInsertion($event.target)"
      :id="'base-'+n"
      :data-base-id="n"
      :class="{ 'selected-base': currentlySelectedInput && currentlySelectedInput.dataset['baseId'] == n }"
      class='base-insert'
      pattern='[uUcCaAgG]{1}'
      maxlength=1></input>
  </section>
  <section class='base-action'>
    <div class='base-button-group'>
      <button v-for="base in ['U', 'C', 'A', 'G']"
        @mousedown="lockBaseInputBlur"
        @click="selectBaseByButton($event.target)"
        :data-base-value="base"
        class='base-button'>{{ base }}</button>
    </div>
    <div class='base-options-group'>
      <button
        @click="editMode ? editCodon() : maybeSubmitCodon()"
        :disabled="isModeAuto() && !editMode"
        class='codon-commit'>commit</button>
      <button
        @click="toggleMode"
        :class="{'codon-mode-auto': !editMode && isModeAuto()}"
        :disabled="editMode"
        class='codon-mode-toggle'>auto</button>
      <button
        @click="resetState"
        class='codon-clear'>x</button>
    </div>
  </section>
</div>
</template>

<script lang='ts'>
import { Codon } from 'types/Codon.ts';
import CodonTable from 'data/CodonTable.js';

enum EMode {
  MANUAL,
  AUTO
}

enum EInsert {
  BUTTON,
  KEYBOARD
}

// Keeping track of the currently selected input allows the user to click on an input, and then set its value by clicking one of the buttons
function setSelectedInput(this: any, input: HTMLInputElement | null, insertType: EInsert = EInsert.KEYBOARD) : void {
  this.previousInsertType = insertType;
  if (input === null) {
    this.currentlySelectedInput = input;
    return;
  }
  else if (!(input instanceof HTMLInputElement)) {
    throw 'Can only select input elements!';
  }

  // Prevents blur event callback on input elements
  this.lockBaseInputBlur();
  {
    this.currentlySelectedInput = input;
    if (insertType === EInsert.KEYBOARD) {
      input.focus();
      input.select();
    }
  }
  this.unlockBaseInputBlur();
}

function lockBaseInputBlur(this: any) : void {
  this.blurLocked = true;
}

function unlockBaseInputBlur(this: any) : void {
  this.blurLocked = false;
}

function maybeResetSelectedInput(this: any) : void {
  if (this.blurLocked) {
    return;
  }

  this.lockBaseInputBlur();
  {
    this.setSelectedInput(this.getNextEmptyInput(), this.previousInsertType);
  }
  this.unlockBaseInputBlur();
}

function isModeAuto(this: any) : boolean {
  return this.mode === EMode.AUTO;
}

function toggleMode(this: any) : void {
  if (this.mode === EMode.AUTO) {
    this.mode = EMode.MANUAL;
  }
  else {
    this.maybeSubmitCodon();
    this.mode = EMode.AUTO;
  }
}

function collectBases(this: any) : string | null {
  let codon:string = '';
  for (let [_, base] of Object.entries(this.bases)) {
    // Only submit codon when all three have been input
    if (base === '') {
      return null;
    }

    codon += base;
  }

  return codon;
}

function maybeSubmitCodon(this: any) : void {
  if (this.editMode) {
    throw 'Cannot submit a codon when editMode is true';
  }

  const codon:string = this.collectBases();
  if (codon === null) {
    return;
  }

  this.onCodonSubmit(codon);
  this.resetState();
} 

function editCodon(this: any) : void {
  if (!this.editMode) {
    throw 'Cannot edit a codon when editMode is false';
  }

  const codon:string = this.collectBases();
  if (codon === null) {
    return;
  }

  this.onCodonEdit(codon);
  this.resetState();
  this.notifyParentToggleEditMode();
}

function updateAminoAcids(this: any) : void {
  let bases:string = '';
  let hasEmptyInput:boolean = false;
  for (let [i, base] of Object.entries(this.bases)) {
    if (typeof base !== 'string') {
      throw `Garbage value found in base ${i}: ${base}`;
    }
    else if (base === '') {
      hasEmptyInput = true;
    }
    // There cannot be gaps in the inputs: e.g. A _ G, _ _ A, _ C U.
    // Valid patterns are: A _ _, U A _, U A G, _ _ _
    else if (hasEmptyInput && base !== '') {
      this.possibleAminoAcids = ['?'];
      return;
    }

    bases += base;
  }

  const idx = bases.length;
  if (idx === 0) {
    return;
  }

  // @ts-ignore
  this.possibleAminoAcids = CodonTable[idx][bases];
}

function resetState(this: any) : void {
  const inputs:NodeListOf<HTMLInputElement> = document.querySelectorAll('.base-insert');
  inputs.forEach((input:HTMLInputElement) => {
    input.value = '';
    if (typeof input.dataset.baseId !== 'string') {
      throw 'We\'ve got series problems... data-base-id has somehow been unset';
    }
  
    this.bases[input.dataset.baseId] = '';
  });

  this.possibleAminoAcids = [];
  this.maybeResetSelectedInput();
}

function getNextEmptyInput(this: any) : HTMLInputElement | null {
  const inputs:NodeListOf<HTMLInputElement> = document.querySelectorAll('.base-insert');
  if (!inputs) {
    throw 'Either DOM is not loaded, or some structure has changed: Missing input elements with class .base-insert';
  }

  let nextInput:HTMLInputElement | null = null;
  for (let i = 0; i < inputs.length; ++i) {
    if (inputs[i].value === '' || inputs[i].validity.patternMismatch) {
      nextInput = inputs[i];
      break;
    }
  }

  return nextInput;
}

function pushBase(this: any, baseId: string, base: string) : void {
  if (typeof baseId !== 'string' || !(/^[1-3]{1}$/.test(baseId))) {
    throw 'baseId has been corrupted:\nElement === ${e.target} Accepted numbers in dataset.baseId === [1,2,3]';
  }
  else if (typeof base !== 'string' || !(base === '' || /^[UCAG]{1}$/.test(base))) {
    throw `base input incorrect: {${base}} should be either U, C, A, or G`;
  }

  this.bases[baseId] = base;
  this.updateAminoAcids();
}

function selectBaseByTextInsertion(this: any, target: HTMLInputElement) : void {
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  else if (target.validity.patternMismatch) {
    this.setSelectedInput(target, EInsert.KEYBOARD);
    if (typeof target.dataset.baseId === 'string' && this.bases[target.dataset.baseId]) {
      this.bases[target.dataset.baseId] = '';
      this.updateAminoAcids();
    }

    return;
  }

  target.value = target.value.toUpperCase();
  this.pushBase(target.dataset.baseId, target.value);
  if (!this.editMode && this.mode === EMode.AUTO) {
    this.maybeSubmitCodon();
  }

  this.setSelectedInput(this.getNextEmptyInput(), EInsert.KEYBOARD);
}

function selectBaseByButton (this: any, target: HTMLButtonElement) : void {
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  // this.lockBaseInputBlur is invoked during the target button's mousedown events
  this.unlockBaseInputBlur();
  let nextInput:HTMLInputElement = this.currentlySelectedInput || this.getNextEmptyInput();
  if (!nextInput) {
    return;
  }

  nextInput.value = target.dataset.baseValue as string;
  this.pushBase(nextInput.dataset.baseId, nextInput.value);
  if (!this.editMode && this.mode === EMode.AUTO) {
    this.maybeSubmitCodon();
  }

  this.setSelectedInput(this.getNextEmptyInput(), EInsert.BUTTON);
}

export default {
  name: 'CodonHandler',
  data() {
    return {
      bases: {
        '1': '',
        '2': '',
        '3': ''
      },
      blurLocked: false,
      currentlySelectedInput: null,
      mode: EMode.MANUAL,
      possibleAminoAcids: [],
      previousInsertType: EInsert.KEYBOARD
    };
  },
  methods: {
    collectBases,
    editCodon,
    getNextEmptyInput,
    isModeAuto,
    lockBaseInputBlur,
    maybeSubmitCodon,
    pushBase,
    maybeResetSelectedInput,
    resetState,
    selectBaseByButton,
    selectBaseByTextInsertion,
    setSelectedInput,
    toggleMode,
    unlockBaseInputBlur,
    updateAminoAcids,
  },
  props: {
    editMode: {
      type: Boolean,
      required: true
    },
    notifyParentToggleEditMode: {
      type: Function,
      required: true
    },
    onCodonEdit: {
      type: Function,
      required: true
    },
    onCodonSubmit: {
      type: Function,
      required: true
    }
  }
};
</script>

<style>

.codon-handler {
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  border: 0.25rem dashed #000;
  border-radius: 0 0 0.8rem 0;
  padding: 0.5rem;
  box-sizing: border-box;
}

.codon-instruction {
  text-align: center;
}

.base-display {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  font-size: 1.8rem;
}

.base-insert {
  height: 3rem;
  width: 3rem;
  background: #9dbfdd;
  font-size: inherit;
  text-align: center;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.base-insert:valid {
  border: 3px solid #000;
}
.base-insert:invalid {
  border: 2px solid #ae0736;
  box-shadow: none; /* Firefox adds default styling here */
}

.base-action {
  background: #9dbfdd;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: space-around;
  margin-top: 1rem;
  box-sizing: border-box;
}

.base-button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  touch-action: manipulation;
}

.base-button {
  width: 3.3rem;
  height: 4rem;
  text-align: center;
  line-height: 4rem;
  padding: 0;
  font-size: 2rem;
  border-radius: 0.09em;
}

.base-options-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.base-options-group button {
  height: 3rem;
  width: 6rem;
  font-size: 1rem;
}

.codon-clear {
  width: 2rem !important;
  text-align: center;
  font-size: 0.7em;
  padding: 0.3em;
  font-weight: bold;
}

.codon-mode-auto {
  background: #524f60ad;
  border: 2px double #fbe63a;
}

.amino-acid-choices {
  min-height: 1.6em;
  padding: 0.3em;
  padding-top: 0;
  margin: 0;
}

.amino-acid-choices ul {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  font-size: 0.6em;
  margin: 0;
  padding: 0;
}

.amino-acid-option {
  flex: 25%;
  max-width: 6em;
  background: orange;
  display: inline-block;
  border-radius: 5rem;
  text-align: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.edit-mode {
  background: #7cff7c9c;
}

.selected-base {
  background: #d0e1df;
}
</style>
