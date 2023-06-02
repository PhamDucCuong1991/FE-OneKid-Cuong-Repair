<template>
  <el-dialog
    title="Cập nhật khối học"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="editGrade"
      label-position="left"
      :rules="rules"
      ref="editGrade"
    >
      <el-form-item label="Tên khối học" prop="gradeName">
        <el-input v-model="editGrade.gradeName" placeholder="Nhập tên khối"></el-input>
      </el-form-item>
      <el-form-item label="Mô tả" prop="gradeDescription">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="editGrade.gradeDescription"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import GradeService from "@/services/GradeService";
export default {
  props: {
    dialogVisible: null,
    editGrade: null,
  },
  data() {
    return {
      loadingButton: false,
      rules: {
        gradeName: [
          {
            required: true,
            message: "Tên khối không được để trống",
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
        this.$refs["editGrade"].resetFields();
      }, 300);
    },
    submitForm() {
      this.$refs["editGrade"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          GradeService.update(this.editGrade.id, this.editGrade)
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
</style>
