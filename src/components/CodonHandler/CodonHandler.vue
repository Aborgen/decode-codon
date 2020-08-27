<template>
  <div class='codon-handler'>
  <header class='codon-instruction'>Codon Insertion</header>
  <span class='codon-pad'>- - -</span>
  <section class='codon-display'>
    <input required v-for="n in 3"
      @input="selectCodonByTextInsertion"
      :id="'codon-'+n"
      :data-codon-id="n"
      class='codon-insert'
      pattern='[uUcCaAgG]{1}'></input>
  </section>
  <section class='codon-action'>
    <button v-for="codon in ['U', 'C', 'A', 'G']"
      @click="selectCodonByButton"
      :data-codon-value="codon"
      class='codon-button'>{{ codon }}</button>
  </section>
  </div>
</template>

<script>
import codonTable from 'data/codon_table.js';

function ensureIndexIntegrity() {
  if (this.currentCodonIdx > 3 || this.currentCodonIdx < 1) {
    this.currentCodonIdx = 1;
  }
}

function selectCodonByTextInsertion(e) {
  const currentCodon = document.getElementById(`codon-${this.currentCodonIdx}`);
  this.ensureIndexIntegrity();
  if (e.target === currentCodon) {
    ++this.currentCodonIdx;
  }
  else {
    this.currentCodonIdx = Number.parseInt(e.target.dataset.codonId) + 1;
  }

  this.ensureIndexIntegrity();
  document.getElementById(`codon-${this.currentCodonIdx}`).select();
}

function selectCodonByButton(e) {
  this.ensureIndexIntegrity();
  const codon = document.getElementById(`codon-${this.currentCodonIdx}`);
  codon.value = e.target.dataset.codonValue;
  ++this.currentCodonIdx;
  this.ensureIndexIntegrity();
  document.getElementById(`codon-${this.currentCodonIdx}`).select();
}

export default {
  name: 'CodonHandler',
  data() {
    return {
      codonTable: codonTable,
      codons: [],
      currentCodonIdx: 1
    };
  },
  methods: {
    selectCodonByButton,
    selectCodonByTextInsertion,
    ensureIndexIntegrity
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

.codon-display {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  font-size: 1.8rem;
}

.codon-insert {
  height: 3rem;
  width: 3rem;
  background: #3571a614;
  font-size: inherit;
  text-align: center;
}

.codon-action {
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

.codon-button {
  width: 3.3rem;
  height: 4rem;
  text-align: center;
  line-height: 4rem;
  padding: 0;
  font-size: 2rem;

}
</style>
