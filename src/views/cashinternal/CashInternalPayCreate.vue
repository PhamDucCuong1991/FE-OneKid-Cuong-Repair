<template>
  <div>
    <el-dialog
      :title="'Tạo phiếu chi mới'"
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
          label="Ngày chi"
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
            :clearable="false"
            placeholder="Chọn ngày chi"
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
            placeholder="Nhập tên người chi"
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
          style="
            width: 320px;
            float: right;
            margin-right: 50px;
            margin-top: -62px;
          "
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

          <!-- <el-tooltip
            v-if="checkPermission(['cashInternal_people_update'])"
            class="item"
            effect="dark"
            content="Thêm đối tượng người nhận"
            placement="top"
          >
            <el-button
              @click="createDialogMethod()"
              type="primary"
              icon="el-icon-plus"
            ></el-button>
          </el-tooltip> -->
        </el-form-item>

        <el-form-item label="Nội dung" style="width: 95%" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="Nhập nội dung"
            v-model="dataInput.content"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="Thanh toán" style="width: 100%" prop="payment">
          <el-radio-group v-if="paymentNote" v-model="dataInput.payment">
            <el-radio :label="true">Đã thanh toán</el-radio>
            <el-radio :label="false">Chưa thanh toán</el-radio>
          </el-radio-group>

          <el-radio-group v-else v-model="dataInput.payment">
            <el-radio :label="false">Chưa thanh toán</el-radio>
          </el-radio-group>
        </el-form-item>
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
import checkPermission from "@/utils/permission.js";
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
      paymentNote: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      selectDate: "",
      dataInput: {
        date: "",
        idPeopleTypeOther: "",
        idPeopleTypeInternal: "",
      },
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
  methods: {
    checkPermission,
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          CashInternalService.createCashInternalOut(this.dataInput)
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

    createDialogMethod() {
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
    },
    getDataInternalBeforeSelect() {
      this.dataInput.date = this.moment().format("YYYY-MM-DD");
      CashInternalService.findByTypeInteral().then((resp) => {
        this.code = resp.data.data.code;
        this.date = resp.data.data.date;
        this.peopleTypeInternalList = resp.data.data.peopleTypeInternalList;
        this.peopleTypeOtherList = resp.data.data.peopleTypeOtherList;
        this.paymentNote = resp.data.data.paymentNote;
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
/deep/.el-dialog__body {
  padding-right: 30px;
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
  width: 86%;
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 99%;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/.el-button--primary {
  background: #409eff;
  float: right;
  margin-top: -62px;
  margin-top: -41px;
  margin-left: 37px;
  margin-right: -60px;
}
/deep/.el-input--suffix .el-input__inner {
  padding-right: 16px;
  width: 215px;
}
</style>
