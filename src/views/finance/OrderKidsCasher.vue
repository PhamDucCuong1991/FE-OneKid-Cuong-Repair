<template>
  <div>
    <el-dialog
      :title="'Thanh toán hóa đơn học phí: ' + orderCode + ' ' + titleInfoAdd"
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="1vh"
    >
      <div
        style="
          margin-bottom: 15px;
          display: inline-block;
          position: relative;
          z-index: 1;
        "
      >
        <el-radio-group
          v-model="dataSearch.category"
          @change="changeCategoryMethod()"
        >
          <el-radio label="both">Tổng hợp</el-radio>
          <el-radio label="in">Thu</el-radio>
          <el-radio label="out">Chi</el-radio>
        </el-radio-group>
      </div>
      <span style="margin-left: 745px"
        >Số tiền tính toán:
        <span v-if="moneyCheckTotal == 0" style="font-weight: bold">0</span>
        <span v-else style="font-weight: bold">{{
          moneyCheckTotal | formatCurrency
        }}</span>
      </span>
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseData.dataList"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="320"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          fixed
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          label="Tên khoản"
          prop="fnPackage.name"
          min-width="180"
        >
        </el-table-column>
        <el-table-column label="Loại" align="center" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
            <span v-if="scope.row.fnPackage.category == 'out'">Chi</span>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" align="center" width="95">
          <template slot-scope="scope">
            <span v-if="scope.row.paid == 0">Chưa đóng</span>
            <span v-else-if="scope.row.paid < scope.row.money">Thiếu</span>
            <span v-else>Đủ</span>
          </template></el-table-column
        >
        <el-table-column label="Khóa" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.locked">Đã khóa</span>
            <span v-else>Chưa khóa</span>
          </template>
        </el-table-column>
        <el-table-column label="Thành tiền" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.money == 0">0</span>
            <span v-else>{{ scope.row.money | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Đã trả" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.paid == 0">0</span>
            <span v-else>{{ scope.row.paid | formatCurrency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thiếu" align="right" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.money - scope.row.paid == 0">0</span>
            <span v-else>{{
              (scope.row.money - scope.row.paid) | formatCurrency
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" width="80">
          <template slot="header" slot-scope="scope">
            <div>Tính toán</div>
            <el-checkbox
              @change="checkRowMoneyAllMethod(scope.$index)"
              v-model="checkRowMoneyAll"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              :disabled="
                scope.row.locked ||
                Math.abs(scope.row.paid) >= Math.abs(scope.row.money)
                  ? true
                  : false
              "
              @change="checkedRowMoneyMethod()"
              v-model="scope.row.checkMoney"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" width="120">
          <template slot="header" slot-scope="scope">
            <div>Chọn khoản TT</div>
            <el-checkbox
              @change="checkRowSchooseAllMethod(scope.$index)"
              v-model="checkRowSchooseAll"
            ></el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              :disabled="
                scope.row.locked ||
                Math.abs(scope.row.paid) >= Math.abs(scope.row.money)
                  ? true
                  : false
              "
              @change="checkedRowMethod(scope.row)"
              v-model="scope.row.checked"
            ></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <div
        v-if="
          this.dataSearch.category == 'both' && !!this.responseData.description
        "
      >
        <el-checkbox v-model="checkNotOrder"></el-checkbox> &nbsp; In kèm ghi
        chú:
        {{ responseData.description }}
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="6" style="margin-right: 15px">
            <div class="">
              <div
                class="text-money"
                v-if="
                  dataSearch.category == 'in' || dataSearch.category == 'both'
                "
              >
                Số dư ví
                <span style="font-weight: bold; float: right; color: blue">
                  <span v-if="responseData.moneyWallet == 0">0</span>
                  <span v-else>{{
                    responseData.moneyWallet | formatCurrency
                  }}</span>
                </span>
              </div>
              <div class="text-money">
                Tổng tiền hóa đơn
                <span style="font-weight: bold; float: right">
                  <span v-if="responseData.moneyTotal == 0">0</span>
                  <span v-else>{{
                    responseData.moneyTotal | formatCurrency
                  }}</span>
                </span>
              </div>
              <div class="text-money">
                Tổng tiền đã trả
                <span style="font-weight: bold; float: right">
                  <span v-if="responseData.moneyTotalPaid == 0">0</span>
                  <span v-else>{{
                    responseData.moneyTotalPaid | formatCurrency
                  }}</span>
                </span>
              </div>
              <div class="text-money">
                Tiền còn lại phải trả
                <span style="font-weight: bold; float: right">
                  <span
                    v-if="
                      responseData.moneyTotal - responseData.moneyTotalPaid == 0
                    "
                    >0</span
                  >
                  <span v-else>{{
                    (responseData.moneyTotal - responseData.moneyTotalPaid)
                      | formatCurrency
                  }}</span>
                </span>
              </div>
              <hr
                style="
                  border-bottom: 1px solid #c0c4cc;
                  margin-top: -0.5em;
                  margin-bottom: 0.7em;
                "
              />
              <div class="text-money">
                Tổng tiền nhập
                <span style="font-weight: bold; float: right; color: yellow">
                  <span v-if="dataInput.moneyInput + dataInput.moneyWallet == 0"
                    >0</span
                  >
                  <span v-else>{{
                    (dataInput.moneyInput + dataInput.moneyWallet)
                      | formatCurrency
                  }}</span>
                </span>
              </div>

              <div class="text-money">
                Tiền các khoản đã chọn
                <span style="font-weight: bold; float: right; color: white">
                  <span v-if="moneyPayment == 0">0</span>
                  <span v-else>{{ moneyPayment | formatCurrency }}</span>
                </span>
              </div>
              <div class="text-money">
                <span
                  v-if="
                    dataInput.moneyInput +
                      dataInput.moneyWallet -
                      moneyPayment >
                    0
                  "
                >
                  <span>Tiền thừa</span>
                  <!-- <span v-if="dataSearch.category == 'out'"> Tiền thừa </span> -->
                  <!-- <span v-else>Tiền thừa (PHHS nhận lại)</span> -->
                </span>
                <span v-else> Số tiền còn thiếu</span>
                <span style="font-weight: bold; float: right; color: yellow">
                  <span
                    v-if="
                      dataInput.moneyInput +
                        dataInput.moneyWallet -
                        moneyPayment ==
                      0
                    "
                    >0</span
                  >
                  <span v-else>{{
                    Math.abs(
                      dataInput.moneyInput +
                        dataInput.moneyWallet -
                        moneyPayment
                    ) | formatCurrency
                  }}</span>
                </span>
              </div>
              <div style="margin-bottom: 17px">
                <span style="font-size: 14px; color: red">
                  <span
                    v-if="
                      dataSearch.category == 'both' &&
                      dataInput.transferMoneyType == 'MONEY_MONTH'
                    "
                    >* Lưu ý: Số tiền thừa, thiếu sẽ được chuyển sang tháng tiếp
                    theo</span
                  >
                  <span v-else
                    >* Lưu ý: Số tiền thừa của PHHS sẽ được chuyển vào ví</span
                  >
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="17" style="float: right">
            <el-form
              label-width="155px"
              :model="dataInput"
              label-position="left"
              :rules="rules"
              ref="dataInput"
            >
              <el-form-item
                label="Nhập số tiền"
                prop="moneyInput"
                style="display: inline-block; width: 45%"
              >
                <el-tooltip
                  :content="
                    dataSearch.category == 'out'
                      ? 'Nhập số tiền mặt nhà trường trả lại PHHS'
                      : 'Nhập số tiền mặt phụ huynh cần thanh toán'
                  "
                  placement="top"
                >
                  <el-currency-input
                    v-model="dataInput.moneyInput"
                  ></el-currency-input>
                </el-tooltip>
              </el-form-item>

              <el-form-item
                v-if="
                  dataSearch.category == 'in' || dataSearch.category == 'both'
                "
                label="Rút tiền trong ví"
                prop="moneyWallet"
                style="display: inline-block; width: 45%; float: right"
              >
                <el-tooltip
                  content="Nhập số tiền bạn muốn lấy ra từ Ví của PHHS"
                  placement="top"
                >
                  <el-currency-input
                    v-model="dataInput.moneyWallet"
                  ></el-currency-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item
                v-else
                label="Chuyển tiền vào ví"
                prop="walletStatus"
                style="display: inline-block; width: 45%; float: right"
              >
                <el-checkbox
                  v-model="dataInput.walletStatus"
                  style="line-height: 39px"
                ></el-checkbox>
              </el-form-item>
              <span
                v-if="
                  dataSearch.category == 'both' || dataSearch.category == 'in'
                "
              >
                <el-form-item label="Hình thức thanh toán" prop="paymentType">
                  <el-radio-group v-model="dataInput.paymentType">
                    <el-radio style="color: black" label="CASH"
                      >Tiền mặt</el-radio
                    >
                    <el-radio style="color: black" label="TRANSFER"
                      >Chuyển khoản</el-radio
                    >
                    <el-radio style="color: black" label="BOTH"
                      >TM &amp; CK</el-radio
                    >
                  </el-radio-group>
                  <span
                    :style="
                      dataInput.paymentType != 'BOTH'
                        ? 'margin-left: 20px; visibility: hidden'
                        : 'margin-left: 20px;'
                    "
                  >
                    TM &nbsp;
                    <el-currency-input
                      style="width: 125px"
                      placeholder="Tiền mặt"
                      v-model="dataInput.moneyCash"
                    ></el-currency-input>
                    CK
                    <el-currency-input
                      style="width: 125px; float: right"
                      v-model="dataInput.moneyTransfer"
                    ></el-currency-input>
                  </span>
                </el-form-item>
              </span>
              <el-form-item
                label="Người thanh toán"
                prop="name"
                style="display: inline-block; width: 45%"
              >
                <el-input
                  v-model="dataInput.name"
                  :placeholder="
                    dataSearch.category == 'out'
                      ? 'Nhà trường'
                      : 'Phụ huynh học sinh'
                  "
                ></el-input>
              </el-form-item>
              <el-form-item
                label="Ngày thanh toán"
                prop="date"
                style="display: inline-block; width: 45%; float: right"
              >
                <el-date-picker
                  v-model="dataInput.date"
                  type="date"
                  :clearable="false"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  format="dd-MM-yyyy"
                  placeholder="Chọn ngày"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item v-if="dataSearch.category=='both'" label="Tiền thừa thiếu" prop="transferMoneyType">
                <el-radio-group
                  v-model="dataInput.transferMoneyType"
                  style="margin-top: 12px"
                >
                  <el-radio style="color: black" label="MONEY_WALLET"
                    >Ví phụ huynh</el-radio
                  >
                  <el-radio style="color: black" label="MONEY_MONTH"
                    >Sang tháng sau</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Mô tả" prop="description">
                <el-input
                  v-model="dataInput.description"
                  placeholder="Nhập mô tả"
                ></el-input>
              </el-form-item>
              <br />
              <br />
              <el-form-item
                v-if="dataSearch.category == 'both' && moneyPayment < 0"
              >
                <span style="font-size: 13px; color: white">
                  * Lưu ý: Tổng tiền các khoản đã chọn không được âm</span
                >
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>Thanh toán</span>
        </el-button>
        <!-- v-if="this.dataSearch.category == 'both'" -->
        <el-button
          v-if="dataSearch.category == 'both'"
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="orderPrintMethodNew()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn </span>
        </el-button>
        <el-button
          v-if="dataSearch.category == 'out'"
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="orderPrintOutMethodNew()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn </span>
        </el-button>
        <el-button
          v-if="dataSearch.category == 'in'"
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="orderPrintInMethodNew()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn </span>
        </el-button>
        <!-- <el-button
          v-else
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="printOrderKidsMethod()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn </span>
        </el-button> -->
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>
    <OrderPrintDialog
      :dialogVisible="showOrderPrintDialog"
      @dialog-close="closeOrderPrintDialog()"
      ref="OrderPrintDialog"
    />
    <OrderPrintOutDialog
      :dialogVisible="showOrderPrintOutDialog"
      @dialog-close="closeOrderPrintOutDialog()"
      ref="OrderPrintOutDialog"
    />
    <OrderPrintInDialog
      :dialogVisible="showOrderPrintInDialog"
      @dialog-close="closeOrderPrintInDialog()"
      ref="OrderPrintInDialog"
    />
  </div>
</template>

<script>
import ElCurrencyInput from "@/components/ElCurrencyInput.vue";
import FnFeesService from "@/services/FnFeesService";
import OrderPrintDialog from "./OrderPrintDialog.vue";
import OrderPrintOutDialog from "./OrderPrintOutDialog.vue";
import OrderPrintInDialog from "./OrderPrintInDialog.vue";
// import http from "../../http-download";
import moment from "moment";
export default {
  components: {
    ElCurrencyInput,
    OrderPrintDialog,
    OrderPrintOutDialog,
    OrderPrintInDialog,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      idOrder: "",
      orderCode: "",
      idKid: "",
      titleInfoAdd: "",
      date: "",
      moneyPayment: 0,
      moneyCheckTotal: 0,
      checkRowMoneyAll: false,
      checkRowSchooseAll: false,
      showOrderPrintDialog: false,
      showOrderPrintOutDialog: false,
      showOrderPrintInDialog: false,
      checkNotOrder: false,
      multipleSelection: "",
      checkWallet: false,
      dataInput: {
        moneyInput: Number,
        moneyWallet: Number,
        moneyCash: Number,
        moneyTransfer: Number,
        paymentType: null,
        name: "Phụ huynh học sinh",
        date: moment(String(new Date())).format("YYYY-MM-DD"),
        description: "",
        walletStatus: false,
        transferMoneyType: "",
      },
      responseData: {},
      loadingButton: false,
      loadingPdfButton: false,
      dataSearch: {
        category: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Người thanh toán không được để trống",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "Ngày không được để trống",
            trigger: "change",
          },
        ],
        paymentType: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
        transferMoneyType: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    changeMoneyWallet() {
      if (
        this.dataInput.moneyWallet > 0 &&
        this.dataInput.moneyWallet > this.responseData.moneyWallet
      ) {
        this.$alert("Số tiền nhập nhiều hơn số dư trong ví", "Thông báo!", {
          confirmButtonText: "OK",
          callback: () => {
            this.dataInput.moneyWallet = 0;
          },
        });
      }
      this.resetCheckAllMethod();
    },
    changeMoneyInput() {
      this.resetCheckAllMethod();
    },
  },
  computed: {
    changeMoneyWallet() {
      return this.dataInput.moneyWallet;
    },
    changeMoneyInput() {
      return this.dataInput.moneyInput;
    },
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.paid == 0) {
        return "color: #F56C6C";
      } else if (row.paid < row.money) {
        return "color: #E6A23C";
      }
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.checkNotOrder = false;
        this.responseData.dataList = [];
        this.moneyPayment = 0;
        this.moneyCheckTotal = 0;
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    closeOrderPrintDialog() {
      this.showOrderPrintDialog = false;
      setTimeout(() => {
        this.loadingPdfButton = false;
      }, 1500);
      this.reloadMethod();
    },
    closeOrderPrintOutDialog() {
      this.showOrderPrintOutDialog = false;
      setTimeout(() => {
        this.loadingPdfButton = false;
      }, 1500);
      this.reloadMethod();
    },
    closeOrderPrintInDialog() {
      this.showOrderPrintInDialog = false;
      setTimeout(() => {
        this.loadingPdfButton = false;
      }, 1500);
      this.reloadMethod();
    },
    toggleSelection() {
      this.responseData.dataList.forEach((row) => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },
    orderPrintMethodNew() {
      this.checkButtonBefore();
      this.loadingPdfButton = true;
      this.showOrderPrintDialog = true;
      let idList = this.multipleSelection.map((x) => x.id);
      let orderNote = this.checkNotOrder ? this.responseData.description : "";
      this.$refs.OrderPrintDialog.getDataInitialPrint(
        this.idKid,
        this.date,
        this.dataSearch.category,
        idList,
        orderNote
      );
    },
    orderPrintOutMethodNew() {
      this.checkButtonBefore();
      this.loadingPdfButton = true;
      this.showOrderPrintOutDialog = true;
      let idList = this.multipleSelection.map((x) => x.id);
      let orderNote = this.checkNotOrder ? this.responseData.description : "";
      this.$refs.OrderPrintOutDialog.getDataInitialPrint(
        this.idKid,
        this.date,
        this.dataSearch.category,
        idList,
        orderNote
      );
    },
    orderPrintInMethodNew() {
      this.checkButtonBefore();
      this.loadingPdfButton = true;
      this.showOrderPrintInDialog = true;
      let idList = this.multipleSelection.map((x) => x.id);
      let orderNote = this.checkNotOrder ? this.responseData.description : "";
      this.$refs.OrderPrintInDialog.getDataInitialPrint(
        this.idKid,
        this.date,
        this.dataSearch.category,
        idList,
        orderNote
      );
    },

    reloadMethod() {
      // setTimeout(() => {
      // location.reload();
      // }, 6000);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // printOrderKidsMethod() {
    //   this.checkButtonBefore();
    //   let idList = this.multipleSelection.map((x) => x.id);
    //   this.$confirm(
    //     "Bạn có chắc chắn muốn xuất file pdf không?",
    //     "Thông báo!",
    //     {
    //       distinguishCancelAndClose: true,
    //       closeOnClickModal: false,
    //       confirmButtonText: "Có",
    //       cancelButtonText: "Không",
    //     }
    //   ).then(() => {
    //     let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
    //     return http
    //       .get(`/pdf/kids/order/${this.idOrder}?idList=${idList}`)
    //       .then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         if (this.dataSearch.category == "out") {
    //           link.setAttribute(
    //             "download",
    //             "PHIEU_CHI_PHHS_" + myDate + ".pdf"
    //           );
    //         } else {
    //           link.setAttribute("download", "PHIEU_THU_PHI_" + myDate + ".pdf");
    //         }

    //         document.body.appendChild(link);
    //         link.click();
    //       });
    //   });
    // },
    checkRowMoneyAllMethod() {
      this.responseData.dataList.forEach((x) => {
        if (x.locked || Math.abs(x.paid) >= Math.abs(x.money)) {
          console.log("");
        } else {
          x.checkMoney = this.checkRowMoneyAll;
        }
      });
      this.getCalculateChecked();
    },
    checkedRowMoneyMethod() {
      this.checkRowMoneyAll = false;
      this.getCalculateChecked();
    },
    getCalculateChecked() {
      let moneyCalucalteToal = this.loda.sumBy(
        this.responseData.dataList.filter((x) => x.checkMoney),
        (x) => {
          return x.money - x.paid;
        }
      );
      this.moneyCheckTotal = moneyCalucalteToal;
      if (moneyCalucalteToal > 0) {
        this.dataInput.moneyInput = moneyCalucalteToal;
      } else {
        this.dataInput.moneyInput = 0;
      }
    },

    checkRowSchooseAllMethod() {
      this.responseData.dataList.forEach((x) => {
        if (x.locked || Math.abs(x.paid) >= Math.abs(x.money)) {
          console.log("");
        } else {
          x.checked = this.checkRowSchooseAll;
        }
      });
      let moneyPaymentTotal = this.loda.sumBy(
        this.responseData.dataList.filter((x) => x.checked),
        (x) => {
          return x.money - x.paid;
        }
      );
      let moneyInputTotal =
        this.dataInput.moneyInput + this.dataInput.moneyWallet;
      if (
        this.dataSearch.category == "both" &&
        this.dataInput.transferMoneyType == "MONEY_MONTH"
      ) {
        console.log("no check");
      } else {
        if (moneyInputTotal == 0 || moneyInputTotal < moneyPaymentTotal) {
          let textShow =
            moneyInputTotal == 0
              ? "Bạn cần nhập số tiền để thanh toán"
              : "Tổng tiền các khoản đã chọn nhiều hơn số tiền nhập";
          this.$alert(textShow, "Thông báo!", {
            confirmButtonText: "Đã hiểu",
            callback: () => {
              this.resetCheckAllMethod();
            },
          });
        } else {
          this.moneyPayment = moneyPaymentTotal;
        }
      }
    },

    resetCheckAllMethod() {
      this.responseData.dataList.forEach((x) => {
        x.checked = false;
      });
      this.checkRowSchooseAll = false;
      // this.checkRowMoneyAll = false;
      this.moneyPayment = 0;
    },
    checkBeforeCheckedMethod(row) {
      let moneyTotalInput =
        this.dataInput.moneyInput + this.dataInput.moneyWallet;
      let text = "";
      if (
        this.dataSearch.category == "both" &&
        this.dataInput.transferMoneyType == "MONEY_MONTH"
      ) {
        console.log("no check");
      } else {
        if (row.checked) {
          if (moneyTotalInput == 0) {
            text = "Bạn cần nhập số tiền để thanh toán";
          } else {
            if (
              this.dataSearch.category != "both" ||
              (this.dataSearch.category == "both" &&
                this.dataInput.transferMoneyType == "MONEY_WALLET")
            ) {
              if (row.money > 0 && this.moneyPayment >= moneyTotalInput) {
                text = "Số tiền không đủ để chọn thêm khoản";
              }
            }
          }
        }
      }
      if (text != "") {
        this.$alert(text, "Thông báo!", {
          confirmButtonText: "Đã hiểu",
          callback: () => {
            row.checked = false;
          },
        });
        throw null;
      }
    },
    /**
     * chọn 1 khoản thanh toán
     */
    checkedRowMethod(row) {
      this.checkRowSchooseAll = false;
      this.checkBeforeCheckedMethod(row);
      let moneyTotalSelect = this.loda.sumBy(
        this.responseData.dataList.filter((x) => x.checked),
        (x) => {
          return x.money - x.paid;
        }
      );
      this.moneyPayment = moneyTotalSelect;
      if (row.checked && row.money >= 0) {
        if (
          this.dataSearch.category != "both" ||
          (this.dataSearch.category == "both" &&
            this.dataInput.transferMoneyType == "MONEY_WALLET")
        ) {
          if (
            moneyTotalSelect >
            this.dataInput.moneyInput + this.dataInput.moneyWallet
          ) {
            this.$confirm(
              "Tổng tiền các khoản đã chọn nhiều hơn tổng tiền nhập, Sẽ có khoản bị thanh toán thiếu. Bạn có muốn chọn khoản này?",
              "Thông báo!",
              {
                distinguishCancelAndClose: true,
                confirmButtonText: "Có",
                closeOnClickModal: false,
                cancelButtonText: "Không",
              }
            )
              .then(() => {})
              .catch(() => {
                row.checked = false;
                this.moneyPayment = moneyTotalSelect - (row.money - row.paid);
              });
          }
        }
      }
    },
    checkLengthSelelct(valList) {
      if (valList.length == 0) {
        this.$message({
          message: "Không có khoản nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    checkButtonBefore() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "Không có hóa đơn nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    checkMoneyInput() {
      if (this.dataSearch.category == "both") {
        if (this.moneyPayment < 0) {
          this.$message({
            message: "Tổng tiền các khoản đã chọn không được âm",
            type: "error",
          });
          throw null;
        }
      } else if (this.dataSearch.category == "out") {
        if (this.dataInput.moneyInput > this.moneyPayment) {
          this.$message({
            message: "Số tiền nhập lớn hơn tổng tiền các khoản đã chọn",
            type: "error",
          });
          throw null;
        }
      }
      if (this.dataInput.paymentType == "BOTH") {
        let moneyInputFirst =
          this.dataInput.moneyInput + this.dataInput.moneyWallet;
        let moneyTotalSecond =
          this.dataInput.moneyCash + this.dataInput.moneyTransfer;
        if (moneyTotalSecond != moneyInputFirst) {
          this.$message({
            message: "Số tiền nhập ở TM & CK khác số tiền thanh toán",
            type: "error",
          });
          throw null;
        }
      }
    },
    submitForm() {
      let dataCheckList = this.responseData.dataList.filter((x) => x.checked);
      this.checkLengthSelelct(dataCheckList);
      this.checkMoneyInput();
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let moneyInputLocal = this.$funcCommon.formatMoney(
            this.dataInput.moneyInput + this.dataInput.moneyWallet
          );
          this.$confirm(
            "Bạn có chắc chắn muốn thanh toán cho " +
              dataCheckList.length +
              " khoản đã chọn?",
            "Tổng tiền thanh toán là " + moneyInputLocal + " VNĐ",
            {
              distinguishCancelAndClose: true,
              confirmButtonText: "Có",
              closeOnClickModal: false,
              cancelButtonText: "Không",
            }
          )
            .then(() => {
              let dataSubmit = this.dataInput;
              dataSubmit.idKid = this.idKid;
              dataSubmit.category = this.dataSearch.category;
              dataSubmit.dateTime = this.responseData.dateTime;
              dataSubmit.idKidsPackageList = dataCheckList.map((x) => x.id);
              FnFeesService.orderKidsPayment(this.idOrder, dataSubmit)
                .then((resp) => {
                  this.$message({
                    message: resp.data.message,
                    type: "success",
                  });
                  setTimeout(() => {
                    this.$refs["dataInput"].resetFields();
                    this.moneyCheckTotal = 0;
                    this.dataInput.moneyCash = Number;
                    this.dataInput.moneyTransfer = Number;
                    this.searchByProperties();
                  }, 500);
                })
                .catch((err) => {
                  if (
                    err.response.data.message ==
                    "Thông tin hóa đơn dã bị thay đổi"
                  ) {
                    this.$alert(
                      "Thông tin hóa đơn dã bị thay đổi, chọn OK để lấy lại dữ liệu mới.",
                      "Thông báo!",
                      {
                        confirmButtonText: "OK",
                        callback: () => {
                          this.resetCheckAllMethod();
                          this.searchByProperties();
                        },
                      }
                    );
                  } else {
                    this.$message({
                      message: err.response.data.message,
                      type: "error",
                    });
                  }
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
              }, 300);
            });
        } else {
          console.log("error validate data!");
        }
      });
    },
    async changeCategoryMethod() {
      if (this.dataSearch.category == "out") {
        this.dataInput.moneyWallet = 0;
      } else {
        this.dataInput.moneyWallet = Number;
      }
      this.dataInput.moneyInput = Number;
      this.moneyPayment = 0;
      this.moneyCheckTotal = 0;
      this.checkRowMoneyAll = false;
      this.checkRowSchooseAll = false;
      this.dataInput.paymentType = null;
      this.dataInput.moneyCash = Number;
      this.dataInput.moneyTransfer = Number;
      await this.searchByProperties();
      this.toggleSelection();
      if (this.dataSearch.category == "out") {
        this.dataInput.name = "Nhà trường";
      } else {
        this.dataInput.name = "Phụ huynh học sinh";
      }
    },
    async searchByProperties() {
      this.textTable = this.$tableLoadding;
      await FnFeesService.searchOrderKidsCasher(
        this.idOrder,
        this.idKid,
        this.dataSearch.category
      )
        .then((resp) => {
          this.responseData = resp.data.data;
          this.dataInput.transferMoneyType = resp.data.data.transferMoneyType;
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
          this.responseData.dataList = [];
        })
        .finally(() => {
          if (this.responseData.dataList == 0) {
            this.textTable = this.$tableEmpty;
          }
        });
    },
    async getDataCasherInitial(
      idKid,
      idOrder,
      orderCode,
      month,
      year,
      kidName
    ) {
      this.idKid = idKid;
      this.titleInfoAdd = kidName + " " + month + "/" + year;
      this.idOrder = idOrder;
      this.orderCode = orderCode;
      this.date = this.$funcCommon
        .getDateFromMonthYear(year, month)
        .format("YYYY-MM-DD");
      this.dataSearch.category = "both";
      await this.searchByProperties();
      this.toggleSelection();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  word-break: break-word;
}
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
/deep/.el-form-item__label {
  color: black;
}
.el-row {
  margin-top: 15px;
  padding-top: 20px;
  background: #97bee7;
  color: black;
  border-radius: 5px;
}
.input-common {
  margin-right: 5px;
}
.text-money {
  margin-bottom: 15px;
}
/deep/.el-form-item__content {
  line-height: 0;
}
</style>
