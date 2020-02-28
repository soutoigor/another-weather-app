<template>
  <article>
    name: {{ name }}
    country: {{ country }}
    <section>
      <get-location
        @getLocation="setLocation"
        @locationNotFound="showLocationNotFound"
      />
    <span v-if="showMessageNotFound">Localização não encontrada!</span>
    </section>
    <section>
      <current-weather :location-key="key" />
      <forecast-weather :location-key="key" />
      <weather-by-hours :location-key="key" />
    </section>
  </article>
</template>

<script>
import GetLocation from '@/components/GetLocation.vue'
import ForecastWeather from '@/components/ForecastWeather.vue'
import WeatherByHours from '@/components/WeatherByHours.vue'
import CurrentWeather from '@/components/CurrentWeather.vue'
import { reactive, toRefs } from 'vue'

export default {
  components: {
    GetLocation,
    ForecastWeather,
    WeatherByHours,
    CurrentWeather,
  },
  setup() {
    const state = reactive({
      name: null,
      key: null,
      country: null,
      showMessageNotFound: false,
    })

    const setLocation = ({ name, country, key }) => {
      state.name = name
      state.country = country
      state.key = key
    }

    const showLocationNotFound = () => {
      const MESSAGE_TIMEOUT = 3000
      state.showMessageNotFound = true

      setTimeout(() => {
        state.showMessageNotFound = false
      }, MESSAGE_TIMEOUT)
    }

    return {
      ...toRefs(state),
      setLocation,
      showLocationNotFound,
    }
  },
}
</script>
