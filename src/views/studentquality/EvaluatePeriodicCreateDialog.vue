<template>
  <el-dialog
    :title="'Nhận xét học sinh: '+dataFullName"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <el-form
      label-width="120px"
      :model="evaluteMonthContent"
      label-position="top"
      :rules="rules"
      ref="evaluteMonthContent"
    >
      <el-form-item label="Nội dung nhận xét" prop="content">
        <el-input
          :rows="8"
          type="textarea"
          v-model="evaluteMonthContent.content"
          placeholder="Nhập Nội dung"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          action
          :on-change="handleChange"
          :file-list="multipartFileList"
          :on-exceed="handleExceedEvaluateDate"
          :on-remove="handleRemove"
          :auto-upload="false"
          limit="3"
          multiple
        >
          <el-button size="small" type="text" style="text-decoration: underline">Thêm file</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('evaluteMonthContent')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('evaluteMonthContent')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import EvaluateService from "@/services/EvaluateService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataFullName:"",
      idKid:"",
      evaluteMonthContent: {
        content: "",
      },
      multipartFileList: [],
      evaluateWeekDataList: [],
      evaluateMonthDataList: [],
      loadingButton: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.resetData();
        this.$refs["evaluteMonthContent"].resetFields();
      }, 200);
    },
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.resetData();
        this.$refs[fromData].resetFields();
      }, 200);
    },
    resetData() {
      this.multipartFileList = [];
      this.evaluteMonthContent.content = "";
      this.idKidList = [];
    },
    handleChange(file, fileList) {
      this.multipartFileList = fileList;
    },
    handleRemove(file) {
      this.multipartFileList.splice(this.multipartFileList.indexOf(file), 1);
    },
    /**
     * cảnh báo khi chọn quá 3 file
     */
    handleExceedEvaluateDate() {
      this.$message.warning(`Giới hạn là 3 file`);
    },
    /**
     * create evaluate periodic
     */
    submitForm(fromData) {
        let inputData = this.evaluteMonthContent;
        let formDatas = new FormData();
        for (var key in inputData) {
          formDatas.append(key, inputData[key]);
        }
        if (this.multipartFileList.length > 0) {
          this.multipartFileList.forEach((x) => {
            formDatas.append("multipartFileList", x.raw);
          });
        }
        this.loadingButton = true;
        EvaluateService.createEvaluatePeriodicOne(this.idKid, formDatas)
          .then((resp) => {
            let checkUpdate = resp.data.data;
            console.log(checkUpdate);
            this.$message({
              message: "Tạo nhận xét định kỳ thành công",
              type: "success",
            });
            setTimeout(() => {
              this.closeDialogByButton(fromData);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Tạo nhận xét định kỳ thất bại",
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButton = false;
            }, 500);
          });
    },
    getDataInitial(row) {
      this.dataFullName = row.fullName;
      this.idKid = row.id;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
// /deep/.el-dialog__body {
//   padding-top: 0;
//   padding-bottom: 0;
// }
</style>