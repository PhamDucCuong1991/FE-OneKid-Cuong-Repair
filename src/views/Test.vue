<template>
  <div class="container">
    <div id="app">
      <el-link icon="el-icon-download" @click="download()" href=""
        >Download</el-link
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "https://upload1.onekids.edu.vn/1/savefile/thanh.zip",
      links: [],
      state1: "",
      state2: "",
      name: "",
    };
  },
  methods: {
    download() {
      alert("https://upload1.onekids.edu.vn/1/savefile/thanh.zip");
    },
  },
  mounted() {
    this.links = this.loadAll();
  },
};
</script>
