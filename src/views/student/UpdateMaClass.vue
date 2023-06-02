<template>
  <el-dialog
    title="Sửa thông tin lớp học"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="110px"
      :model="editClass"
      label-position="left"
      :rules="rules"
      ref="editClass"
    >
      <!-- chọn khối -->
      <el-form-item label="khối học">
        <el-input disabled v-model="editClass.grade.gradeName"></el-input>
      </el-form-item>

      <el-form-item label="Tên lớp học" prop="className">
        <el-input
          v-model="editClass.className"
          @keyup.enter.native="submitForm('editClass')"
          placeholder="Nhập tên lớp"
        ></el-input>
      </el-form-item>

      <el-form-item label="Mô tả" prop="classDescription">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="editClass.classDescription"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('editClass')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('editClass')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MaClassService from "@/services/MaClassService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      editClass: {
        id: "",
        className: "",
        classDescription: "",
      },
      gradeList: [],
      editClassCreated: null,
      loadingButton: false,
      rules: {
        className: [
          {
            required: true,
            message: "Tên lớp không được để trống",
            trigger: "blur",
          },
          {
            required: true,
            message: "Tên lớp không được để trống",
            trigger: "change",
          },
        ],
        idGrade: [
          {
            required: true,
            message: "Khối không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      setTimeout(() => {
        this.$refs["editClass"].resetFields();
      }, 500);
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 500);
      this.$emit("dialog-close");
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          MaClassService.update(this.editClass.id, this.editClass)
            .then((response) => {
              this.editClassCreated = response.data.data;
              this.$message({
                message: "Cập nhật lớp thành công",
                type: "success",
              });
              setTimeout(() => {
                this.closeDialogByButton(fromData);
              }, 500);
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
              console.log(err);
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getClassByIdMethod(idClass) {
      MaClassService.findClassNewById(idClass)
        .then((resp) => {
          this.editClass = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDataInitial(idClass) {
      this.getClassByIdMethod(idClass);
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
/deep/.el-dialog__footer {
  padding-top: 0;
}
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
  background: #e7e9ec;
  border-bottom: 1px solid #dcdfe6;
}
.select-grade {
  width: 100%;
}
</style>
