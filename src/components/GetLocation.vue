<template>
  <div>
    <form @submit.prevent="getLocationBySearch">
      <input
        v-model="cityToSearch"
        type="text"
        placeholder="Search for a city"
      />
      <button type="submit">Search</button>
    </form>
    <button
      type="button"
      @click="getLocationByCoordinates"
    >
      Get Location
    </button>
  </div>
</template>

<script>
import axios from '@/axios'
import {
  prop,
  path,
  isEmpty,
  head,
} from 'ramda'
import {
  reactive,
  toRefs,
} from 'vue'

export default {
  setup(props, { emit }) {
    const state = reactive({
      cityToSearch: '',
    })

    const setLocation = (data) => {
      if (isEmpty(data)) {
        emit('locationNotFound')
        return
      }
      emit('getLocation', {
        name: prop('LocalizedName', data),
        country: path(['Country', 'ID'], data),
        key: prop('Key', data),
      })
    }

    const getLocationByCoordinates = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { coords: { latitude, longitude } } = position
          const params = {
            q: `${latitude},${longitude}`,
            toplevel: 'true',
          }
          const { data } = await axios.get('/locations/v1/cities/geoposition/search', { params })
          setLocation(data)
        },
        (err) => err,
        {
          timeout: 30000,
        },
      )
    }

    const getLocationBySearch = async () => {
      const params = {
        q: state.cityToSearch,
      }
      try {
        const { data } = await axios.get('/locations/v1/cities/search', { params })
        setLocation(head(data))
      } catch (error) {
        console.log(error)
      }
    }

    return {
      ...toRefs(state),
      getLocationBySearch,
      getLocationByCoordinates,
    }
  },
}
</script>
