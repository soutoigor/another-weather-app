<template>
  <div style="display: flex; flex-wrap: wrap">
    <div
      v-for="(day, index) in forecastData"
      :key="index"
      style="border: 1px solid #333; padding: 10px"
    >
      <p>
        {{ formatDateToBRNotation(day.Date) }}
      </p>
      <p>
        Mínimo: {{ day.Temperature.Minimum.Value }} Cº
      </p>
      <p>
        Máximo: {{ day.Temperature.Maximum.Value }} Cº
      </p>
      <p>
        Dia: {{ day.Day.IconPhrase }}
        <weather-icon :icon="day.Day.Icon" />
      </p>
      <p>
        Noite: {{ day.Night.IconPhrase }}
        <weather-icon :icon="day.Night.Icon" />
      </p>
    </div>
  </div>
</template>

<script>
import axios from '@/axios'
import { useFormatDates } from '@/shared/formatDate'
import WeatherIcon from '@/components/WeatherIcon.vue'
import {
  isNil,
  prop,
} from 'ramda'
import {
  watch,
  ref,
} from 'vue'

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
    const forecastData = ref([])

    const { formatDateToBRNotation } = useFormatDates()

    const getForecastWeather = async (location) => {
      const params = {
        language: 'pt-br',
        metric: true,
      }
      const { data } = await axios
        .get(
          `/forecasts/v1/daily/5day/${location}`,
          { params },
        )
      return data
    }

    const setForecastWeather = (data) => {
      forecastData.value = prop('DailyForecasts', data)
    }

    watch(() => props.locationKey, async (keyValue) => {
      if (isNil(keyValue)) return
      try {
        const weatherData = await getForecastWeather(keyValue)
        setForecastWeather(weatherData)
      } catch (error) {
        console.log(error)
      }
    })

    return {
      forecastData,
      formatDateToBRNotation,
    }
  },
}
</script>
