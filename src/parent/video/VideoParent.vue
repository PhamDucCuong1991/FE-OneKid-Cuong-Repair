<template>
  <div class="content">
    <div style="margin-bottom: 20px">
      <span style="margin-right: 30px; color: #606266">Chọn nguồn video </span>
      <el-radio-group v-model="type" @change="changeTypeMethod()">
        <el-radio label="classType">Lớp</el-radio>
        <el-radio label="schoolType">Trường</el-radio>
        <el-radio label="OnekidsType">Onekids</el-radio>
      </el-radio-group>
    </div>
    <div v-if="src == ''" style="text-align: center; font-size: 20px">
      Không có dữ liệu
    </div>
    <div v-else class="table-content row-data">
      <iframe width="100%" height="920" allowfullscreen :src="src"> </iframe>
    </div>
  </div>
</template>
<script>
import ParentService from "@/services/ParentService";

export default {
  data() {
    return {
      responseData: "",
      type: "classType",
      src: "",
    };
  },
  methods: {
    changeTypeMethod() {
      if (this.type === "classType") {
        this.src = this.responseData.linkClass;
      } else if (this.type === "schoolType") {
        this.src = this.responseData.linkSchool;
      } else if (this.type === "OnekidsType") {
        this.src = this.responseData.linkOnekids;
      }
    },
    searchByProperties() {
      ParentService.getVideoParentService()
        .then((resp) => {
          let data = (this.responseData = resp.data.data);
          this.src = data.linkClass;
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
