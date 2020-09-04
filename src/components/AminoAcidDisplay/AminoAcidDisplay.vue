<template>
<div class='amino-acid-container'>
  <section class='chain-display codon-chain'></section>
  <section class='chain-display amino-acid-chain'></section>
  <section class='chain-display extra'></section>
</div>
</template>

<script lang='ts'>
export default {
  name: 'AminoAcidDisplay',
  props: {
    aminoAcidChain: {
      type: Array,
      required: true
    },
    codonChain: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.amino-acid-container {
  height: 15rem;
  flex-basis: 40%;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content:space-evenly;
  padding: 2rem;
}

.chain-display {
  flex-basis: 23%;
  background: green;

}

</style>
