<template>
<div class='codon-handler'>
  <header class='codon-instruction'>Codon Insertion</header>
  <section class='amino-acid-choices'>
    <ul>
      <li v-for="aminoAcid in possibleAminoAcids"
        class='amino-acid-option'>{{ aminoAcid }}</li>
    </ul>
  </section>
  <section class='base-display'>
    <input required v-for="n in 3"
      @click="selectedInput($event.target)"
      @blur="maybeResetSelectedInput"
      @input="selectBaseByTextInsertion"
      :id="'base-'+n"
      :data-base-id="n"
      class='base-insert'
      pattern='[uUcCaAgG]{1}'
      maxlength=1></input>
  </section>
  <section class='base-action'>
    <div class='base-button-group'>
      <button v-for="base in ['U', 'C', 'A', 'G']"
        @mousedown="lockBaseInputBlur"
        @touchstart="lockBaseInputBlur"
        @click="selectBaseByButton"
        :data-base-value="base"
        class='base-button'>{{ base }}</button>
    </div>
    <div class='base-options-group'>
      <button
        @click="maybeSubmitCodon"
        class='codon-commit'>commit</button>
      <button
        @click="toggleMode"
        :class="{'codon-mode-auto': isModeAuto()}"
        class='codon-mode-toggle'>auto</button>
      <button
        @click="resetInputs"
        class='codon-clear'>x</button>
    </div>
  </section>
</div>
</template>

<script lang='ts'>
import { Codon } from 'types/Codon.ts';
import CodonTable from 'data/CodonTable.ts';

enum EMode {
  AUTO,
  MANUAL
}

// Keeping track of the currently selected input allows the user to click on an input, and then change it by clicking one of the buttons
function selectedInput(this: any, input: HTMLInputElement) : void {
  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  this.currentlySelectedInput = input;
  input.select();
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

  this.currentlySelectedInput = null;
}

function isModeAuto(this: any) : boolean {
  return this.mode === EMode.AUTO;
}

function toggleMode(this: any) : void {
  if (this.mode === EMode.AUTO) {
    this.mode = EMode.MANUAL;
  }
  else {
    this.mode = EMode.AUTO;
  }
}

function maybeSubmitCodon(this: any) : void {
  let codon:string = '';
  for (let [_, base] of Object.entries(this.bases)) {
    // Only submit codon when all three have been input
    if (base === '') {
      return;
    }

    codon += base;
  }

  this.onCodonSubmit(codon);
  this.resetInputs();
  this.maybeResetSelectedInput();
} 

function updateAminoAcid(this: any) : void {
  let bases:string = '';
  for (let [i, base] of Object.entries(this.bases)) {
    if (typeof base !== 'string') {
      throw `Garbage value found in base ${i}: ${base}`;
    }

    bases += base;
  }

  const idx = bases.length;
  if (idx === 0) {
    return;
  }

  this.possibleAminoAcids = CodonTable[idx][bases];
}

function resetInputs(this: any) : void {
  const inputs:NodeListOf<HTMLInputElement> = document.querySelectorAll('.base-insert');
  inputs.forEach((input:HTMLInputElement) => {
    input.value = '';
    if (typeof input.dataset.baseId !== 'string') {
      throw 'We\'ve got series problems... data-base-id has somehow been unset';
    }
  
    this.bases[input.dataset.baseId] = '';
  });

  this.possibleAminoAcids = [];
}

function getNextEmptyInput(this: any) : HTMLInputElement | null {
  const inputs:NodeListOf<HTMLInputElement> = document.querySelectorAll('.base-insert');
  if (!inputs) {
    return null;
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
  else if (typeof base !== 'string' || !(/^[UCAG]{1}$/.test(base))) {
    throw `base input incorrect: {${base}} should be either U, C, A, or G`;
  }

  this.bases[baseId] = base;
  this.updateAminoAcid();
}

function selectBaseByTextInsertion(this: any, e: KeyboardEvent) : void {
  if (!(e.target instanceof HTMLInputElement)) {
    return;
  }
  else if (e.target.validity.patternMismatch) {
    // animateShake();
    this.selectedInput(e.target);
    return;
  }

  e.target.value = e.target.value.toUpperCase();
  this.pushBase(e.target.dataset.baseId, e.target.value);
  this.maybeSubmitCodon();
  const nextInput:HTMLInputElement = this.getNextEmptyInput();
  if (!nextInput) {
    return;
  }

  this.selectedInput(nextInput);
}

function selectBaseByButton (this: any, e: MouseEvent) : void {
  if (!(e.target instanceof HTMLButtonElement)) {
    return;
  }

  let nextInput:HTMLInputElement = this.currentlySelectedInput || this.getNextEmptyInput();
  if (!nextInput) {
    return;
  }

  nextInput.value = e.target.dataset.baseValue as string;
  this.pushBase(nextInput.dataset.baseId, nextInput.value);
  if (this.mode === EMode.AUTO) {
    this.maybeSubmitCodon();
  }

  // this.lockBaseInputBlur is invoked during the value button's mousedown and touchstart events
  this.unlockBaseInputBlur();
  nextInput = this.getNextEmptyInput();
  if (!nextInput) {
    return;
  }

  this.selectedInput(nextInput);
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
      currentlySelectedInput: null,
      mode: EMode.MANUAL,
      possibleAminoAcids: []
    };
  },
  methods: {
    getNextEmptyInput,
    isModeAuto,
    lockBaseInputBlur,
    maybeSubmitCodon,
    pushBase,
    maybeResetSelectedInput,
    resetInputs,
    selectBaseByButton,
    selectBaseByTextInsertion,
    selectedInput,
    toggleMode,
    unlockBaseInputBlur,
    updateAminoAcid,
  },
  props: {
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
  background: #3571a614;
  font-size: inherit;
  text-align: center;
}

.base-action {
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: space-around;
  background: #3571a638;
  margin-top: 1rem;
  border-width: 0 0.5rem;
  border-style: ridge;
  border-color: #b3dbff;
  border-radius: 0.1rem;
  box-sizing: border-box;
}

.base-button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.base-button {
  width: 3.3rem;
  height: 4rem;
  text-align: center;
  line-height: 4rem;
  padding: 0;
  font-size: 2rem;
}

.base-options-group {
  display: flex;
  align-items: center;
  justify-content: center;
}

.codon-commit {
  height: 3rem;
  width: 6rem;
}

.codon-mode-toggle {
  height: 3rem;
  width: 6rem;
}

.codon-mode-auto {
  background: grey;
  border: 3px double #eaff85;
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
</style>
