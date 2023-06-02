<template>
  <el-dialog
    title="Cập nhật số điện thoại nhận tin nhắn SMS"
    :visible.sync="dialogVisible"
    width="550px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="15vh"
  >
    <el-form
      :model="userData"
      label-width="140px"
      label-position="left"
      :rules="rules"
      ref="userData"
    >
      <el-form-item label="Số điện thoại cũ">
        <span>{{ userData.oldPhone }}</span>
      </el-form-item>
      <el-form-item label="Số điện thoại mới" prop="newPhone">
        <el-input
          type="number"
          min="0"
          max="0"
          v-model.trim="userData.newPhone"
          placeholder="Nhập Số điện thoại nhận SMS"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        type="success"
        :loading="loadingButton"
        size="medium"
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import CommonOnekidsService from "@/services/CommonOnekidsService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      userData: {
        id: "",
        appType: "",
        oldPhone: "",
        newPhone: "",
      },
      loadingButton: false,
      rules: {
        newPhone: [
          {
            min: 10,
            max: 10,
            message: "Số điện thoại bao gồm 10 số",
            trigger: "change",
          },
          {
            required: true,
            message: "Số điện thoại không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      this.resetFormData();
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      this.resetFormData();
    },
    resetFormData() {
      setTimeout(() => {
        this.$refs["userData"].resetFields();
      }, 200);
    },
    submitForm() {
      this.$refs["userData"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          CommonOnekidsService.updatePhoneSMS(this.userData)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });

              setTimeout(() => {
                this.closeDialogByButton();
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
    getChangePhoneSMSInitial(objectData) {
      this.userData = objectData;
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
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
// .grid-content-over{
//     margin-bottom: 10px;
// }
.el-row {
  margin-bottom: 20px;
}
.space-right {
  margin-right: 15px;
}
</style>
