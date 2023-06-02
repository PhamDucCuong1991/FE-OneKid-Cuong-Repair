<template>
  <el-dialog
    title="Thêm mới lớp học"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="110px"
      :model="newClass"
      label-position="left"
      :rules="rules"
      ref="newClass"
    >
      <!-- chọn khối -->
      <el-form-item label="Chọn khối" prop="idGrade">
        <el-select
          class="select-grade"
          v-model="newClass.idGrade"
          placeholder="Chọn khối"
        >
          <el-option
            v-for="item in gradeList"
            :key="item.id"
            :value="item.id"
            :label="item.gradeName"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Tên lớp học" prop="className">
        <el-input
          v-model="newClass.className"
          @keyup.enter.native="submitForm('newClass')"
          placeholder="Nhập tên lớp"
        ></el-input>
      </el-form-item>

      <el-form-item label="Mô tả" prop="classDescription">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="newClass.classDescription"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('newClass')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('newClass')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MaClassService from "@/services/MaClassService";
import {mapState} from "vuex";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      newClass: {
        className: "",
        classDescription: "",
        idGrade: "",
      },
      gradeList: [],
      newClassCreated: null,
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
      this.$refs["newClass"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    resetFormData() {
      this.$refs["newClass"].resetFields();
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          MaClassService.create(this.newClass)
            .then((response) => {
              this.newClassCreated = response.data.data;
              this.$message({
                message: "Thêm mới lớp thành công",
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
    getAllGradeInitial() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
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
.select-grade {
  width: 100%;
}
</style>
