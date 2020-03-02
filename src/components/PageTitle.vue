<template functional>
  <h1 class="title">{{ title }}</h1>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  .title {
    font-size: 3rem;
  }

  @media screen and (max-width: $break-mobile) {
    .title {
      font-size: 2.3rem;
    }
  }
</style>
