<template>
<div class='app'>
  <div class='app-container'>
    <amino-acid-display
      :amino-acid-chain="aminoAcidData.getAllAminoAcids()"
      :codon-chain="aminoAcidData.getAllCodons()"
    />
    <codon-handler
      :on-codon-submit="pushCodon"
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
  console.log(this.aminoAcidData.getAllAminoAcids());
}

export default {
  name: 'app',
  data() {
    return {
      aminoAcidData: new AminoAcidData()
    }
  },
  components: {
    AminoAcidDisplay,
    CodonHandler
  },
  methods: {
    pushCodon
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
