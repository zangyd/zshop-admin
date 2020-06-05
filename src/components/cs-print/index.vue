<template>
  <div class="cs-print">
    <slot/>
  </div>
</template>

<script>
import PrintCS from '@zangyd/vue-print'

export default {
  name: 'cs-print',
  props: {
    cssText: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  mounted() {
    this.printCS = new PrintCS()
    this.iframe = this.printCS.getIFrame()
  },
  beforeDestroy() {
    this.iframe && document.body.removeChild(this.iframe)
  },
  methods: {
    toPrint() {
      let styleList = ['.no-print {display: none;}']
      let styles = document.querySelectorAll('style,link')

      for (let i = 0; i < styles.length; i++) {
        switch (styles[i].localName) {
          case 'link':
            styles[i].rel === 'stylesheet' && styleList.push(styles[i].href)
            break
          case 'style':
            styleList.push(styles[i].outerHTML)
            break
        }
      }

      this.printCS.print(this.$el, this.cssText.concat(styleList))
    }
  }
}
</script>
