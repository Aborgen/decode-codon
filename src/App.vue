<template>
<div class='app'>
  <codon-handler />
</div>
</template>

<script>
import CodonHandler from 'components/CodonHandler/CodonHandler.vue';
export default {
  name: 'app',
  components: {
    CodonHandler
  }
}
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}

.app {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}
</style>
