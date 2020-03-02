<template>
  <div class="location__container">
    <form
      class="location__form"
      @submit.prevent="getLocationBySearch"
    >
      <div class="location__input-container">
        <input
          v-model="cityToSearch"
          class="text-field"
          type="text"
          required
          placeholder="Search for a city"
        />
        <span
          v-if="showMessageNotFound"
          class="location__error-message"
        >
          Localização não encontrada!
        </span>
      </div>
      <button
        type="submit"
        class="btn btn-primary location__form___button"
        :disabled="hasTextLocation"
      >
        Search
      </button>
    </form>
    <span class="location__form___separator">or</span>
    <span
      class="location__get-coordinate"
      @click="getLocationByCoordinates"
    >
      Current location
      <img src="@/assets/geo.png" />
    </span>
  </div>
</template>

<script>
import axios from '@/axios'
import {
  prop,
  path,
  isNil,
  length,
  gt,
  head,
} from 'ramda'
import {
  reactive,
  toRefs,
  computed,
} from 'vue'

export default {
  setup(props, { emit }) {
    const state = reactive({
      cityToSearch: '',
      showMessageNotFound: false,
    })

    const hasTextLocation = computed(() => gt(2, length(state.cityToSearch)))

    const showLocationNotFound = () => {
      const MESSAGE_TIMEOUT = 3000
      state.showMessageNotFound = true

      setTimeout(() => {
        state.showMessageNotFound = false
      }, MESSAGE_TIMEOUT)
    }

    const setLocation = (data) => {
      if (isNil(data)) {
        showLocationNotFound()
        return
      }
      emit('getLocation', {
        city: prop('LocalizedName', data),
        country: path(['Country', 'ID'], data),
        key: prop('Key', data),
      })
    }

    const getLocationByCoordinates = () => {
      const TIMEOUT_LOCATION = 30000
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { coords: { latitude, longitude } } = position
          const params = {
            q: `${latitude},${longitude}`,
            toplevel: 'true',
          }
          const { data } = await axios
            .get(
              '/locations/v1/cities/geoposition/search',
              { params },
            )
          setLocation(data)
        },
        (err) => err,
        {
          timeout: TIMEOUT_LOCATION,
        },
      )
    }

    const getLocationBySearch = async () => {
      if (!hasTextLocation) return
      const params = {
        q: state.cityToSearch,
      }
      const { data } = await axios.get(
        '/locations/v1/cities/search',
        { params },
      )
      setLocation(head(data))
    }

    return {
      ...toRefs(state),
      getLocationBySearch,
      getLocationByCoordinates,
      hasTextLocation,
    }
  },
}
</script>

<style lang="scss" scoped>
  .location__container {
    display: flex;
    @include paddingY(2rem);
    align-items: center;
  }

  @media screen and (max-width: $break-mobile){
    .location__container {
      flex-direction: column;
      align-items: center;
    }
  }

  .location__form {
    display: flex;
    justify-content: space-between;
  }

  .location__form___button {
    margin-left: 2rem;
  }

  .location__form___separator {
    color: $silver-chalice;
    @include marginX(3rem);
  }

  @media screen and (max-width: $break-mobile){
    .location__form___separator {
      @include marginX(0);
      @include marginY(.6rem);
    }
  }

  .location__input-container {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .location__error-message {
    color: $roman;
    position: absolute;
    top: 2.4rem;
  }

  .location__get-coordinate {
    cursor: pointer;
    text-decoration: underline;
    color: $ocean-green;
    letter-spacing: .1rem;
    font-weight: 600;
    font-size: 1.5rem;
  }

</style>
