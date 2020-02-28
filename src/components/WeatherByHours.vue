<template>
  <article>
    <h1>Weather by day</h1>
    <canvas id="weather-hours-chart"></canvas>
  </article>
</template>

<script>
import axios from '@/axios'
import moment from 'moment'
import Chart from 'chart.js'
import {
  ref,
  watch,
  watchEffect,
  computed,
} from 'vue'
import {
  map,
  path,
  isNil,
  isEmpty,
  prop,
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
    const weatherDataHours = ref([])

    const getWeatherHours = async (location) => {
      const params = {
        language: 'pt-br',
        metric: true,
      }
      const { data } = await axios
        .get(
          `/forecasts/v1/hourly/12hour/${location}`,
          { params },
        )
      return data
    }

    const setWeatherHours = (data) => {
      weatherDataHours.value = data
    }

    watch(() => props.locationKey, async (keyValue) => {
      if (isNil(keyValue)) return
      try {
        const weatherData = await getWeatherHours(keyValue)
        setWeatherHours(weatherData)
      } catch (error) {
        console.log(error)
      }
    })

    const chartHours = computed(() => {
      if (isNil(weatherDataHours.value)) return []
      return map(
        (hourWeather) => moment(prop('DateTime', hourWeather)).format('HH:mm'),
        weatherDataHours.value,
      )
    })

    const chartDegrees = computed(() => {
      if (isNil(weatherDataHours.value)) return []
      return map(
        (hourWeather) => path(['Temperature', 'Value'], hourWeather),
        weatherDataHours.value,
      )
    })

    watchEffect(() => {
      if (isEmpty(chartDegrees.value)) return
      const chartElement = document.getElementById('weather-hours-chart').getContext('2d')
      // eslint-disable-next-line no-unused-vars
      const chart = new Chart(chartElement, {
        type: 'line',
        data: {
          labels: chartHours.value,
          datasets: [
            {
              label: 'Temperature',
              data: chartDegrees.value,
            },
          ],
        },
        options: {
          elements: {
            radius: 5,
            pointStyle: 'circle',
            borderWidth: 3,
          },
          legend: {
            display: false,
          },
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [{
              ticks: {
                padding: 25,
              },
            }],
          },
        },
      })
    })

    return {
      chartDegrees,
      chartHours,
    }
  },
}
</script>
