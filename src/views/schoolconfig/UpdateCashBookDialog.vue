<template>
  <div>
    <el-dialog
      :title="'Cập nhật số dư đầu kì năm ' + year"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="10vh"
    >
      <el-form :model="dataInput" :rules="rules" ref="dataInput" label-width="120px">
        <el-form-item prop="moneyStart" label="Số dư đầu kỳ">
          <el-currency-input v-model="dataInput.moneyStart" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          :loading="loadingButton"
          type="success"
          size="medium"
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>{{ $t("button.save") }}</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SchoolConfigService from "@/services/SchoolConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {},
      loadingButton: false,
      year: "",
      rules: {
        moneyStart: [
          {
            required: true,
            message: "Số dư đầu kỳ không được để trống",
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
        this.loadingButton = false;
      }, 300);
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          this.$confirm("Bạn có chắc chắn muốn cập nhật số dư đầu kỳ?", "Thông báo!", {
            distinguishCancelAndClose: true,
            confirmButtonText: "Có",
            closeOnClickModal: false,
            cancelButtonText: "Không",
          })
            .then(() => {
              SchoolConfigService.updateMoneyCashBook(this.dataInput)
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
                  let messageText =
                    err.response.status == 403
                      ? this.$permissionDenied
                      : err.response.data.message;
                  this.$message({
                    message: messageText,
                    type: "error",
                  });
                })
                .finally(() => {
                  setTimeout(() => {
                    this.loadingButton = false;
                  }, 500);
                });
            })
            .catch(() => {
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
      this.dataInput.id = row.id;
      this.dataInput.moneyStart = row.moneyStart;
      this.dataInput.locked = row.locked;
      this.year = row.year;
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
.input-common {
  margin-right: 5px;
}
</style>
