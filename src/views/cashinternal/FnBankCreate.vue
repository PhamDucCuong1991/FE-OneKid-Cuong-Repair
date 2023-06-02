<template>
  <div>
    <el-dialog
      :title="'Thêm tài khoản ngân hàng'"
      :visible.sync="dialogVisible"
      width="816px"
      onload="window.print()"
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
        <el-form-item
          label="Tên ngân hàng"
          style="display: inline-block; width: 47%"
          prop="bankName"
        >
          <el-input v-model="dataInput.bankName" />
        </el-form-item>
        <el-form-item
          type="number"
          min="0"
          max="0"
          label="Số tài khoản"
          style="float: right; display: inline-block; width: 47%"
          prop="accountNumber"
        >
          <el-input v-model="dataInput.accountNumber" />
        </el-form-item>

        <el-form-item
          label="Chủ tài khoản"
          style="display: inline-block; width: 47%"
          prop="fullName"
        >
          <el-input v-model="dataInput.fullName" />
        </el-form-item>

        <el-form-item
          label="Chi nhánh"
          prop="branch"
          style="float: right; display: inline-block; width: 47%"
        >
          <el-input v-model="dataInput.branch" />
        </el-form-item>

        <el-form-item label="Mô tả" prop="description">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="Nhập nội dung mô tả"
            v-model="dataInput.description"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <!-- <el-button class="button-over" type="success" @click="generateReport()">
          <i class="el-icon-printer" />
          In hóa đơn
        </el-button> -->
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
    <PeopleTypeCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
  </div>
</template>

<script>
import CashInternalService from "@/services/CashInternalService";
import PeopleTypeCreate from "./PeopleTypeCreate.vue";
import http from "../../http-download";
import moment from "moment";
export default {
  components: { PeopleTypeCreate },
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      textarea: "",
      typeInternalList: [],
      pickerOptions: {},
      selectDate: "",
      dataInput: {},
      showCreateDialog: false,
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

  computed: {},
  methods: {
    generateReport() {
      this.$confirm("Bạn có chắc chắn muốn xuất file pdf không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
        return http.get(`/pdf/export`).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "THONG_KE_DIEM_DANH_" + myDate + ".xlsx");
          document.body.appendChild(link);
          link.click();
        });
      });
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          CashInternalService.createBankInfo(this.dataInput)
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
          return false;
        }
      });
    },
    printWindow() {
      window.print();
    },
    createDialogMethod() {
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
    },
    getDataInternalBeforeSelect() {
      CashInternalService.findByTypeInteral().then((resp) => {
        this.code = resp.data.data.code;
        this.date = resp.data.data.date;
        this.peopleTypeInternalList = resp.data.data.peopleTypeInternalList;
        this.peopleTypeOtherList = resp.data.data.peopleTypeOtherList;
        this.paymentNote = resp.data.data.paymentNote;
      });
    },

    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
      }, 300);
    },

    resetFormData() {
      this.$refs["newBrand"].resetFields();
    },
  },

  beforeMount() {
    this.getCurrentDate();
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
// /deep/.el-input__inner {
//   width: 88%;
// }
/deep/.el-button--primary {
  background: #409eff;
  float: right;
  margin-top: -62px;
  margin-top: -41px;
  margin-left: 37px;
  margin-right: -66px;
}
// /deep/.el-input--suffix .el-input__inner {
//   padding-right: 16px;
//   width: 220px;
// }
</style>
