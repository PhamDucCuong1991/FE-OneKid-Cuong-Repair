<template>
  <div>
    <el-dialog
      :title="'Thông tin hóa đơn lương các tháng: ' + nameEmployeeMonth"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <div>
        <div style="margin: 15px 0">
          <el-date-picker
            v-model="date"
            type="year"
            :clearable="false"
            style="width: 115px"
            placeholder="Chọn tháng"
            @change="searchBillYear(date)"
          >
          </el-date-picker>
        </div>
        <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
          <el-table
            ref="multipleTable"
            :empty-text="textTable"
            highlight-current-row
            :data="responseList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              width="60"
              fixed
              prop="month"
              align="center"
              label="Tháng"
            ></el-table-column>
            <el-table-column
              fixed
              prop="code"
              label="Mã hóa đơn"
              width="125"
              align="center"
              ><template slot-scope="scope">
                <span>{{ scope.row.code }}</span>
              </template></el-table-column
            >
            <el-table-column label="Hiển thị" width="80" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.view"
                  @change="handleShowOne(scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Khóa" width="80" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  :disabled="!checkPermission(['salary_order_locked'])"
                  v-model="scope.row.locked"
                  @change="handleLockedOne(scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Trạng thái" min-width="100" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.totalNumber == 0">Chưa có khoản</span>
                <span v-else-if="scope.row.totalNumber != scope.row.enoughNumber"
                  >Chưa hoàn thành</span
                >
                <span v-else>Đã hoàn thành</span>
              </template>
            </el-table-column>
            <el-table-column label="Đủ-Thiếu-Chưa đóng" width="150" align="center">
              <template slot-scope="scope">
                <span style="color: #606266"
                  >{{ scope.row.enoughNumber }}&nbsp;-&nbsp;</span
                >
                <span style="color: orange">{{ scope.row.partNumber }}&nbsp;-&nbsp;</span>
                <span style="color: red">{{ scope.row.emptyNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Tổng thu" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.moneyTotalIn | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Đã thu" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.moneyTotalPaidIn | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Thu thiếu" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.moneyTotalRemainIn | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Tổng chi" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.moneyTotalOut | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Đã chi" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.moneyTotalPaidOut | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Chi thiếu" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.moneyTotalRemainOut | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Tác vụ"
              :width="checkPermission(['salary_order_payment']) ? 200 : 100"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="checkPermission(['salary_order_payment'])"
                  size="mini"
                  type="success"
                  @click="paidBillSalary(scope.row)"
                  :disabled="scope.row.locked || scope.row.totalNumber == 0"
                  >Thanh toán</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="orderSalaryDetailMethod(scope.row)"
                  :disabled="scope.row.locked || scope.row.totalNumber == 0"
                  >Chi tiết</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button type="danger" size="medium" @click="closeDialog()">
              <i class="el-icon-circle-close" />
              <span>{{ $t("button.close") }}</span>
            </el-button>
          </div>
        </el-tabs>
      </div>
    </el-dialog>
    <SalaryBill
      v-bind:nameEmployee="nameEmployee"
      :dialogVisible="showSalaryBillDialog"
      @dialog-close="dialogCloseSalaryBill()"
      ref="SalaryBill"
    />
    <order-salary-detail-dialog
      :dialogVisible="showOrderSalaryDetailDialog"
      @dialog-close="closesOrderSalaryDetailDialog()"
      ref="OrderSalaryDetailDialog"
    />
  </div>
</template>
<script>
import checkPermission from "@/utils/permission.js";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
import SalaryBill from "./SalaryBill.vue";
import moment from "moment";
import OrderSalaryDetailDialog from "./OrderSalaryDetailDialog.vue";

export default {
  components: {
    SalaryBill,
    OrderSalaryDetailDialog,
  },
  props: {
    dialogVisible: null,
    nameEmployeeMonth: null,
  },

  data() {
    return {
      idInfo: "",
      date: "",
      nameEmployee: "",
      loadingButton: false,
      showSalaryBillDialog: false,
      showOrderSalaryDetailDialog: false,
      responseList: [],
      textTable: this.$tableLoadding,
      billData: {
        date: "",
        idList: [],
        status: true,
      },
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row == null) {
        return "color: #409EFF";
      } else if (row.totalNumber == 0) {
        return "color: #FB9A00";
      } else if (row.totalNumber != row.enoughNumber) {
        return "color: #FD4803";
      }
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    orderSalaryDetailMethod(row) {
      this.showOrderSalaryDetailDialog = true;
      this.$refs.OrderSalaryDetailDialog.getOrderSalaryDetailInitial(row.id);
    },
    closesOrderSalaryDetailDialog() {
      this.showOrderSalaryDetailDialog = false;
      this.searchByProperties();
    },
    paidBillSalary(row) {
      this.showSalaryBillDialog = true;
      let dateLocal = this.$funcCommon.getDateFromMonthYear(row.year, row.month);
      this.nameEmployee = this.nameEmployee + " - " + dateLocal.format("MM/YYYY");
      this.$refs.SalaryBill.getDataInitial(this.idInfo, row.code, row.id, dateLocal);
    },
    dialogCloseSalaryBill() {
      this.showSalaryBillDialog = false;
      this.searchEmloyeeSalaryMonthMethod();
    },
    searchBillYear(data) {
      this.date = moment(data).format("YYYY-MM-DD");
      let id = this.idInfo;
      this.searchEmloyeeSalaryMonthMethod(id, this.date);
    },
    handleLockedOne(row) {
      let dataInput = {
        idList: [row.id],
        status: row.locked,
      };
      EmployeeSalaryService.lockedBill(dataInput)
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
            this.searchEmloyeeSalaryMonthMethod();
            this.billData.idList = [];
            this.loadingButtonAction = false;
          }, 500);
        });
    },
    handleShowOne(row) {
      let dataInput = {
        idList: [row.id],
        status: row.view,
      };
      EmployeeSalaryService.showBill(dataInput)
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
            this.searchEmloyeeSalaryMonthMethod();
            this.billData.idList = [];
            this.loadingButtonAction = false;
          }, 500);
        });
    },
    searchEmloyeeSalaryMonthMethod() {
      this.textTable = this.$tableLoadding;
      EmployeeSalaryService.searchEmloyeeSalaryMonth(
        this.idInfo,
        moment(this.date).year()
      )
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getDataMonthIntial(idInfoEmployee, date) {
      this.idInfo = idInfoEmployee;
      this.date = date;
      this.searchEmloyeeSalaryMonthMethod();
    },
  },
};
</script>
<style lang="scss" scoped>
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
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
// /deep/.el-tabs__nav-scroll {
//   float: right;
// }
/deep/.el-tabs__header {
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
/deep/.el-table .cell {
  line-height: 15px;
}
/deep/.el-table th > .cell {
  font-size: 13px;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
/deep/.el-table td {
  padding: 8px 0;
}
/deep/.el-table th {
  padding: 12px 0;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
.button-click {
  float: right;
  margin: 20px 0 40px 0;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: #5fb44a;
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 #0000001a;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;

  // display: inline-block;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
// .table-header {
//   position: sticky;
// }
// table{

// }
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
  // display: block;
  // width: 90%;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
}
td {
  padding: 12px;
}
.table-index {
  width: 10px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 200px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
</style>
