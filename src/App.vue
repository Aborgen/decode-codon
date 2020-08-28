<template>
<div class='app'>
  <div class='app-container'>
    <amino-acid-display
      :amino-acid-chain="aminoAcidChain"
      :codon-chain="codonChain" />
    <codon-handler />
  </div>
</div>
</template>

<script>
import AminoAcidDisplay from 'components/AminoAcidDisplay/AminoAcidDisplay.vue';
import CodonHandler from 'components/CodonHandler/CodonHandler.vue';

export default {
  name: 'app',
  data() {
    return {
      aminoAcidChain: [],
      codonChain: []
    }
  },
  components: {
    AminoAcidDisplay,
    CodonHandler
  }
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

.app {
  background: #3571a638;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin: 0;
  padding: 0;
}

.app-container {
  width: 70%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: space-around;
}
</style>
