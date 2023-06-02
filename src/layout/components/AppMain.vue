<template>
  <section class="app-main">
    <router-view />
  </section>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.app-main {
  min-height: calc(100vh - 50px);
  overflow: hidden;
  padding: 20px 30px 0 30px;
}
</style>
