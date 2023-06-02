<template>
  <div class="content">
    <div style="margin-top: 5px">
      <div
        class="button-click-left"
        style="margin-bottom: 20px; position: relative; z-index: 1; display: inline-block"
      >
        <el-date-picker
          class="button-left"
          v-model="dataSearch.date"
          type="month"
          :clearable="false"
          value-format="yyyy-MM-dd"
          format="MM-yyyy"
          placeholder="Chọn tháng"
          @change="searchByProperties()"
        >
        </el-date-picker>
        <!-- trạng thái làm -->
        <el-select
          class="button-left"
          v-model="dataSearch.statusEmployeee"
          @change="searchByProperties()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in statusEmployeeList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>

        <el-select
          class="button-left"
          v-model="dataSearch.idDepartment"
          @change="searchByProperties()"
          placeholder="Phòng ban"
          clearable
        >
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          style="width: 280px"
          placeholder="Nhập tên hoặc số điện thoại"
          v-model="dataSearch.employeeNameOrPhone"
          @keyup.enter.native="searchByProperties()"
          clearable
          @clear="searchByProperties()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchByProperties()"
          ></el-button>
        </el-input>
      </div>
      <div style="float: right">
        <el-button
          v-if="checkPermission(['salary_order_statistical'])"
          style="border-radius: 0"
          type="success"
          @click="statisticalMethod()"
          icon="el-icon-s-data"
        >
          Thống kê
        </el-button>
        <!-- <el-button
          style="border-radius: 0"
          type="success"
          @click="kidsDialogMethod()"
          icon="el-icon-search"
        >
          Tìm kiếm
        </el-button> -->
      </div>
    </div>
    <div class="table-content row-data">
      <el-table
        ref="tableDetail"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="employeeSalaryApplyList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column
          fixed
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column fixed prop="fullName" min-width="150" label="Tên nhân viên">
          <template slot-scope="scope">
            <el-span>{{ scope.row.fullName }}</el-span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" width="100" label="Số điện thoại" align="center">
          <template slot-scope="scope">
            <el-span>{{ scope.row.phone }}</el-span>
          </template>
        </el-table-column>
        <el-table-column prop="code" min-width="125" label="Mã hóa đơn" align="center">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <el-span>{{ scope.row.billSampleResponse.code }}</el-span>
          </template>
        </el-table-column>

        <el-table-column label="Hiển thị" width="70" align="center">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <el-checkbox
              v-model="scope.row.billSampleResponse.view"
              @change="handleViewOneMethod(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Khóa" width="70" align="center">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <el-checkbox
              :disabled="!checkPermission(['salary_order_locked'])"
              v-model="scope.row.billSampleResponse.locked"
              @change="handleLockedOneMethod(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" min-width="150" align="center">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span v-if="scope.row.billSampleResponse.totalNumber == 0"
              >Chưa có khoản</span
            >
            <span
              v-else-if="
                scope.row.billSampleResponse.totalNumber !=
                scope.row.billSampleResponse.enoughNumber
              "
              >Chưa hoàn thành</span
            >
            <span v-else>Đã hoàn thành</span>
          </template>
        </el-table-column>
        <el-table-column label="Đủ-Thiếu-Chưa đóng" width="150" align="center">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span style="color: #606266"
              >{{ scope.row.billSampleResponse.enoughNumber }}&nbsp;-&nbsp;</span
            >
            <span style="color: orange"
              >{{ scope.row.billSampleResponse.partNumber }}&nbsp;-&nbsp;</span
            >
            <span style="color: red">{{ scope.row.billSampleResponse.emptyNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" label="Còn lại thu">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span class="high-light">{{
              scope.row.billSampleResponse.totalMoneyRemainIn | formatCurrencyNew
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" label="Còn lại chi">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span class="high-light">{{
              scope.row.billSampleResponse.totalMoneyRemainOut | formatCurrencyNew
            }}</span>
          </template></el-table-column
        >
        <el-table-column label="T.Thu - T.Chi" width="120" align="right">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span>{{
              (scope.row.billSampleResponse.moneyTotalIn -
                scope.row.billSampleResponse.moneyTotalOut)
                | formatCurrencyNew
                | 0
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tổng chi" width="120" align="right">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span>{{
              scope.row.billSampleResponse.moneyTotalOut | formatCurrencyNew | 0
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Đã chi" width="120" align="right">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span>{{
              scope.row.billSampleResponse.moneyTotalPaidOut | formatCurrencyNew
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" label="Chi thiếu">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span>{{
              scope.row.billSampleResponse.moneyTotalRemainOut | formatCurrencyNew
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tổng thu" width="120" align="right">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span>{{
              scope.row.billSampleResponse.moneyTotalIn | formatCurrencyNew
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Đã thu" width="120" align="right">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span>{{
              scope.row.billSampleResponse.moneyTotalPaidIn | formatCurrencyNew
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" label="Thu thiếu">
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <span>{{
              scope.row.billSampleResponse.moneyTotalRemainIn | formatCurrencyNew
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Tác vụ"
          :width="checkPermission(['salary_order_payment']) ? 330 : 230"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope" v-if="scope.row.billSampleResponse != null">
            <el-button
              v-if="checkPermission(['salary_order_payment'])"
              size="mini"
              type="success"
              :disabled="
                scope.row.billSampleResponse == null ||
                scope.row.billSampleResponse.totalNumber == 0
              "
              @click="paidBillSalary(scope.row)"
              >Thanh toán</el-button
            >
            <el-button
              :disabled="
                scope.row.billSampleResponse == null ||
                scope.row.billSampleResponse.totalNumber == 0
              "
              size="mini"
              type="primary"
              @click="orderSalaryDetailMethod(scope.row)"
              >Chi tiết</el-button
            >
            <el-button
              :disabled="
                scope.row.billSampleResponse == null ||
                scope.row.billSampleResponse.totalNumber == 0
              "
              type="warning"
              size="mini"
              @click="orderSalaryHistoryMethod(scope.row)"
              >Lịch sử</el-button
            >
            <el-button
              :disabled="
                scope.row.billSampleResponse == null ||
                scope.row.billSampleResponse.totalNumber == 0
              "
              type="success"
              size="mini"
              @click="handleSalaryMonthMethod(scope.row)"
              ><i class="el-icon-circle-plus"></i
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right; margin: 15px 0">
      <el-button
        :disabled="
          dataSearch.date < pastDate || dataSearch.date > futureDate ? true : false
        "
        class="button-bottom"
        type="success"
        :loading="loadingButton"
        @click="gengerateOrderMethod()"
        >Khởi tạo hóa đơn</el-button
      >
      <el-dropdown @command="handleCommandAction">
        <el-button class="button-bottom" type="success" :loading="loadingButtonAction">
          Tác vụ
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu class="el-dropdown-menu-container">
          <el-dropdown-item command="show">Hiển thị</el-dropdown-item>
          <el-dropdown-item command="unshow">Bỏ hiển thị</el-dropdown-item>
          <el-dropdown-item
            v-if="checkPermission(['salary_order_locked'])"
            command="locked"
            >Khóa</el-dropdown-item
          >
          <el-dropdown-item
            v-if="checkPermission(['salary_order_locked'])"
            command="unlocked"
            >Bỏ khóa</el-dropdown-item
          >
          <el-dropdown-item command="viewDetailAll">Xem tổng hợp</el-dropdown-item>
          <el-dropdown-item command="sendNotifySalary"
            >Thông báo công lương</el-dropdown-item
          >
          <!-- <el-dropdown-item command="exportSaraly">Xuất danh mục lương</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <SalaryPaidMonth
      v-bind:nameEmployeeMonth="nameEmployee"
      :dialogVisible="showSalaryMonthDialog"
      @dialog-close="dialogCloseSalaryDefault()"
      ref="SalaryPaidMonth"
    />
    <SalaryBill
      v-bind:nameEmployee="nameEmployee"
      :dialogVisible="showSalaryBillDialog"
      @dialog-close="dialogCloseSalaryBill()"
      ref="SalaryBill"
    />
    <order-salary-history-dialog
      :dialogVisible="showOrderSalaryHistoryDialog"
      @dialog-close="closeOrderSalaryHistoryDialog()"
      ref="OrderSalaryHistoryDialog"
    />
    <order-salary-detail-dialog
      :dialogVisible="showOrderSalaryDetailDialog"
      @dialog-close="closesOrderSalaryDetailDialog()"
      ref="OrderSalaryDetailDialog"
    />
    <StatisticalCommonDialog
      :dialogVisible="showStatisticalCommonDialog"
      @dialog-close="closeStatisticalCommonDialog()"
      ref="StatisticalCommonDialog"
    />
    <ViewAllDataDialog
      :dataList="employeeSalaryApplyList"
      :dialogVisible="showDialogViewAll"
      @dialog-close="closeViewAllDialog()"
      ref="ViewAllDataDialog"
    />
  </div>
</template>

<script>
// import http from "../../http-download";
import moment from "moment";
import checkPermission from "@/utils/permission.js";
import DepartmentDataService from "@/services/DepartmentDataService";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
import SalaryPaidMonth from "./SalaryPaidMonth.vue";
import ViewAllDataDialog from "./ViewAllDataDialog.vue";
import SalaryBill from "./SalaryBill.vue";
import OrderSalaryHistoryDialog from "./OrderSalaryHistoryDialog.vue";
import OrderSalaryDetailDialog from "./OrderSalaryDetailDialog.vue";
import StatisticalCommonDialog from "./StatisticalCommonDialog.vue";

export default {
  components: {
    SalaryPaidMonth,
    SalaryBill,
    OrderSalaryHistoryDialog,
    OrderSalaryDetailDialog,
    StatisticalCommonDialog,
    ViewAllDataDialog,
  },
  data() {
    return {
      nameEmployee: "",
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      loadingButton: false,
      loaddingButtonNofify: false,
      loadingButtonAction: false,
      departmentList: [],
      employeeSalaryApplyList: [],
      multipleSelection: [],
      dataSearch: {
        date: "",
        loginStatus: "",
        statusEmployeee: "Đang làm",
        idDepartment: "",
        employeeNameOrPhone: "",
      },
      statusEmployeeList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      showSalaryMonthDialog: false,
      showSalaryBillDialog: false,
      showOrderSalaryHistoryDialog: false,
      showOrderSalaryDetailDialog: false,
      showStatisticalCommonDialog: false,
      showDialogViewAll: false,
      showUpdateDialog: false,
      pastDate: moment(new Date()).add(-2, "M").format("YYYY-MM-DD"),
      futureDate: moment(new Date()).add(1, "M").format("YYYY-MM-DD"),
      billData: {
        date: "",
        idList: [],
        status: true,
      },
    };
  },

  methods: {
    checkPermission,
    tableHeaderChidrenColor() {
      return "background-color: #b0d3f7;color: #606266;";
    },
    tableRowStyle({ row }) {
      if (row.billSampleResponse == null) {
        return "color: #409EFF";
      } else if (row.billSampleResponse.totalNumber == 0) {
        return "color: #FB9A00";
      } else if (
        row.billSampleResponse.totalNumber != row.billSampleResponse.enoughNumber
      ) {
        return "color: #FD4803";
      }
    },
    orderSalaryDetailMethod(row) {
      this.showOrderSalaryDetailDialog = true;
      this.$refs.OrderSalaryDetailDialog.getOrderSalaryDetailInitial(
        row.billSampleResponse.id
      );
    },
    closesOrderSalaryDetailDialog() {
      this.showOrderSalaryDetailDialog = false;
      this.searchByProperties();
    },
    orderSalaryHistoryMethod(row) {
      this.showOrderSalaryHistoryDialog = true;
      this.$refs.OrderSalaryHistoryDialog.getOrderHistoryInitial(row);
    },
    closeOrderSalaryHistoryDialog() {
      this.showOrderSalaryHistoryDialog = false;
      this.searchByProperties();
    },
    closeStatisticalCommonDialog() {
      this.showStatisticalCommonDialog = false;
    },
    closeViewAllDialog() {
      this.showDialogViewAll = false;
    },
    statisticalMethod() {
      this.showStatisticalCommonDialog = true;
      this.$refs.StatisticalCommonDialog.getStatisticalCommonInitial();
    },
    paidBillSalary(data) {
      this.nameEmployee =
        data.fullName + " - " + moment(this.dataSearch.date).format("MM/YYYY");
      this.showSalaryBillDialog = true;
      this.$refs.SalaryBill.getDataInitial(
        data.id,
        data.billSampleResponse.code,
        data.billSampleResponse.id,
        this.dataSearch.date
      );
    },

    //hiển thị 1 hóa đơn
    handleViewOneMethod(row) {
      let dataInput = {
        status: row.billSampleResponse.view,
        date: this.dataSearch.date,
        idList: [row.billSampleResponse.id],
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
            this.billData.idList = [];
          }, 500);
        });
    },
    //khóa 1 hóa đơn
    handleLockedOneMethod(row) {
      let dataInput = {
        status: row.billSampleResponse.locked,
        date: this.dataSearch.date,
        idList: [row.billSampleResponse.id],
      };
      EmployeeSalaryService.lockedBill(dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
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
            this.billData.idList = [];
          }, 500);
        });
    },
    checkSelectRowMethod(selectList, text) {
      if (selectList.length == 0) {
        this.$message({
          message: "Không có nhân sự nào " + text + " được chọn",
          type: "error",
        });
        throw null;
      }
    },
    //hiển thị nhiều hóa đơn
    handleViewManyMethod(text, status) {
      let selectRowList = this.multipleSelection.filter(
        (x) => x.billSampleResponse != null && x.billSampleResponse.view != status
      );
      let textAlert = status ? "chưa hiển thị" : "đã hiển thị";
      this.checkSelectRowMethod(selectRowList, "ở trạng thái " + textAlert);
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          text +
          " cho " +
          selectRowList.length +
          " nhân sự không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingButtonAction = true;
        let dataInput = {
          status: status,
          date: this.dataSearch.date,
          idList: selectRowList.map((x) => x.billSampleResponse.id),
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
              this.searchByProperties();
              this.billData.idList = [];
              this.loadingButtonAction = false;
            }, 500);
          });
      });
    },
    //khóa nhiều hóa đơn
    handleLokedManyMethod(text, status) {
      let selectRowList = this.multipleSelection.filter(
        (x) => x.billSampleResponse != null && x.billSampleResponse.locked != status
      );
      let textAlert = status ? "chưa khóa" : "đã khóa";
      this.checkSelectRowMethod(selectRowList, "ở trạng thái " + textAlert);
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          text +
          " cho " +
          selectRowList.length +
          " nhân sự không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingButtonAction = true;
        let dataInput = {
          status: status,
          date: this.dataSearch.date,
          idList: selectRowList.map((x) => x.billSampleResponse.id),
        };
        EmployeeSalaryService.lockedBill(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
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
              this.searchByProperties();
              this.billData.idList = [];
              this.loadingButtonAction = false;
            }, 500);
          });
      });
    },
    checkButtomBefore(selectList, text) {
      if (selectList.length == 0) {
        this.$message({
          message: "Không có nhân sự nào " + text + " được chọn",
          type: "error",
        });
        throw null;
      }
    },
    /**
     * khởi tạo hóa đơn
     */
    gengerateOrderMethod() {
      let selectRowList = this.multipleSelection.filter(
        (x) => x.billSampleResponse == null
      );
      this.checkButtomBefore(selectRowList, "chưa có hóa đơn");
      this.$confirm(
        "Bạn có chắc chắn muốn khởi tạo hóa đơn cho " +
          selectRowList.length +
          " nhân sự không?",
        "Khởi tạo hóa đơn tháng " + moment(this.dataSearch.date).format("MM/yyyy") + "!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingButton = true;
        let dataInput = {
          date: this.dataSearch.date,
          idList: selectRowList.map((x) => x.id),
        };
        EmployeeSalaryService.generateOrderEmployee(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
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
      });
    },
    /**
     * thông báo học phí
     */
    notifyOrderMethod() {
      let selectRowList = this.multipleSelection.filter(
        (x) => x.billSampleResponse != null
      );
      this.checkButtomBefore(selectRowList, "có hóa đơn");
      this.$confirm(
        "Bạn có chắc chắn muốn gửi thông báo công lương cho " +
          selectRowList.length +
          " nhân sự không?",
        "Thông báo",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingData = true;
        this.loaddingButtonNofify = true;
        let dataInput = {
          date: this.dataSearch.date,
          idList: selectRowList.map((x) => x.id),
        };
        EmployeeSalaryService.sendNotify(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            this.loadingData = false;
            this.loaddingButtonNofify = false;
          });
      });
    },
    handleCommandAction(command) {
      if (command == "show") {
        this.handleViewManyMethod("hiển thị", true);
      } else if (command == "unshow") {
        this.handleViewManyMethod("bỏ hiển thị", false);
      } else if (command == "locked") {
        this.handleLokedManyMethod("khóa", true);
      } else if (command == "unlocked") {
        this.handleLokedManyMethod("bỏ khóa", false);
      } else if (command == "exportSaraly") {
        // this.applyFromSchool();
        console.log("xuất excel");
      } else if (command == "viewDetailAll") {
        this.showDetailData();
      } else if (command == "sendNotifySalary") {
        this.notifyOrderMethod();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    edit(data) {
      this.showUpdateDialog = true;
      this.$refs.SalaryApplyUpdate.getSalaryApply(data.id);
    },
    handleSalaryMonthMethod(row) {
      this.nameEmployee = row.fullName;
      this.showSalaryMonthDialog = true;
      this.$refs.SalaryPaidMonth.getDataMonthIntial(row.id, this.dataSearch.date);
    },
    dialogCloseSalaryDefault() {
      this.showSalaryMonthDialog = false;
      this.searchByProperties();
    },
    dialogCloseSalaryBill() {
      this.showSalaryBillDialog = false;
      this.searchByProperties();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toogleExpandDetail(index, row) {
      row.expandRow = !row.expandRow;
      let $tableDetail = this.$refs.tableDetail;
      $tableDetail.toggleRowExpansion(row);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold; font-size:12px";
    },
    searchByProperties() {
      this.loadingData = true;
      this.textTable = "";
      this.dataSearch.date = moment(this.dataSearch.date).format("YYYY-MM-DD");
      EmployeeSalaryService.searchEmployeeSalaryPaid(
        this.dataSearch.date,
        this.dataSearch.statusEmployeee,
        this.dataSearch.idDepartment,
        this.dataSearch.employeeNameOrPhone
      )
        .then((resp) => {
          this.employeeSalaryApplyList = resp.data.data;
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
          if (this.employeeSalaryApplyList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * Xem tổng hợp
     */
    /**
     * Xem tổng hợp
     */
    showDetailData() {
      this.showDialogViewAll = true;
    },
    getDepartment() {
      DepartmentDataService.getAllCommon()
        .then((response) => {
          this.departmentList = response.data.data;
          let a = this.departmentList;
          console.log(a);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMonthNow() {
      this.dataSearch.date = moment(new Date()).format("YYYY-MM-DD");
      console.log(this.dataSearch.date);
    },
  },
  beforeMount() {
    this.getMonthNow();
    this.getDepartment();
    this.searchByProperties();
  },
};
</script>

<style lang="scss" scoped>
.content {
  .row-data {
    margin-bottom: 20px;
  }

  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-left {
    margin-right: 5px;
    width: 145px;
  }
  .button-click-left {
    display: inline-block;
  }
  .button-click {
    float: right;
  }
  // .table-content {
  //   .el-table {
  //     border-top-left-radius: 5px;
  //     border-top-right-radius: 5px;
  //     border: 1px solid #78a5e7;
  //   }
  // }
  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
  /deep/.el-table th.gutter {
    background-color: #78a5e7;
  }
  // /deep/.el-table--scrollable-y .el-table__body-wrapper {
  //   overflow-y: auto;
  //   // margin-top: -1px;
  // }
  // /deep/.el-table .cell {
  //   box-sizing: border-box;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: pre-line;
  //   word-break: break-all;
  //   line-height: 23px;
  //   padding-right: 10px;
  //   // max-height: 50px;
  //   text-overflow: ellipsis;
  // }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
  }
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    // margin-left: 5px;
  }
  /deep/.element.style {
    width: 257px !important;
  }
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: rgb(95, 180, 74);
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
/deep/.el-icon-loading:before {
  content: "\e6cf";
}
/deep/.el-loading-spinner .el-loading-text {
  color: #606266;
  font-size: 15px;
}
/deep/.el-loading-spinner {
  top: 67%;
  width: 100%;
  text-align: center;
  position: absolute;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 6px 0;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.click-in-row {
  border: none;
  padding: 0;
  color: #3a3ace;
}
.click-in-row:hover {
  color: #fa03d9;
  // background: none;
}
.handle-account {
  border: none;
  padding: 0;
  color: red;
}
.handle-account:hover {
  color: #fa03d9;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
h4.edit {
  color: red;
  position: absolute;
  bottom: -12px;
  right: 18px;
}
/deep/.el-table th > .cell {
  text-align: center !important;
  font-size: 14px;
}
/deep/.el-icon-arrow-right:before {
  content: "";
}
.high-light {
  color: blue;
  font-weight: bold;
}
</style>
