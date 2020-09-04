<template>
<div class='codon-handler'>
  <header class='codon-instruction'>Codon Insertion</header>
  <span class='codon-pad'>- - -</span>
  <section class='base-display'>
    <input required v-for="n in 3"
      @click="$event.target.select()"
      @input="selectBaseByTextInsertion"
      :id="'base-'+n"
      :data-base-id="n"
      class='base-insert'
      pattern='[uUcCaAgG]{1}'
      maxlength=1></input>
  </section>
  <section class='base-action'>
    <button v-for="base in ['U', 'C', 'A', 'G']"
      @click="selectBaseByButton"
      :data-base-value="base"
      class='base-button'>{{ base }}</button>
  </section>
</div>
</template>

<script lang='ts'>
import { Codon } from 'types/Codon.ts';

function maybeSubmitCodon(this: any) : void {
  let codon:Codon = "";
  for (let [_, base] of Object.entries(this.bases)) {
    // Only submit bases when all three have been input
    if (base === "") {
      return;
    }

    codon += base;
  }

  this.onCodonSubmit(codon);
  this.resetInputs();
} 

function resetInputs(this: any) : void {
  const inputs:NodeListOf<HTMLInputElement> = document.querySelectorAll('.base-insert');
  inputs.forEach((input:HTMLInputElement) => {
    input.value = "";
    if (typeof input.dataset.baseId !== 'string') {
      throw 'We\'ve got series problems... data-base-id has somehow been unset';
    }
  
    this.bases[input.dataset.baseId] = "";
  });
}

function getNextEmptyInput(this: any) : HTMLInputElement | null {
  const inputs:NodeListOf<HTMLInputElement> = document.querySelectorAll('.base-insert');
  if (!inputs) {
    return null;
  }

  let nextInput:HTMLInputElement = inputs[0];
  for (let i = 0; i < inputs.length; ++i) {
    if (inputs[i].value === "" || inputs[i].validity.patternMismatch) {
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
  else if (typeof base !== 'string') {
    throw `base input incorrect: {${base}} should be either U, C, A, or G`;
  }

  this.bases[baseId] = base;
}

function selectBaseByTextInsertion(this: any, e: KeyboardEvent) : void {
  if (!(e.target instanceof HTMLInputElement)) {
    return;
  }
  else if (e.target.validity.patternMismatch) {
    // animateShake();
    e.target.select();
    return;
  }

  e.target.value = e.target.value.toUpperCase();
  this.pushBase(e.target.dataset.baseId, e.target.value);
  this.maybeSubmitCodon();
  const nextInput:HTMLInputElement = this.getNextEmptyInput();
  if (!nextInput) {
    return;
  }

  nextInput.select();
}

function selectBaseByButton (this: any, e: MouseEvent) : void {
  if (!(e.target instanceof HTMLButtonElement)) {
    return;
  }

  let nextInput:HTMLInputElement = this.getNextEmptyInput();
  if (!nextInput) {
    return;
  }

  nextInput.value = e.target.dataset.baseValue as string;
  this.pushBase(nextInput.dataset.baseId, nextInput.value);
  this.maybeSubmitCodon();
  nextInput = this.getNextEmptyInput();
  if (!nextInput) {
    return;
  }

  nextInput.select();
}

export default {
  name: 'CodonHandler',
  data() {
    return {
      bases: {
        "1": "",
        "2": "",
        "3": ""
      }
    };
  },
  methods: {
    getNextEmptyInput,
    maybeSubmitCodon,
    pushBase,
    resetInputs,
    selectBaseByButton,
    selectBaseByTextInsertion
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

.codon-instruction {
}

.codon-pad {
  align-self: center;
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
  flex-flow: row nowrap;
  justify-content: space-between;
  background: #3571a638;
  margin-top: 1rem;
  border-width: 0 0.5rem;
  border-style: ridge;
  border-color: #b3dbff;
  border-radius: 0.1rem;
  box-sizing: border-box;
}

.base-button {
  width: 3.3rem;
  height: 4rem;
  text-align: center;
  line-height: 4rem;
  padding: 0;
  font-size: 2rem;

}
</style>
