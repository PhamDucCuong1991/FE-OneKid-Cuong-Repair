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
      :model="evalutePeriodicContent"
      label-position="top"
      :rules="rules"
      ref="evalutePeriodicContent"
    >
      <el-form-item label="Nội dung nhận xét" prop="content">
        <el-input
          :rows="8"
          type="textarea"
          v-model="evalutePeriodicContent.content"
          placeholder="Nhập Nội dung nhận xét tháng"
        ></el-input>
      </el-form-item>
      <el-form-item label="File đính kèm">
        <el-button type="text" size="medium">Thêm File</el-button>
        {{evalutePeriodicContent.urlFileList}}
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('evalutePeriodicContent')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('evalutePeriodicContent')"
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
      evalutePeriodicContent: {
        content: "",
        urlFileList: "",
      },
      evaluatePeriodicDataList: [],
      loadingButton: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["evalutePeriodicContent"].resetFields();
      }, 200);
    },
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 200);
    },
    /**
     * set data cho nhiều học sinh
     */
    setDataForKids() {
      this.evaluatePeriodicDataList.forEach((x) => {
        let content = this.evalutePeriodicContent.content;
        let file = this.evalutePeriodicContent.urlFileList;
        x.content = content;
        if (file != null && file.trim() != "") {
          x.urlFileList = file;
        }
      });
    },
    /**
     * lưu đánh giá định kỳ cho nhiều học sinh
     */
    submitForm(fromData) {
      this.setDataForKids();
      let kidList = this.evaluatePeriodicDataList;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm(
        "Bạn có chắc chắn muốn lưu nhận xét định kỳ cho " +
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
        this.loadingButton = true;
        EvaluateService.saveEvaluatePeriodicMany(kidList)
          .then((resp) => {
            let checkUpdate = resp.data.data;
            console.log(checkUpdate);
            this.$message({
              message: "Lưu nhận xét định kỳ cho nhiều học sinh thành công",
              type: "success",
            });
            setTimeout(() => {
              this.closeDialogByButton(fromData);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Lưu nhận xét định kỳ cho nhiều học sinh thất bại",
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
    getEvaluatePeriodicKidsInitial(data) {
      this.evaluatePeriodicDataList = data;
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