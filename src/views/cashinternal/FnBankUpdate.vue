<template>
  <el-dialog
    :title="'Sửa thông tin tài khoản'"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="120px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-row>
        <div>
          <el-form-item label="Tên ngân hàng" style="width: 400px" prop="bankName">
            <el-input v-model="dataInput.bankName" />
          </el-form-item>
          <el-form-item
            label="Số tài khoản"
            style="width: 400px; float: right; margin-right: 20px; margin-top: -62px"
            prop="accountNumber"
          >
            <el-input v-model="dataInput.accountNumber" />
          </el-form-item>

          <el-form-item label="Chủ tài khoản" style="width: 400px" prop="fullName">
            <el-input v-model="dataInput.fullName" />
          </el-form-item>

          <el-form-item
            label="Chi nhánh"
            style="width: 400px; float: right; margin-right: 20px; margin-top: -62px"
          >
            <el-input v-model="dataInput.branch" />
          </el-form-item>

          <el-form-item label="Mô tả" style="width: 100%" prop="content">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="Nhập nội dung mô tả"
              v-model="dataInput.description"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-row>
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
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import CashInternalService from "@/services/CashInternalService";

export default {
  components: {},
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      dataInput: {},

      loadingButton: false,
      rules: {
        bankName: [
          {
            required: true,
            message: "Tên ngân hàng không được để trống",
            trigger: "blur",
          },
        ],
        accountNumber: [
          {
            required: true,
            message: "Số tài khoản không được để trống",
            trigger: "blur",
          },
        ],
        fullName: [
          {
            required: true,
            message: "Chủ tài khoản không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    dataInput: {
      deep: true,
    },
  },
  computed: {},
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          CashInternalService.updatBankInfo(this.dataInput)
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
        } else {
          console.log("error validate data!");
        }
      });
    },
    getDataInitial(id) {
      CashInternalService.getByIdBank(id)
        .then((resp) => {
          this.dataInput = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
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
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
  background: #e7e9ec;
  border: 1px solid #dcdfe6;
}
.el-input-number {
  width: 100%;
}
</style>
