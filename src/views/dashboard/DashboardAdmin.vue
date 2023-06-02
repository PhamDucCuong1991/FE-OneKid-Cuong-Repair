<template>
  <h1 style="text-align: center; color: blue; font-size: 40px">
    Trang chủ dành cho người quản lý hệ thống
  </h1>
</template>
<script>
export default {
  data() {
    return {
      var: "",
    };
  },
  created() {
    sessionStorage.removeItem("breadcrumbList");
    this.$store.dispatch("layout/setBreadcrumbActions", []);
  },
};
</script>
<style scoped></style>
