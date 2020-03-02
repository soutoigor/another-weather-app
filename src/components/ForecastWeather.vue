<template>
  <article class="forecast__container">
    <h1
      v-if="showForecastData"
      class="card__title"
    >
      Next days
    </h1>
    <div
      v-if="showForecastData"
      class="forecast__list-container"
    >
      <div
        v-for="(day, index) in forecastData"
        :key="index"
        class="card forecast__card"
      >
        <div class="card__header">
          <span class="card__title">
            {{ formatDateToBRNotation(day.Date) }}
          </span>
          <div class="card__header___temperatures">
            <span class="card__header___temperatures--max">
              <img
                class="card__header___temperatures____img"
                src="@/assets/max.svg"
              />
              <span>{{ day.Temperature.Maximum.Value }} Cº</span>
            </span>
            <span class="card__header___temperatures--min">
              <img
                class="card__header___temperatures____img"
                src="@/assets/min.svg"
              />
              <span>{{ day.Temperature.Minimum.Value }} Cº</span>
            </span>
          </div>
        </div>
        <div class="card__period___container">
          <div class="card__period-item">
            <span class="card__period___name">Day:</span>
            <span>{{ day.Day.IconPhrase }}</span>
            <weather-icon
              class="card__period___icon"
              :icon="day.Day.Icon"
            />
          </div>
          <div class="card__period-item">
            <span class="card__period___name">Night:</span>
            <span>{{ day.Night.IconPhrase }}</span>
            <weather-icon
              class="card__period___icon"
              :icon="day.Night.Icon"
            />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import axios from '@/axios'
import { useFormatDates } from '@/shared/formatDate'
import WeatherIcon from '@/components/WeatherIcon.vue'
import {
  isNil,
  prop,
  not,
  isEmpty,
} from 'ramda'
import {
  watch,
  ref,
  computed,
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

    const showForecastData = computed(() => not(isEmpty(forecastData.value)))

    const { formatDateToBRNotation } = useFormatDates()

    const getForecastWeather = async (location) => {
      const params = {
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
      showForecastData,
    }
  },
}
</script>

<style lang="scss" scoped>
  .forecast__container {
    display: flex;
    flex-direction: column;
  }

  .forecast__list-container {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
  }


  .forecast__card {
    width: 17.5rem;
    margin-right: .5rem;
  }

  @media screen and (max-width: $break-mobile){
    .forecast__container {
      align-items: center;
    }

    .forecast__list-container {
      flex-direction: column;
    }

    .forecast__card {
      margin-top: .7rem;
      width: 90vw;
    }
  }

  .card__header {
    display: flex;
    justify-content: space-between;
  }

  .card__header___temperatures {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 40%
  }

  .card__header___temperatures____img {
    width: .8rem;
  }

  .card__header___temperatures--max,
  .card__header___temperatures--min {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 1.5rem;
  }

  .card__header___temperatures--max {
    color: $roman;
  }

  .card__header___temperatures--min {
    color: $endeavour;
    margin-top: .2rem;
  }

  .card__period___container {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }

  .card__period-item {
    display: flex;
    flex-direction: column;
    @include marginX(.2rem);
  }

  .card__period___name {
    font-weight: 700;
    margin-bottom: .5rem;
  }

  .card__period___icon {
    max-width: 3rem;
    margin-top: 2rem;
  }

</style>
