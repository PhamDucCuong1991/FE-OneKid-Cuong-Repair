<template>
  <div>
    <el-dialog
      :title="
        'Thanh toán hóa đơn công lương: ' + orderCode + ' ' + nameEmployee
      "
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
          <el-radio label="out">Chi</el-radio>
          <el-radio label="in">Thu</el-radio>
        </el-radio-group>
      </div>
      <span style="margin-left: 745px"
        >Số tiền tính toán:
        <span style="font-weight: bold">{{
          moneyCheckTotal | formatCurrencyNew
        }}</span>
      </span>
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseData.dataList"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="360"
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
        <el-table-column label="Tên khoản" prop="name" min-width="180">
        </el-table-column>
        <el-table-column label="Loại" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.category == 'in'">Thu</span>
            <span v-if="scope.row.category == 'out'">Chi</span>
          </template>
        </el-table-column>
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
        <el-table-column fixed="right" align="center" width="85">
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
        <el-table-column
          label="Chọn khoản TT"
          fixed="right"
          align="center"
          width="120"
        >
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
      <div v-if="this.dataSearch.category == 'both'">
        <el-checkbox v-model="checkNotOrder"></el-checkbox> &nbsp; Ghi chú:
        {{ responseData.description }}
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="6" style="margin-right: 15px"
            ><div class="">
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
                  border-bottom: 0px solid red;
                  margin-top: -0.5em;
                  margin-bottom: 0.7em;
                "
              />
              <p></p>
              <div class="text-money">
                Tổng tiền nhập
                <span style="font-weight: bold; float: right; color: yellow">
                  <span v-if="dataInput.moneyInput + 0 == 0">0</span>
                  <span v-else>{{
                    dataInput.moneyInput | formatCurrency
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
                <span v-if="dataInput.moneyInput - moneyPayment > 0">
                  Số tiền còn thừa</span
                >
                <span v-else> Số tiền còn thiếu</span>
                <span style="font-weight: bold; float: right; color: yellow">
                  <span v-if="dataInput.moneyInput - moneyPayment == 0">0</span>
                  <span v-else>{{
                    Math.abs(dataInput.moneyInput - moneyPayment)
                      | formatCurrency
                  }}</span>
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="17" style="float: right">
            <el-form
              label-width="145px"
              :model="dataInput"
              label-position="left"
              :rules="rules"
              ref="dataInput"
            >
              <el-form-item
                label="Nhập Số tiền"
                prop="moneyInput"
                style="width: 45%"
              >
                <el-currency-input
                  v-model="dataInput.moneyInput"
                ></el-currency-input>
              </el-form-item>
              <el-form-item
                label="Người thanh toán"
                prop="name"
                style="display: inline-block; width: 45%"
              >
                <el-input
                  v-model="dataInput.name"
                  placeholder="Nhập người thanh toán"
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
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="Mô tả" prop="description">
                <el-input
                  type="textarea"
                  :row="3"
                  v-model="dataInput.description"
                  placeholder="Nhập mô tả"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="dataSearch.category == 'in'">
                <span style="font-size: 13px; color: #606266">
                  Lưu ý: Bạn không được nhập thừa số tiền cần thanh toán.</span
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
        <el-button
          v-if="this.dataSearch.category == 'both'"
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="salaryPrintMethodNew()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn</span>
        </el-button>
        <el-button
          v-if="this.dataSearch.category == 'in'"
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="salaryPrintInMethodNew()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn</span>
        </el-button>
        <el-button
          v-if="this.dataSearch.category == 'out'"
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="salaryPrintOutMethodNew()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn</span>
        </el-button>
        <!-- <el-button
          v-else
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="printOrderKidsMethod()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn</span>
        </el-button> -->
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>
    <ExportPDFSalaryDiag
      :dialogVisible="showSalaryPrintDialog"
      @dialog-close="closeSalaryPrintDialog()"
      ref="ExportPDFSalaryDiag"
    />
    <ExportPDFSalaryInDiag
      :dialogVisible="showSalaryPrintInDialog"
      @dialog-close="closeSalaryPrintInDialog()"
      ref="ExportPDFSalaryInDiag"
    />
    <ExportPDFSalaryOutDiag
      :dialogVisible="showSalaryPrintOutDialog"
      @dialog-close="closeSalaryPrintOutDialog()"
      ref="ExportPDFSalaryOutDiag"
    />
  </div>
</template>

<script>
import ElCurrencyInput from "@/components/ElCurrencyInput.vue";
import ExportPDFSalaryDiag from "./ExportPDFSalaryDiag";
import ExportPDFSalaryInDiag from "./ExportPDFSalaryInDiag";
import ExportPDFSalaryOutDiag from "./ExportPDFSalaryOutDiag";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
// import http from "../../http-download";
import moment from "moment";
export default {
  components: {
    ElCurrencyInput,
    ExportPDFSalaryDiag,
    ExportPDFSalaryInDiag,
    ExportPDFSalaryOutDiag,
  },
  props: {
    dialogVisible: null,
    nameEmployee: null,
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
      moneyPayment: 0,
      moneyCheckTotal: 0,
      multipleSelection: [],
      dataInput: {
        moneyInput: Number,
        name: "",
        date: "",
        description: "",
      },
      responseData: {},
      loadingButton: false,
      loadingPdfButton: false,
      showSalaryPrintDialog: false,
      showSalaryPrintInDialog: false,
      showSalaryPrintOutDialog: false,
      checkRowMoneyAll: false,
      checkRowSchooseAll: false,
      checkNotOrder: false,
      dataSearch: {
        idInfoEmployee: "",
        name: "",
        date: "",
        category: "",
      },
      rules: {
        moneyInput: [
          {
            required: true,
            message: "Số tiền không được để trống",
            trigger: "blur",
          },
        ],
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
      },
    };
  },
  watch: {
    changeMoneyInput() {
      this.resetCheckedMethod();
    },
  },
  computed: {
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
        this.dataSearch.category = "out";
        this.loadingButton = false;
        this.checkNotOrder = false;
        this.moneyCheckTotal = 0;
        this.$refs["dataInput"].resetFields();
        this.responseData = {};
      }, 300);
    },
    closeSalaryPrintDialog() {
      this.showSalaryPrintDialog = false;
      setTimeout(() => {
        this.loadingPdfButton = false;
      }, 1500);
    },
    closeSalaryPrintInDialog() {
      this.showSalaryPrintInDialog = false;
      setTimeout(() => {
        this.loadingPdfButton = false;
      }, 1500);
    },
    closeSalaryPrintOutDialog() {
      this.showSalaryPrintOutDialog = false;
      setTimeout(() => {
        this.loadingPdfButton = false;
      }, 1500);
    },
    resetCheckedMethod() {
      this.responseData.dataList.forEach((x) => {
        x.checked = false;
      });
      this.checkRowSchooseAll = false;
      this.moneyPayment = 0;
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
    //     this.loadingPdfButton = true;
    //     let myDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss");
    //     return http
    //       .get(`/pdf/salary/order/${this.idOrder}?idList=${idList}`)
    //       .then((response) => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         if (this.dataSearch.category == "out") {
    //           link.setAttribute(
    //             "download",
    //             "PHIEU_CHI_LUONG_" + myDate + ".pdf"
    //           );
    //         } else {
    //           link.setAttribute(
    //             "download",
    //             "PHIEU_THU_TIEN_" + myDate + ".pdf"
    //           );
    //         }
    //         document.body.appendChild(link);
    //         link.click();
    //       })
    //       .finally(() => {
    //         setTimeout(() => {
    //           this.loadingPdfButton = false;
    //         }, 500);
    //       });
    //   });
    // },
    salaryPrintMethodNew() {
      this.checkButtonBefore();
      this.$confirm("Bạn có chắc chắn muốn xuất file pdf không?", "Thông báo", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      })
        .then(() => {
          this.loadingPdfButton = true;
          this.showSalaryPrintDialog = true;
          let idList = this.multipleSelection.map((x) => x.id);
          let orderNote = this.checkNotOrder
            ? this.responseData.description
            : "";
          this.$refs.ExportPDFSalaryDiag.getDataInitialPrint(
            this.dataSearch.idInfoEmployee,
            this.dataSearch.date,
            this.dataSearch.category,
            idList,
            orderNote
          );
        })
        .catch(() => {
          setTimeout(() => {
            this.loadingPdfButton = false;
          }, 1500);
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingPdfButton = false;
          }, 1500);
        });
    },
    salaryPrintInMethodNew() {
      this.checkButtonBefore();
      this.$confirm("Bạn có chắc chắn muốn xuất file pdf không?", "Thông báo", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      })
        .then(() => {
          this.loadingPdfButton = true;
          this.showSalaryPrintInDialog = true;
          let idList = this.multipleSelection.map((x) => x.id);
          let orderNote = this.checkNotOrder
            ? this.responseData.description
            : "";
          this.$refs.ExportPDFSalaryInDiag.getDataInitialPrint(
            this.dataSearch.idInfoEmployee,
            this.dataSearch.date,
            this.dataSearch.category,
            idList,
            orderNote
          );
        })
        .catch(() => {
          setTimeout(() => {
            this.loadingPdfButton = false;
          }, 1500);
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingPdfButton = false;
          }, 1500);
        });
    },
    salaryPrintOutMethodNew() {
      this.checkButtonBefore();
      this.$confirm("Bạn có chắc chắn muốn xuất file pdf không?", "Thông báo", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      })
        .then(() => {
          this.loadingPdfButton = true;
          this.showSalaryPrintOutDialog = true;
          let idList = this.multipleSelection.map((x) => x.id);
          let orderNote = this.checkNotOrder
            ? this.responseData.description
            : "";
          this.$refs.ExportPDFSalaryOutDiag.getDataInitialPrint(
            this.dataSearch.idInfoEmployee,
            this.dataSearch.date,
            this.dataSearch.category,
            idList,
            orderNote
          );
        })
        .catch(() => {
          setTimeout(() => {
            this.loadingPdfButton = false;
          }, 1500);
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingPdfButton = false;
          }, 1500);
        });
    },
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
    changeCategoryMethod() {
      this.dataInput.moneyInput = 0;
      this.moneyPayment = 0;
      this.moneyCheckTotal = 0;
      this.checkRowMoneyAll = false;
      this.checkRowSchooseAll = false;

      this.searchByProperties();
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
    /**
     * chọn tất cả các khoản tính toán
     */
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
      let moneyInputTotal = this.dataInput.moneyInput;
      if (
        moneyInputTotal == null ||
        moneyInputTotal == 0 ||
        moneyInputTotal < moneyPaymentTotal
      ) {
        let textShow =
          moneyInputTotal == 0 || moneyInputTotal == null
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
    },
    resetCheckAllMethod() {
      this.responseData.dataList.forEach((x) => {
        x.checked = false;
      });
      this.checkRowSchooseAll = false;
      this.checkRowMoneyAll = false;
      this.moneyPayment = 0;
    },
    /**
     * Chọn khoản thanh toán
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
        if (moneyTotalSelect > this.dataInput.moneyInput) {
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
    },
    checkBeforeCheckedMethod(row) {
      let moneyTotalInput = this.dataInput.moneyInput;
      let text = "";
      if (row.checked) {
        if (moneyTotalInput == null || moneyTotalInput == 0) {
          text = "Bạn cần nhập số tiền để thanh toán";
        } else {
          if (row.money > 0 && this.moneyPayment >= moneyTotalInput) {
            text = "Số tiền không đủ để chọn thêm khoản";
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
    checkLengthSelelct(valList) {
      if (valList.length == 0) {
        this.$message({
          message: "Không có khoản nào được chọn",
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
      }
      if (this.dataInput.moneyInput > this.moneyPayment) {
        this.$message({
          message: "Số tiền nhập lớn hơn tổng tiền các khoản đã chọn",
          type: "error",
        });
        throw null;
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
            this.dataInput.moneyInput
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
              this.loadingButton = true;
              let dataSubmit = this.dataInput;
              dataSubmit.category = this.dataSearch.category;
              dataSubmit.dateTime = this.responseData.dateTime;
              dataSubmit.idEmployeeSalaryList = dataCheckList.map((x) => x.id);
              EmployeeSalaryService.orderSalaryPayment(this.idOrder, dataSubmit)
                .then((resp) => {
                  this.$message({
                    message: resp.data.message,
                    type: "success",
                  });
                  setTimeout(() => {
                    this.$refs["dataInput"].resetFields();
                    this.moneyCheckTotal = 0;
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
                          this.resetCheckedMethod();
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
    searchByProperties() {
      this.textTable = this.$tableLoadding;
      EmployeeSalaryService.searchBillEmployee(
        this.idOrder,
        this.dataSearch.idInfoEmployee,
        this.dataSearch.category
      )
        .then((resp) => {
          this.responseData = resp.data.data;
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
          this.moneyPayment = 0;
        });
    },
    getDataInitial(idEmployee, orderCode, idOrder, date) {
      this.nameEmployees =
        this.nameEmployee + " - " + moment(date).format("MM/YYYY");
      this.dataSearch.idInfoEmployee = idEmployee;
      this.dataSearch.date = date;
      this.dataSearch.category = "both";
      this.orderCode = orderCode;
      this.idOrder = idOrder;
      this.dataInput.idInfoEmployee = idEmployee;
      this.dataInput.date = this.moment().format("YYYY-MM-DD");
      this.searchByProperties();
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
/deep/.el-form-item__label {
  color: black;
}
.el-row {
  margin-top: 15px;
  padding-top: 20px;
  background: #72adea;
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
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
</style>
