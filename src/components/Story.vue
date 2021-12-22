<template>
  <iframe id="storytelling" ref="storytelling" />
</template>

<script>
export default {
  name: 'Story',
  data: function () {
    require('@/components/index.html')
  },
  mounted() {
    this.init()
  },
  methods: {
    init: function () {
      this.$refs.storytelling.contentDocument.documentElement.innerHTML =
        this.ifeData
    },
  },
}
</script>