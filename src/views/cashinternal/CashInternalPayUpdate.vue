<template>
  <div>
    <el-dialog
      :title="'Sửa phiếu 1'"
      :visible.sync="dialogVisible"
      width="920px"
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
        <el-row>
          <div>
            <el-form-item label="Số tiền chi" style="width: 350px" prop="money">
              <el-currency-input v-model="dataInput.money" />
            </el-form-item>

            <el-form-item
              label="Ngày thu"
              style="width: 350px; float: right; margin-right: 20px; margin-top: -62px"
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

            <el-form-item
              label="Người chi"
              style="width: 350px"
              prop="idPeopleTypeInternal"
            >
              <el-select
                v-model="dataInput.idPeopleTypeInternal"
                filterable
                placeholder="Tên người chi"
              >
                <el-option
                  v-for="item in peopleTypeInternalList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="Người nhận"
              style="width: 320px; float: right; margin-right: 50px; margin-top: -62px"
              prop="idPeopleTypeOther"
            >
              <el-select
                v-model="dataInput.idPeopleTypeOther"
                filterable
                placeholder="Nhập tên người nhận"
              >
                <el-option
                  v-for="item in peopleTypeOtherList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Nội dung" style="width: 100%" prop="content">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="Nhập nội dung"
                v-model="dataInput.content"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              v-if="status == false && dataInput.approved"
              label="Thanh toán"
              style="width: 100%"
              prop="payment"
            >
              <el-radio-group v-model="dataInput.payment">
                <el-radio :label="true">Đã thanh toán</el-radio>
                <el-radio :label="false">Chưa thanh toán</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              v-else-if="status == true"
              label="Thanh toán"
              style="width: 100%"
              prop="payment"
            >
              <el-radio-group v-model="dataInput.payment">
                <el-radio :label="true">Đã thanh toán</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-else label="Thanh toán" style="width: 100%" prop="payment">
              <el-radio-group v-model="dataInput.payment">
                <el-radio :label="false">Chưa thanh toán</el-radio>
              </el-radio-group>
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
      rules: {
        money: [
          {
            required: true,
            message: "Số tiền chi không được để trống",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "Ngày thu không được để trống",
            trigger: "blur",
          },
        ],
        pay: [
          {
            required: true,
            message: "Trạng thái không được để trống",
            trigger: "blur",
          },
        ],
        idPeopleTypeInternal: [
          {
            required: true,
            message: "Người chi không được để trống",
            trigger: "blur",
          },
        ],
        idPeopleTypeOther: [
          {
            required: true,
            message: "Người nhận không được để trống",
            trigger: "blur",
          },
        ],
        payment: [
          {
            required: true,
            message: "Trạng thái thanh toán không được để trống",
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
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          CashInternalService.updateCash(this.dataInput.id, this.dataInput)
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
    createDialogMethod() {
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
    },

    getDataInitial(id) {
      CashInternalService.getByIdCashinternal(id)
        .then((resp) => {
          this.dataInput = resp.data.data;
          this.peopleTypeInternalList = resp.data.data.peopleTypeInternalList;
          this.peopleTypeOtherList = resp.data.data.peopleTypeOtherList;
          this.status = resp.data.data.payment;
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
/deep/.el-textarea__inner {
  width: 94%;
}
/deep/.el-input--suffix .el-input__inner {
  padding-right: 16px;
  width: 220px;
}
</style>
