<template>
  <el-dialog
    title="Thêm mới nhóm học phí"
    :visible.sync="dialogVisible"
    width="700px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-form-item label="Tên nhóm" prop="name">
        <el-input
          v-model="dataInput.name"
          @keyup.enter.native="submitForm('dataInput')"
          placeholder="Nhập tên nhóm"
        ></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="note">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="dataInput.note"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import FinanceStatisticalService from "@/services/FinanceStatisticalService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {
        name: "",
        note: "",
      },
      loadingButton: false,
      rules: {
        name: [
          {
            required: true,
            message: "Tên nhóm không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          FinanceStatisticalService.createPackageGroup(this.dataInput)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialog();
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input__inner,
/deep/.el-textarea__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>
