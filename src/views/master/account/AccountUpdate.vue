<template>
  <el-dialog
    title="Cập nhật tài khoản"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="7vh"
  >
    <el-form
      label-width="130px"
      :model="rowData"
      label-position="left"
      :rules="rules"
      ref="rowData"
    >
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="Họ tên" prop="fullName">
            <el-input v-model="rowData.fullName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="Kích hoạt">
            <el-checkbox v-model="rowData.activated"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="Username" prop="username">
            <el-input v-model="rowData.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Password" prop="passwordShow">
            <el-input v-model="rowData.passwordShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Dùng thử">
        <el-checkbox v-model="rowData.trialStatus"></el-checkbox>
      </el-form-item>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="Giới hạn time">
            <el-checkbox
              :disabled="rowData.trialStatus"
              v-model="rowData.unlimitTime"
            ></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Giới hạn time thử">
            <el-checkbox
              :disabled="!rowData.trialStatus"
              v-model="rowData.demoStatus"
            ></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="Ngày bắt đầu">
            <el-date-picker
              :disabled="rowData.trialStatus"
              value-format="yyyy-MM-dd"
              v-model="rowData.fromDate"
              placeholder="Chọn ngày"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Ngày kết thúc">
            <el-date-picker
              :disabled="rowData.trialStatus"
              value-format="yyyy-MM-dd"
              v-model="rowData.toDate"
              placeholder="Chọn ngày"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="Bắt đầu dùng thử">
            <el-date-picker
              :disabled="!rowData.trialStatus"
              value-format="yyyy-MM-dd"
              v-model="rowData.fromDemoDate"
              placeholder="Chọn ngày"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Kết thúc dùng thử">
            <el-date-picker
              :disabled="!rowData.trialStatus"
              value-format="yyyy-MM-dd"
              v-model="rowData.toDemoDate"
              placeholder="Chọn ngày"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        size="medium"
        @click="closeDialogByButton('rowData')"
      >
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm('rowData')"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import AccountService from "@/services/AccountService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      rowData: {},
      loadingButton: false,
      rules: {
        fullName: [
          {
            required: true,
            message: "Họ tên không được để trống",
            trigger: "blur",
          },
        ],
        username: [
          {
            required: true,
            message: "Tên đăng nhập không được để trống",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Tên đăng nhập phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9@.]*$/,
            message: "Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm",
            trigger: "blur",
          },
        ],
        passwordShow: [
          {
            required: true,
            message: "Mật khẩu không được để trống",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mật khẩu phải lớn hơn hoặc bằng 6 ký tự",
            trigger: "blur",
          },
          {
            pattern: /^[a-zA-Z0-9@.]*$/,
            message: "Chỉ cho phép các kí tự a-z, A-Z, 0-9, @ và dấu chấm",
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
        this.$refs["rowData"].resetFields();
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
      this.$refs["rowData"].resetFields();
    },
    submitForm(fromData) {
      this.$refs[fromData].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let data = this.rowData;
          AccountService.updateAccountUser(data)
            .then((resp) => {
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
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getDataInitial(row) {
      this.rowData = row;
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
}
</style>
