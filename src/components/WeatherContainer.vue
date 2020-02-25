<template>
  <article>
    name: {{ name }}
    country: {{ country }}
    key: {{ key }}
    <section>
      <get-location
        @getLocation="setLocation"
        @locationNotFound="setLocationNotFound"
      />
    <p v-if="showMessageNotFound">Localização não encontrada!</p>
    </section>
    <section>
      <current-weather />
      <day-weather />
      <forecast-weather />
    </section>
  </article>
</template>

<script>
import GetLocation from '@/components/GetLocation.vue'
import ForecastWeather from '@/components/ForecastWeather.vue'
import DayWeather from '@/components/DayWeather.vue'
import CurrentWeather from '@/components/CurrentWeather.vue'
import { reactive, toRefs } from '@vue/composition-api'

export default {
  components: {
    GetLocation,
    ForecastWeather,
    DayWeather,
    CurrentWeather,
  },
  setup() {
    const state = reactive({
      name: '',
      key: '',
      country: '',
      showMessageNotFound: false,
    })

    const setLocation = ({ name, country, key }) => {
      state.name = name
      state.country = country
      state.key = key
    }

    const setLocationNotFound = () => {
      state.showMessageNotFound = true
      setTimeout(() => {
        state.showMessageNotFound = false
      }, 3000)
    }

    return {
      ...toRefs(state),
      setLocation,
      setLocationNotFound,
    }
  },
}
</script>
