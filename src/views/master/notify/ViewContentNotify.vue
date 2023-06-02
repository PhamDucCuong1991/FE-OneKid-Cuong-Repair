<template>
  <el-dialog
    title="Nội dung thông báo"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <div class="hr">
      <hr />
    </div>

    <div class="table-content row-data">
      <div class="content">
        <span>{{sendContentNotify}}</span>
      </div>
      <div class="hasagi">
        <el-button type="danger" @click="closeDialog()" icon="el-icon-circle-close">Đóng</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: null,
    sendContentNotify:null,
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
  text-align: right;
  margin-top: 23px;
}
.content {
  max-height: 300px;
  // font-family: Arial;
  font-size: 20px;
  margin-top: 20px;
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