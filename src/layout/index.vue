<template>
  <div class="app-wrapper">
    <Menu style="float: left" />
    <navbar />
    <app-main />
  </div>
</template>

<script>
import AppMain from "./components/AppMain.vue";
import Navbar from "./components/Navbar.vue";
import Menu from "./components/Menu.vue";

export default {
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    Menu,
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
