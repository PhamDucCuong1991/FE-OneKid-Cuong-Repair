<template>
  <div class="content">
    <div v-if="responseData.length == 0" style="text-align: center; font-size: 20px">
      Không có dữ liệu
    </div>
    <span v-else>
      <div v-for="item in responseData" :key="item">
        <iframe width="100%" height="920" allowfullscreen :src="item"> </iframe>
      </div>
    </span>
  </div>
</template>
<script>
import ParentService from "@/services/ParentService";

export default {
  data() {
    return {
      responseData: "",
    };
  },
  methods: {
    searchByProperties() {
      ParentService.getVideoOtherParentService()
        .then((resp) => {
          this.responseData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  beforeMount() {
    this.searchByProperties();
  },
};
</script>
<style lang="scss" scoped></style>
