<template>
  <div class="page__container">
    <header class="page__header">
      <page-title :title="'Another Weather App'" />
    </header>
    <main>
      <weather-container />
    </main>
  </div>
</template>

<script>
import WeatherContainer from '@/components/WeatherContainer.vue'
import PageTitle from '@/components/PageTitle.vue'

export default {
  components: {
    WeatherContainer,
    PageTitle,
  },
}
</script>

<style lang="scss" scoped>
  .page__container {
    display: flex;
    flex-direction: column;
    @include paddingX(10rem);
  }

  .page__header {
    @include paddingY(1rem);
  }

  @media screen and (max-width: $break-small) {
    .page__container {
      @include paddingX(5rem);
    }
  }

  @media screen and (max-width: $break-mobile) {
    .page__container {
      align-items: center;
      @include paddingX(.2rem);
    }
  }
</style>
