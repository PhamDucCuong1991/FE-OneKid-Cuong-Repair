<template>
  <div>
    <DashboardPlus v-if="getAppTypeUserLogin == 'plus'" />
    <DashboardTeacher v-else-if="getAppTypeUserLogin == 'teacher'" />
    <DashboardAdmin v-else-if="getAppTypeUserLogin == 'supperSys'" />
    <DashboardSupperPlus v-else-if="getAppTypeUserLogin == 'supperPlus'" />
    <DashboardParent v-else-if="getAppTypeUserLogin == 'parent'" />
  </div>
</template>

<script>
import DashboardPlus from "./DashboardPlus.vue";
import DashboardTeacher from "./DashboardTeacher.vue";
import DashboardAdmin from "./DashboardAdmin.vue";
import DashboardSupperPlus from "./DashboardSupperPlus.vue";
import DashboardParent from "./DashboardParent.vue";
export default {
  components: {
    DashboardPlus,
    DashboardTeacher,
    DashboardAdmin,
    DashboardSupperPlus,
    DashboardParent,
  },

  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
};
</script>
