<template>
<section :id="`${chainType}-chain`" class='chain-display'>
  <ol class='chain-field'>
    <template v-for="(link, i) in chain">
      <template v-if="i > 0">{{ separator }}</template>
      <li :class="{'selected-amino-acid':i === selectedAminoAcid}">
        <div class='chain-index'>{{ i+1 }}</div>
        {{ link }}
      </li>
    </template>
  </ol>
  <div class='chain-options'>
    <button
      @click="copyToClipboard"
      class='copy-button'>copy</button>
    <select v-model="separator" class='list-separator'>
      <option v-for="[separator, description] in Object.entries(possibleSeparators)"
        :value="separator">{{ description }}</option>
    </select>
  </div>
</section>
</template>

<script lang='ts'>
// Not finalized... might not work in all instances. clipboard.js?
function copyToClipboard(this:any) : void {
  const s:string = this.chain.join(this.separator);
  const textarea:HTMLTextAreaElement = document.createElement("textarea");
  document.body.appendChild(textarea);
  textarea.value = s;
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    console.log('Copied to clipboard');
  }
  catch (err) {
    console.log('Unable to copy');
  }
  finally {
    document.body.removeChild(textarea);
  }
}

export default {
  name: 'ChainDisplay',
  data() {
    return {
      separator: '-',
      possibleSeparators: {
        '-' :'dash',
        ''  :'none',
        ',' :'comma',
        '_' :'underscore'
      }
    };
  },
  props: {
    chain: {
      type: Array,
      required: true
    },
    chainType: {
      type: String,
      required: true
    },
    selectedAminoAcid: {
      type: Number,
      required: false,
      default: null
    }
  },
  methods: {
    copyToClipboard
  },
  watch: {
    chain: {
      handler: function(this: any, val: string[], oldVal: string[]) : void {
        if (this.selectedAminoAcid !== null) {
          return;
        }

        this.$nextTick(() => {
          const field = document.querySelector(`#${this.chainType}-chain .chain-field`);
          if (!(field instanceof HTMLElement)) {
            return;
          }

          field.scrollLeft = field.scrollWidth;
        });
      }
    }
  }
};

</script>

<style scoped>
.chain-display {
  flex: 0 1 23%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
  font-family: monospace;
}

.chain-field {
  flex: 0 1 70%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-end;
  background: #fff;
  height: 80%;
  border: 2px inset black;
  box-sizing: border-box;
  font-size: 0.7em;
  padding: 0;
  margin: 0;
  overflow-x: scroll;
  overflow-y: hidden;
  list-style-type: none;
}

.chain-field li {
  position: relative;
}

.chain-index {
  color: #825f5f9c;
  position: absolute;
  width: 100%;
  bottom: 20px;
  font-size: 0.5em;
  text-align: center;
}

.chain-options {
  display: flex;
  flex-flow: row nowrap;
}

.selected-amino-acid {
  background: orange;
}

.copy-button {
  width: 4em;
  font-size: 0.7em;
  padding: 0;
  margin: 0;
}

.list-separator {
  flex: 0 1 100%;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .chain-display {
    flex-wrap: wrap;
    flex-basis: 28%;
  }

  .chain-field {
    flex-grow: 1;
    height: 50%;
  }
}
</style>
