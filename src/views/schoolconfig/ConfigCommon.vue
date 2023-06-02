<template>
  <div>
    <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
      <el-tab-pane label="Chu kỳ dự toán" name="cycleMoneyTab">
        <el-form
          label-width="140px"
          :model="cycleMoneyData"
          label-position="left"
          :rules="rules"
          ref="cycleMoneyData"
        >
          <h2>1. Áp dụng cho các khoản thu học phí</h2>
          <el-form-item label="Chọn loại" prop="typeFees">
            <el-radio-group v-model="cycleMoneyData.typeFees">
              <el-radio label="default"
                >Theo mặc định hệ thống (Tính từ ngày đầu tháng)</el-radio
              >
              <el-radio label="custom"
                >Theo thiết lập nhà trường (Tính theo ngày cấu hình)</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <span v-if="cycleMoneyData.typeFees == 'custom'">
            <el-form-item label="Chọn khoảng" prop="rangeFees">
              <el-radio-group v-model="cycleMoneyData.rangeFees">
                <el-radio label="range1"
                  >Khoảng 1 (Xem mô tả bên dưới)</el-radio
                >
                <el-radio label="range2" style="margin-left: 96px"
                  >Khoảng 2 (Xem mô tả bên dưới)</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="Ngày bắt đầu (tháng trước)"
              prop="startDateFees"
              style="display: inline-block"
            >
              <el-input-number
                :min="1"
                :max="28"
                v-model.number="cycleMoneyData.startDateFees"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              label="Ngày kết thúc (tháng kế tiếp)"
              prop="endDateFees"
              style="display: inline-block; margin-left: 153px"
            >
              <el-input-number
                :min="1"
                :max="28"
                v-model.number="cycleMoneyData.endDateFees"
              ></el-input-number>
            </el-form-item>
          </span>
          <h2>2. Áp dụng cho các khoản công lương</h2>
          <el-form-item label="Chọn loại" prop="typeSalary">
            <el-radio-group v-model="cycleMoneyData.typeSalary">
              <el-radio label="default"
                >Theo mặc định hệ thống (Tính từ ngày đầu tháng)</el-radio
              >
              <el-radio label="custom"
                >Theo thiết lập nhà trường (Tính theo ngày cấu hình)</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <span v-if="cycleMoneyData.typeSalary == 'custom'">
            <el-form-item label="Chọn khoảng" prop="rangeSalary">
              <el-radio-group v-model="cycleMoneyData.rangeSalary">
                <el-radio label="range1"
                  >Khoảng 1 (Xem mô tả bên dưới)</el-radio
                >
                <el-radio label="range2" style="margin-left: 96px"
                  >Khoảng 2 (Xem mô tả bên dưới)</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="Ngày bắt đầu (tháng trước)"
              prop="startDateSalary"
              style="display: inline-block"
            >
              <el-input-number
                :min="1"
                :max="28"
                v-model.number="cycleMoneyData.startDateSalary"
              ></el-input-number>
            </el-form-item>
            <el-form-item
              label="Ngày kết thúc (tháng kế tiếp)"
              prop="endDateSalary"
              style="display: inline-block; margin-left: 153px"
            >
              <el-input-number
                :min="1"
                :max="28"
                v-model.number="cycleMoneyData.endDateSalary"
              ></el-input-number>
            </el-form-item>
          </span>
          <h2>3. Kết chuyển số dư thanh toán hóa đơn học phí</h2>
          <el-form-item label="Chọn loại" prop="transferMoneyType">
            <el-radio-group v-model="cycleMoneyData.transferMoneyType">
              <el-radio label="MONEY_WALLET"
                >Sử dụng ví</el-radio
              >
              <el-radio label="MONEY_MONTH"
                >Chuyển sang tháng kế tiếp</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButtonCycleMoney"
          mini
          @click="updateCycleMoneyMethod()"
          style="margin-left: 350px"
        >
          <i class="el-icon-circle-check" />
          <span>{{ $t("button.save") }}</span>
        </el-button>
        <br />
        <br />
        <div style="color: red">
          Mô tả khoảng: Ví dụ thực hiện khoản tháng 8 và ngày bắt đầu, kết thúc
          lần lượt là 10 và 10: Khi đó số dự toán được tính theo
          <div>Chọn khoảng 1: Từ ngày 10/7 đến hết ngày 9/8</div>
          <div>Chọn khoảng 2: Từ ngày 10/8 đến hết ngày 9/9</div>
          <div>
            Các khoản trả lại tự động lùi đi 1 chù kỳ so với khoảng ngày đã chọn
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Cấu hình quỹ" name="tabName1">
        <el-table
          ref="multipleTable"
          :empty-text="textTable"
          v-loading="loadingData"
          :element-loading-text="$tableLoadding"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0)"
          highlight-current-row
          :data="responseList1"
          :cell-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column
            type="index"
            fixed
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column min-width="170" fixed align="center" label="Năm">
            <template slot-scope="scope">
              <span>{{ scope.row.year }}</span>
              <div>
                {{ scope.row.startDate | formatDate }} -
                {{ scope.row.endDate | formatDate }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái" align="center" min-width="90">
            <template slot-scope="scope">
              <el-checkbox
                v-if="checkPermission(['schoolConfig_finance_update'])"
                @change="changeLockedMethod(scope.row)"
                v-model="scope.row.locked"
              ></el-checkbox>
              <span v-else>
                <span v-if="scope.row.locked">Đã khóa</span>
                <span>Chưa khóa</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Số dư đầu kỳ" align="right" min-width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.moneyStart == 0">0</span>
              <span v-else>{{ scope.row.moneyStart | formatCurrency }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Tổng tiền thu" align="right" min-width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.moneyIn == 0">0</span>
              <span v-else>{{ scope.row.moneyIn | formatCurrency }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Tổng tiền chi" align="right" min-width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.moneyOut == 0">0</span>
              <span v-else>{{ scope.row.moneyOut | formatCurrency }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Tổng thu - Tổng chi"
            align="right"
            min-width="130"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.moneyIn - scope.row.moneyOut == 0">0</span>
              <span v-else>{{
                (scope.row.moneyIn - scope.row.moneyOut) | formatCurrency
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Số dư cuối kỳ" align="right" min-width="130">
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.moneyStart +
                    (scope.row.moneyIn - scope.row.moneyOut) ==
                  0
                "
                >0</span
              >
              <span v-else>{{
                (scope.row.moneyStart +
                  (scope.row.moneyIn - scope.row.moneyOut))
                  | formatCurrency
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="checkPermission(['schoolConfig_finance_update'])"
            fixed="right"
            label="Tác vụ"
            width="120"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.locked ? true : false"
                type="success"
                size="mini"
                @click="updateRowMethod(scope.row)"
                >Sửa</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane
        label="Thông tin ngân hàng"
        name="tabName2"
        :model="dataInput"
      >
        <div class="bank">
          <p
            style="
              margin-right: 15px;
              margin-top: 50px;
              color: black;
              font-size: 20px;
            "
          >
            Nội dung thanh toán hiển thị trên app phụ huynh(Khi thao tác thanh
            toán):
          </p>
          <el-input
            type="textarea"
            placeholder="Nhập nội dung thanh toán hiển thị trên app phụ huynh"
            v-model="dataInput.bankInfo"
          ></el-input>
        </div>
        <div class="bank">
          <p
            style="
              margin-right: 15px;
              margin-top: 50px;
              color: black;
              font-size: 20px;
            "
          >
            Đính kèm thông báo học phí qua App phụ huynh(Khi thao tác hiển thị):
          </p>
          <el-input
            type="textarea"
            placeholder="Nhập nội dung đính kèm thông báo học phí qua App phụ huynh"
            v-model="dataInput.feesParent"
          ></el-input>
        </div>
        <div class="bank">
          <p
            style="
              margin-right: 15px;
              margin-top: 50px;
              color: black;
              font-size: 20px;
            "
          >
            Ghi chú trên phiếu thu học phí:
          </p>
          <el-input
            type="textarea"
            placeholder="Nhập thời gian thanh toán"
            v-model="dataInput.expired"
          ></el-input>
        </div>
        <div class="bank">
          <p
            style="
              margin-right: 15px;
              margin-top: 50px;
              color: black;
              font-size: 20px;
            "
          >
            Ghi chú trên phiếu công lương:
          </p>
          <el-input
            type="textarea"
            placeholder="Nhập ghi chú"
            v-model="dataInput.note"
          ></el-input>
        </div>
        <div>
          <el-button
            v-if="checkPermission(['schoolConfig_finance_update'])"
            style="margin-top: 10px; float: right; border-radius: 0"
            :loading="loadingButton"
            type="success"
            @click="saveBankInfo()"
            >Lưu</el-button
          >
        </div>
      </el-tab-pane>
    </el-tabs>
    <UpdateCashBookDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="closeUpdateDialog()"
      ref="UpdateCashBookDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";
import FnFeesService from "@/services/FnFeesService";
import UpdateCashBookDialog from "./UpdateCashBookDialog.vue";
export default {
  components: {
    UpdateCashBookDialog,
  },
  data() {
    return {
      dataInput: {},
      textTable: "",
      loadingData: true,
      activeTabName: "tabName1",
      cycleMoneyData: {},
      responseDataTab1: {},
      responseList1: [],
      showDetailDialog: false,
      showUpdateDialog: false,
      loadingButton: false,
      loadingButtonCycleMoney: false,
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.locked) {
        return "color: #409EFF";
      }
    },
    closeUpdateDialog() {
      this.showUpdateDialog = false;
      this.getDataTab1Method();
    },
    updateRowMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateCashBookDialog.getDataInitial(row);
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "tabName1") {
        this.getDataTab1Method();
      } else if (tabNameClick == "tabName2") {
        this.getDataTab2Method();
      } else if (tabNameClick == "cycleMoneyTab") {
        this.getCycleMoneyMethod();
      }
    },
    changeLockedMethod(row) {
      SchoolConfigService.updateLockedCashBook(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.getDataTab1Method();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getDataTab1Method() {
      this.loadingData = true;
      SchoolConfigService.findCashBookYear()
        .then((resp) => {
          this.responseList1 = resp.data.data;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
        })
        .finally(() => {
          if (this.responseList1.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    saveBankInfo() {
      this.loadingButton = true;
      SchoolConfigService.createBankInfo(this.dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.getDataTab2Method();
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
    },
    getDataTab2Method() {
      SchoolConfigService.findBankInfo()
        .then((resp) => {
          this.dataInput = resp.data.data;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
        });
    },
    updateCycleMoneyMethod() {
      this.loadingButtonCycleMoney = true;
      FnFeesService.updateCycleMoneyService(this.cycleMoneyData)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonCycleMoney = false;
          }, 500);
        });
    },
    getCycleMoneyMethod() {
      FnFeesService.getCycleMoneyService()
        .then((resp) => {
          this.cycleMoneyData = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
  beforeMount() {
    this.getDataTab1Method();
  },
};
</script>

<style lang="scss" scoped>
.bank {
  margin-top: 20px !important;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
}
</style>
