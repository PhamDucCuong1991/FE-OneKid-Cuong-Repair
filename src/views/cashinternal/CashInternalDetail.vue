<template>
  <div>
    <el-dialog
      :title="'Mã phiếu: ' + dataInput.code"
      :visible.sync="dialogVisible"
      width="950px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="10vh"
    >
      <el-form
        label-width="100px"
        :model="dataInput"
        label-position="left"
        :rules="rules"
        ref="dataInput"
      >
        <el-form-item label="Số tiền chi" style="width: 350px" prop="money">
          <el-currency-input v-model="dataInput.money" />
        </el-form-item>
        <el-form-item
          label="Ngày thu"
          style="
            width: 350px;
            float: right;
            margin-right: 20px;
            margin-top: -62px;
          "
          prop="date"
        >
          <el-date-picker
            class="button-left-class1"
            v-model="dataInput.date"
            type="date"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            :disabled="checkDisable"
            placeholder="Chọn ngày"
            :picker-options="pickerOptions"
          >
            ></el-date-picker
          >
        </el-form-item>

        <el-form-item label="Người chi" style="width: 350px">
          <el-input v-model="dataInput.nameInternal"></el-input>
        </el-form-item>

        <el-form-item
          label="Người nhận"
          style="
            width: 320px;
            float: right;
            margin-right: 50px;
            margin-top: -62px;
          "
        >
          <el-input v-model="dataInput.nameOther"></el-input>
        </el-form-item>

        <el-form-item label="Nội dung" style="width: 860px" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="Nhập nội dung"
            v-model="dataInput.content"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="Thanh toán" style="width: 100%" prop="payment">
          <el-radio-group v-model="dataInput.payment">
            <el-radio disabled :label="true">Đã thanh toán</el-radio>
            <el-radio disabled :label="false">Chưa thanh toán</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          class="button-over"
          type="success"
          @click="generateReport(dataInput.id)"
        >
          <i class="el-icon-printer" />
          In hóa đơn
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
import ElCurrencyInput from "@/components/ElCurrencyInput.vue";
import PeopleTypeCreate from "./PeopleTypeCreate.vue";
import http from "../../http-download";
import moment from "moment";
export default {
  components: { ElCurrencyInput, PeopleTypeCreate },
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
      rules: {},
    };
  },
  watch: {
    dataInput: {
      deep: true,
    },
  },
  computed: {},
  methods: {
    createDialogMethod() {
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
    },
    // xuất file excel
    generateReport(id) {
      this.$confirm(
        "Bạn có chắc chắn muốn xuất file pdf không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
        return http.get(`/pdfn/create/` + id).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          if (this.category == "in") {
            link.setAttribute("download", "PHIEU_THU_" + myDate + ".pdf");
          } else {
            link.setAttribute("download", "PHIEU_CHI_" + myDate + ".pdf");
          }
          document.body.appendChild(link);
          link.click();
        });
      });
    },
    getDataInitial(id) {
      CashInternalService.getByIdCashinternal(id)
        .then((resp) => {
          this.dataInput = resp.data.data;
          this.peopleTypeInternalList = resp.data.data.peopleTypeInternalList;
          this.peopleTypeOtherList = resp.data.data.peopleTypeOtherList;
          this.status = resp.data.data.payment;
          this.category = resp.data.data.category;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    getDataInternalBeforeSelect() {
      CashInternalService.findByTypeInteral().then((resp) => {
        this.code = resp.data.data.code;
        this.peopleTypeInternalList = resp.data.data.peopleTypeInternalList;
        this.peopleTypeOtherList = resp.data.data.peopleTypeOtherList;
        this.approve = resp.data.data.aprovedConfig;
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
/deep/.el-input__inner {
  width: 88%;
}
[data-v-83331a5a] .el-button--primary {
  background: #409eff;
  float: right;
  margin-top: -62px;
  margin-top: -41px;
  margin-left: 37px;
  margin-right: -66px;
}

.el-radio__input.is-disabled.is-checked .el-radio__inner::after {
  background-color: black;
}
/deep/.el-input__inner {
  width: 100%;
}
/deep/.el-input--suffix .el-input__inner {
  padding-right: 16px;
  width: 220px;
}
</style>
