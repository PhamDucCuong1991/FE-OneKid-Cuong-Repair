<template>
  <el-dialog
      title="Chuyển lớp học sinh"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
  >
    <el-form
        label-width="160px"
        :model="dataImput"
        label-position="left"
        :rules="rules"
        ref="dataImput"
    >
      <el-form-item label="Chọn lớp chuyển tới" prop="idClass">
        <el-select
            v-model="dataImput.idClass"
            filterable
            clearable
            placeholder="Chọn lớp học"
            style="width: 100%"
        >
          <el-option
              v-for="item in classList"
              :key="item.id"
              :value="item.id"
              :label="item.className"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('dataImput')">
        <i class="el-icon-circle-close"/>
        <span>Đóng</span>
      </el-button>
      <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm('dataImput')"
      >
        <i class="el-icon-circle-check"/>
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import StudentService from "@/services/StudentService";
import {mapActions, mapState} from "vuex";

export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataSuccess: null,
      loadingButton: false,
      classList: [],
      dataImput: {
        idClass: "",
        kidList: [],
      },
      rules: {
        idClass: [
          {
            required: true,
            message: "Lớp không được để trống",
            trigger: "blur",
          },
          {
            required: true,
            message: "Lớp không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    //reset when click x
    closeDialog() {
      this.$refs["dataImput"].resetFields();
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },

    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let a = this.dataImput;
          console.log(a);
          StudentService.changeClass(this.dataImput)
              .then((response) => {
                this.dataSuccess = response.data.data;
                this.$message({
                  message: "Chuyển đổi lớp thành công",
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
    getClassDataInitial(data) {
      this.dataImput.kidList = data;
      this.classList = mapState(['serverDataClass'])
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner,
/deep/ .el-textarea__inner {
  border: none;
  border-radius: 0;
  resize: none;
  padding-left: 0;
  padding-right: 0;
  border-bottom: 1px solid #d9d9d9;
}

/deep/ .el-dialog__title {
  font-size: 25px;
  color: #606266;
}

/deep/ .el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}

/deep/ .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}

/deep/ .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
</style>
