<template>
  <el-dialog
    title="Đổi mật khẩu"
    :visible.sync="dialogVisible"
    width="570px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="160px"
      :model="passwordData"
      label-position="left"
      :rules="rules"
      ref="passwordData"
    >
      <el-form-item label="Mật khẩu cũ" prop="oldPassword">
        <el-input
          prefix-icon="el-icon-lock"
          v-model.trim="passwordData.oldPassword"
          @keyup.enter.native="submitForm('passwordData')"
          placeholder="Nhập mật khẩu cũ"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="Mật khẩu mới" prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          v-model.trim="passwordData.password"
          @keyup.enter.native="submitForm('passwordData')"
          placeholder="Nhập mật khẩu mới"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="Xác nhận mật khẩu" prop="confirmPassword">
        <el-input
          prefix-icon="el-icon-lock"
          v-model.trim="passwordData.confirmPassword"
          @keyup.enter.native="submitForm('passwordData')"
          placeholder="Nhập lại mật khẩu mới"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton('passwordData')">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('passwordData')"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import CredentialService from "@/services/CredentialService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== this.passwordData.password) {
        callback(new Error("Mật khẩu không khớp"));
      } else {
        callback();
      }
    };
    return {
      passwordData: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
      newGradeCreated: null,
      loadingButton: false,
      rules: {
        oldPassword: [
          {
            required: true,
            message: "Mật khẩu cũ không được để trống",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Mật khẩu mới không được để trống",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "Xác nhận mật khẩu không được để trống",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["passwordData"].resetFields();
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
      this.$refs["passwordData"].resetFields();
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          CredentialService.changePassword(this.passwordData)
            .then((resp) => {
              this.newGradeCreated = resp.data.data;
              this.$message({
                message: resp.data.message,
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
        }
      });
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
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
</style>
