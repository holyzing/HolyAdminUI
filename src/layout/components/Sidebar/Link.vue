
<template>
  <!-- eslint-disable vue/require-component-is -->
  <!-- 
  <component v-bind="linkProps(to)">
    <slot />
  </component>
  -->
 
  <component  v-if="isExternalUrl(to)"  :is="'a'" :href="to" target="_blank" rel="noopener">
    <slot />
  </component>
  <component  v-else :is="'RouterLink'" :to="to">
    <slot />
  </component>

</template>

<script>
import { isExternal } from '@/utils/validate.js'
import { RouterLink } from 'vue-router'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  components: [RouterLink],
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      console.log("---------------->", url)
      return {
        is: 'router-link',
        to: url
      }
    },

    isExternalUrl(url) {
      return isExternal(url)
    }
  }
}
</script>
