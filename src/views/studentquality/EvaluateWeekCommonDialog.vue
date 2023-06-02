<template>
  <el-dialog
    title="Nhận xét chung"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="7vh"
  >
    <el-form
      label-width="120px"
      :model="evaluteWeekContent"
      label-position="top"
      :rules="rules"
      ref="evaluteWeekContent"
    >
      <el-form-item label="Nội dung nhận xét" prop="content">
        <el-input
          :rows="8"
          type="textarea"
          v-model="evaluteWeekContent.content"
          placeholder="Nhập Nội dung nhận xét tuần"
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
          <el-button size="small" type="text" style="text-decoration:underline">Thêm file</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('evaluteWeekContent')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('evaluteWeekContent')"
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
      evaluteWeekContent: {
        content: "",
      },
      multipartFileList: [],
      evaluateWeekDataList: [],
      loadingButton: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.resetData();
        this.$refs["evaluteWeekContent"].resetFields();
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
      this.evaluteWeekContent.content = "";
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
     * lưu đánh giá tuần cho nhiều học sinh
     */
    submitForm(fromData) {
      let kidList = this.evaluateWeekDataList;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm(
        "Bạn có chắc chắn muốn lưu nhận xét tuần cho " +
          kidList.length +
          " học sinh đã chọn?",
        "Lưu nhận xét",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        let inputData = this.evaluteWeekContent;
        let formDatas = new FormData();
        for (var key in inputData) {
          formDatas.append(key, inputData[key]);
        }
        if (this.multipartFileList.length > 0) {
          this.multipartFileList.forEach((x) => {
            formDatas.append("multipartFileList", x.raw);
          });
        }
        if (kidList.length > 0) {
          kidList.forEach((x) => {
            formDatas.append("idKidList", x.id);
          });
        }
        this.loadingButton = true;
        EvaluateService.saveEvaluateWeekCommon(formDatas)
          .then((resp) => {
            let checkUpdate = resp.data.data;
            console.log(checkUpdate);
            this.$message({
              message: "Lưu nhận xét tuần cho nhiều học sinh thành công",
              type: "success",
            });
            setTimeout(() => {
              this.closeDialogByButton(fromData);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Lưu nhận xét tuần cho nhiều học sinh thất bại",
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButton = false;
            }, 500);
          });
      });
    },
    getEvaluateWeekKidsInitial(data) {
      this.evaluateWeekDataList = data;
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
/deep/.el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
</style>