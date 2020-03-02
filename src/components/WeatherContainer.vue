<template>
  <article class="container">
    <section>
      <get-location
        @getLocation="setLocation"
        @locationNotFound="showLocationNotFound"
      />
      <divider-line />
    </section>
    <section class="container__dashboard-section">
      <div class="container__current-day">
        <current-weather
          class="container__current-day___weather"
          :location-key="key"
          :address="{ city, country }"
        />
        <weather-by-hours
          class="container__current-day___chart"
          :location-key="key"
        />
      </div>
      <div class="container__next-days">
        <forecast-weather :location-key="key" />
      </div>
    </section>
  </article>
</template>

<script>
import GetLocation from '@/components/GetLocation.vue'
import ForecastWeather from '@/components/ForecastWeather.vue'
import WeatherByHours from '@/components/WeatherByHours.vue'
import DividerLine from '@/components/DividerLine.vue'
import CurrentWeather from '@/components/CurrentWeather.vue'
import { reactive, toRefs } from 'vue'

export default {
  components: {
    GetLocation,
    ForecastWeather,
    WeatherByHours,
    CurrentWeather,
    DividerLine,
  },
  setup() {
    const state = reactive({
      city: null,
      key: null,
      country: null,
    })

    const setLocation = ({ city, country, key }) => {
      state.city = city
      state.country = country
      state.key = key
    }

    return {
      ...toRefs(state),
      setLocation,
    }
  },
}
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
  }

  .container__dashboard-section {
    display: flex;
    flex-direction: column;
    margin-top: 2.5rem;
  }

  .container__current-day {
    display: flex;
  }

  @media screen and (max-width: $break-mobile) {
    .container__current-day {
      flex-direction: column;
      align-items: center;
    }
    .container__current-day___chart {
      margin-top: 2rem;
    }
  }

  @media screen and (min-width: $break-mobile) {
    .container__current-day {
      height: $dashboard-height;
    }

    .container__current-day___weather {
      flex: 1;
    }

    .container__current-day___chart {
      flex: 2;
    }

    .container__current-day___weather, .container__current-day___chart {
      min-width: 25rem;
    }
    .container__current-day___chart {
      margin-left: 4rem;
    }
  }

  .container__next-days {
    margin-top: 4rem;
  }

</style>
