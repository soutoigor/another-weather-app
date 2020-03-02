<template>
  <article class="chart__containter">
    <canvas class="chart" id="weather-hours-chart"></canvas>
  </article>
</template>

<script>
import axios from '@/axios'
import { useFormatDates } from '@/shared/formatDate'
import Chart from 'chart.js'
import {
  ref,
  watch,
  watchEffect,
  computed,
  onMounted,
} from 'vue'
import {
  map,
  path,
  isNil,
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

    const { formatToHourAndMinutes } = useFormatDates()

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
      const weatherData = await getWeatherHours(keyValue)
      setWeatherHours(weatherData)
    })

    const chartHours = computed(() => {
      if (isNil(weatherDataHours.value)) return []
      return map(
        (hourWeather) => formatToHourAndMinutes(prop('DateTime', hourWeather)),
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

    const initChart = () => {
      watchEffect(() => {
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
                borderColor: '#42b883',
                borderWidth: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
              radius: 5,
              pointStyle: 'circle',
              borderWidth: 5,
            },
            legend: {
              display: false,
            },
            lineTension: 1,
            tooltips: {
              callbacks: {
                label(value) {
                  return `${value.yLabel} C°`
                },
              },
            },
            scales: {
              yAxes: [{
                ticks: {
                  callback(value) {
                    return `${value} C°`
                  },
                  padding: 25,
                },
              }],
            },
          },
        })
      })
    }

    onMounted(() => {
      initChart()
    })

    return {
      chartDegrees,
      chartHours,
    }
  },
}
</script>

<style lang="scss" scoped>

  @media screen and (max-width: $break-mobile) {
    .chart__containter {
      width: 100vw;
      height: $dashboard-height;
    }
  }
</style>
