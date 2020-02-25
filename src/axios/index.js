import axios from 'axios'

const axiosSettings = axios.create({
  baseURL: 'http://dataservice.accuweather.com/',
  timeout: 30000,
})

axiosSettings.interceptors.request.use((config) => {
  const customConfig = { ...config }
  customConfig.params = {
    apikey: process.env.VUE_APP_ACCUWEATHER_KEY,
    ...config.params,
  }
  return customConfig
})

export default axiosSettings
