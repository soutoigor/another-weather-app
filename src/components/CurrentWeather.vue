<template>
  <article>
    <h1>{{ text }}</h1>
    <weather-icon
      v-if="icon"
      :icon="icon"
    />
    <ul>
      <li>Temperatura: {{ temperature }}C°</li>
      <li>Sensação térmica: {{ feelTemperature }}C°</li>
      <li>Vento: {{ wind }}km/h</li>
      <li>UV: {{ UV }}</li>
      <li>Visibilidade: {{ visibility }}km</li>
    </ul>
  </article>
</template>

<script>
import WeatherIcon from '@/components/WeatherIcon.vue'
import axios from '@/axios'
import {
  watch,
  reactive,
  toRefs,
} from 'vue'
import {
  isNil,
  head,
  path,
} from 'ramda'

export default {
  components: {
    WeatherIcon,
  },
  props: {
    locationKey: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const weatherDetails = reactive({
      icon: null,
      text: null,
      temperature: null,
      feelTemperature: null,
      wind: null,
      UV: null,
      visibility: null,
    })

    const setWeatherDetails = ({
      WeatherIcon: icon,
      WeatherText,
      Temperature,
      RealFeelTemperature,
      Wind,
      UVIndexText,
      Visibility,
    }) => {
      weatherDetails.icon = icon
      weatherDetails.text = WeatherText
      weatherDetails.temperature = path(['Metric', 'Value'], Temperature)
      weatherDetails.feelTemperature = path(['Metric', 'Value'], RealFeelTemperature)
      weatherDetails.wind = path(['Speed', 'Metric', 'Value'], Wind)
      weatherDetails.visibility = path(['Metric', 'Value'], Visibility)
      weatherDetails.UV = UVIndexText
    }

    const getCurrentWeather = async (location) => {
      const params = {
        details: true,
        language: 'pt-br',
      }
      const { data } = await axios.get(`/currentconditions/v1/${location}`, { params })
      return head(data)
    }

    watch(() => props.locationKey, async (keyValue) => {
      if (isNil(keyValue)) return
      try {
        const weather = await getCurrentWeather(keyValue)
        setWeatherDetails(weather)
      } catch (error) {
        console.log(error)
      }
    })

    return {
      ...toRefs(weatherDetails),
    }
  },
}
</script>
