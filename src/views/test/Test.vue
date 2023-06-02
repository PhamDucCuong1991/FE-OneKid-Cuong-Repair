<template>
  <div>
    this is test common
    <el-button type="primary" @click="abc()">test</el-button>
    <el-button type="primary" @click="api()">api</el-button>
  </div>
</template>

<script>
import baseUrl from "@/base-url.js";
export default {
  methods: {
    abc() {
      alert("test: " + baseUrl.mytest);
    },
    api() {
      alert("api: " + baseUrl.myApi);
    },
  },
};
</script>

<style lang="scss" scoped></style>
