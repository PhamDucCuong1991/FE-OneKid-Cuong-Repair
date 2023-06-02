<template>
  <el-dialog
    title="Nội dung tin nhắn"
    :visible.sync="dialogVisible"
    width="45%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <div class="hr">
      <hr />
    </div>

    <div class="table-content row-data">
      <div class="content">
        <span style="font-size: 20px">Nội dung :</span>
        <el-input
          type="textarea"
          v-model="this.viewContent[0].content"
          :rows="12"
        ></el-input>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import HistorySmsService from "@/services/HistorySmsService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      viewContent: "",
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {}, 100);
    },
    getDetailMethod(id) {
      HistorySmsService.getById(id)
        .then((resp) => {
          let data = (this.viewContent = resp.data.data);
          this.content = data.content;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  margin-top: 20px;
  height: 20px;
}
.hasagi {
  float: right;
  margin-top: -23px;
}
.content {
  margin-top: 20px;
  max-height: 300px;
  // font-fa mily: Arial;
  font-size: 20px;
}
/deep/[data-v-6400a8d2] .el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: 17px;
  // font-family: serif;
  // color: #000000;
  background-color: #f0f0f0;
  background-image: none;
  // border: 1px solid #000000;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.file {
  margin-top: 45px;
}
.hr {
  margin-top: -40px;
}
/deep/.el-dialog__title {
  line-height: 24px;
  font-size: 30px;
  color: #5d5050;
}
/deep/.el-dialog__body {
  padding: 30px 20px;
  // color: #000000;
  font-size: 14px;
  word-break: break-all;
}
/deep/[data-v-6400a8d2] [data-v-6400a8d2] .el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: 15px;
  background-color: #ffffff;
  background-image: none;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #f0f0f0;
  background-image: none;
  // border: 1px solid #000000;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/.title[data-v-6400a8d2] {
  margin-top: 15px;
  height: 60px;
  font-size: 18px;
}
</style>
