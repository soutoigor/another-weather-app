<template>
  <img :src="iconURL" alt="Ícone de temperatura" />
</template>

<script>
import { computed } from 'vue'
import {
  toString,
  lte,
} from 'ramda'

export default {
  props: {
    icon: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const iconURL = computed(() => {
      const iconNumber = lte(props.icon, 9)
        ? `0${props.icon}`
        : toString(props.icon)

      return `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`
    })
    return { iconURL }
  },
}
</script>
