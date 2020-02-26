<template>
  <article>
    <h1>{{ text }}</h1>
    <img v-if="icon" :src="iconURL" />
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
import axios from '@/axios'
import {
  watch,
  reactive,
  computed,
  toRefs,
} from 'vue'
import {
  isNil,
  head,
  lte,
  path,
  toString,
} from 'ramda'

export default {
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
    const iconURL = computed(() => {
      const iconNumber = lte(weatherDetails.icon, 9)
        ? `0${weatherDetails.icon}`
        : toString(weatherDetails.icon)

      return `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`
    })

    const setWeatherDetails = ({
      WeatherIcon,
      WeatherText,
      Temperature,
      RealFeelTemperature,
      Wind,
      UVIndexText,
      Visibility,
    }) => {
      weatherDetails.icon = WeatherIcon
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
      iconURL,
      ...toRefs(weatherDetails),
    }
  },
}
</script>
