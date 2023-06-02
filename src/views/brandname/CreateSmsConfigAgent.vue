<template>
  <el-dialog
    title="Thêm mới Brand name"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="120px"
      :model="newGrade"
      label-position="left"
      :rules="rules"
      ref="newGrade"
    >
      <el-form-item label="Tên brand" prop="brand name">
        <el-input
          v-model="newGrade.gradeName"
          @keyup.enter.native="submitForm('newGrade')"
          placeholder="Nhập tên brand"
        ></el-input>
      </el-form-item>
      <el-form-item label="link" prop="gradeDescription">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="newGrade.gradeDescription"
          placeholder="Link"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('newGrade')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('newGrade')"
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
    dialogVisible: null
  },
  data() {
    return {
      newGrade: {
        gradeName: "",
        gradeDescription: ""
      },
      newGradeCreated: null,
      loadingButton: false,
      rules: {
        gradeName: [
          {
            required: true,
            message: "Tên khối không được để trống",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["newGrade"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["newGrade"].resetFields();
    },
    submitForm(fromData) {
      this.$refs[fromData].validate(valid => {
        if (valid) {
          this.loadingButton = true;
          GradeService.create(this.newGrade)
            .then(response => {
              this.newGradeCreated = response.data.data;
              this.$message({
                message: "Thêm mới nhà cung cấp thành công",
                type: "success"
              });

              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch(err => {
              this.$message({
                message: "Thêm mới nhà cung cấp thất bại",
                type: "error"
              });
              console.log(err);
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500)
            })
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    }
  }
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