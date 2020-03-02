<template>
  <article class="card card__container">
    <div v-if="isLoading">
      <loading />
    </div>
    <div
      class="card__temperature-container"
      v-else-if="hasCurrentWeather && !isLoading"
    >
      <header>
        <h1 class="card__title">{{ address.country }} - {{ address.city }}</h1>
      </header>
      <div class="card__temperature">
        <div>
          <h2 class="card__temperature___text">{{ text }}</h2>
          <weather-icon
            v-if="icon"
            :icon="icon"
          />
        </div>
        <span class="card__temperature___value">{{ temperature }} C°</span>
      </div>
      <ul class="card__other-infos">
        <li class="card__other-infos___item">
          <span>Feeling temperature:</span><span>{{ feelTemperature }} C°</span>
        </li>
        <divider-line />
        <li class="card__other-infos___item">
          <span>Wind:</span> <span>{{ wind }} Km/h</span>
        </li>
        <divider-line />
        <li class="card__other-infos___item">
          <span>UV:</span> <span>{{ UV }} </span>
        </li>
        <divider-line />
        <li class="card__other-infos___item">
          <span>Visibility:</span> <span>{{ visibility }} Km</span>
        </li>
      </ul>
    </div>
    <div
      v-else
      class="card__no-weather-message"
    >
      Search a city or get your location to see its weather.
    </div>
  </article>
</template>

<script>
import WeatherIcon from '@/components/WeatherIcon.vue'
import Loading from '@/components/Loading.vue'
import DividerLine from '@/components/DividerLine.vue'
import axios from '@/axios'
import {
  watch,
  reactive,
  toRefs,
  computed,
  ref,
} from 'vue'
import {
  isNil,
  head,
  not,
  path,
  or,
  isEmpty,
} from 'ramda'

export default {
  components: {
    WeatherIcon,
    DividerLine,
    Loading,
  },
  props: {
    locationKey: {
      type: String,
      required: false,
      default: null,
    },
    address: {
      type: Object,
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
    const isLoading = ref(false)

    const hasCurrentWeather = computed(() => (
      not(or(isNil(props.locationKey), isEmpty(props.address)))
    ))

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
      }
      const { data } = await axios.get(`/currentconditions/v1/${location}`, { params })
      return head(data)
    }

    watch(() => props.locationKey, async (keyValue) => {
      if (isNil(keyValue)) return
      try {
        isLoading.value = true
        const weather = await getCurrentWeather(keyValue)
        setWeatherDetails(weather)
        isLoading.value = false
      } catch (error) {
        console.log(error)
      }
    })

    return {
      ...toRefs(weatherDetails),
      hasCurrentWeather,
      isLoading,
    }
  },
}
</script>

<style lang="scss" scoped>
  .card__container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .card__temperature-container {
    display: flex;
    flex-direction: column;
  }

  .card__temperature {
    display: flex;
    @include marginY(2rem);
    justify-content: space-between;
    align-items: center;
  }

  .card__temperature___text {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .card__temperature___value {
    font-size: 3.2rem;
    letter-spacing: .1rem;
  }

  .card__other-infos {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 1rem;
  }

  .card__other-infos___item {
    padding: .7rem;
    display: flex;
    justify-content: space-between;
  }

  .card__no-weather-message {
    color: rgba($silver-chalice, .8);
    font-size: 3.6rem;
    letter-spacing: .2rem;
  }

  @media screen and (max-width: $break-mobile) {
    .card__container {
      width: 95vw;
    }

    .card__no-weather-message {
      font-size: 2.8rem;
    }
  }
</style>
