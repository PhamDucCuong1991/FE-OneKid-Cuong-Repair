<template>
  <div>
    <div style="position: relative; z-index: 1; margin-top: 5px" v-if="showHistory">
      <el-radio-group style="margin-right: 20px" v-model="dataSearch.type" @change="changeTypeMethod()">
        <el-radio label="month">Xem theo tháng</el-radio>
        <el-radio label="date">Xem theo ngày</el-radio>
      </el-radio-group>
      <el-select v-if="showMonth" style="width: 120px; margin-right: 5px" v-model="dataSearch.month" clearable
        placeholder="Chọn tháng" @change="searchHeaderMethod()">
        <el-option v-for="item in monthList" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-date-picker v-if="showDate" class="input-common" style="width: 265px" value-format="yyyy-MM-dd"
        format="dd-MM-yyyy" v-model="dataSearch.dateList" type="daterange" unlink-panels range-separator="-"
        @change="changeDateMethod()" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc">
      </el-date-picker>
      <el-select v-model="dataSearch.typeCashbook" @change="changeTypeMethod()" clearable placeholder="Chọn nguồn" style="width: 150px">
        <el-option value="KID" label="Học phí"></el-option>
        <el-option value="EMP" label="Công lương"></el-option>
        <el-option value="SCH" label="Thu chi nội bộ"></el-option>
      </el-select>
    </div>
    <div v-else-if="showAdd" style="position: relative; z-index: 1; margin-top: 5px; height: 40px"></div>
    <el-tabs type="card" v-model="activeName" @tab-click="handleClickTab" style="margin-top: -20px">
      <el-tab-pane label="Năm hiện tại" name="tab1">
        <div>
          <el-row>
            <el-col :span="5" style="
                background: #409eff;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
              ">
              Số dư đầu kỳ:
              <span>
                {{ responseData.moneyStart | formatCurrencyNew }}
              </span>
            </el-col>
            <el-col :span="5" style="background: #67c23a">
              Tổng thu:
              <span>
                {{ responseData.moneyIn | formatCurrencyNew }}
              </span>
            </el-col>
            <el-col :span="5" style="background: #f56c6c">
              Tổng chi:
              <span>{{ responseData.moneyOut | formatCurrencyNew }}</span>
            </el-col>
            <el-col :span="4" style="background: #e6a23c">
              Thu-Chi:
              <span>
                {{
                    (responseData.moneyIn - responseData.moneyOut)
                    | formatCurrencyNew
                }}
              </span>
            </el-col>
            <el-col :span="5" style="
                background: #409eff;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              ">
              Số dư cuối kỳ:
              <span>{{ responseData.moneyEnd | formatCurrencyNew }}</span>
            </el-col>
          </el-row>
          <div style="margin-bottom: 10px; font-weight: bold; font-size: 17px"></div>
          <el-table ref="multipleTable" :empty-text="textTable" v-loading="loadingDataHistory"
            :element-loading-text="$tableLoadding" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)" highlight-current-row :data="responseData.dataList"
            :cell-style="tableRowStyleHistory" :header-cell-style="tableHeaderColor" :max-height="$tableMaxHeightSmall"
            @selection-change="handleSelectionChangeHistory" border>
            <el-table-column type="index" fixed label="STT" width="50" align="center"></el-table-column>
            <el-table-column width="170" fixed align="center" label="Thời gian thực">
              <template slot-scope="scope">
                <span>{{ scope.row.createdDate | formatDateTime }}</span>
              </template>
            </el-table-column>
            <el-table-column width="170" fixed align="center" label="Thời gian nhập">
              <template slot-scope="scope">
                <span>{{ scope.row.date | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Loại" align="center" min-width="170">
              <template slot-scope="scope">
                <span v-if="scope.row.category == 'in'">Nạp tiền</span>
                <span v-if="scope.row.category == 'out'">Rút tiền</span>
              </template>
            </el-table-column>
            <el-table-column label="Nguồn" align="center" min-width="170">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 'KID'">Học phí</span>
                <span v-else-if="scope.row.type == 'EMP'">Công lương</span>
                <span v-else-if="scope.row.type == 'SCH'">Thu chi nội bộ</span>
                <span v-else>
                  <span v-if="scope.row.origin == 'UNAPPROVED'">Bỏ duyệt khoản</span>
                  <span v-else-if="scope.row.origin == 'DELETE'">Xóa khoản</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Mã hóa đơn" align="center" prop="code" min-width="125">
            </el-table-column>
            <el-table-column label="Số tiền" align="right" min-width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.money == 0">0</span>
                <span v-else>{{ scope.row.money | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="paging-click row-data" style="float: right; margin-bottom: 10px">
            <el-pagination style="float: left" background :current-page="pageNumber" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" :page-sizes="$pageListDefaultNew" :page-size="maxPageItem"
              :layout="$pageLayoutDefault" :total="pageTotal"></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Danh sách" name="tab2">
        <div>
          <el-table ref="multipleTable" :empty-text="textTable" v-loading="loadingData"
            :element-loading-text="$tableLoadding" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)" highlight-current-row :data="responseList"
            :cell-style="tableRowStyle" :header-cell-style="tableHeaderColor" :max-height="$tableMaxHeight"
            @selection-change="handleSelectionChange" border>
            <el-table-column type="index" fixed label="STT" width="50" align="center"></el-table-column>
            <el-table-column width="170" fixed align="center" label="Năm">
              <template slot-scope="scope">
                <span>{{ scope.row.year }}</span>
                <div>
                  {{ scope.row.startDate | formatDate }} -
                  {{ scope.row.endDate | formatDate }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Trạng thái" align="center" width="90">
              <template slot-scope="scope">
                <span v-if="scope.row.locked">Đã khóa</span>
                <span v-else>Chưa khóa</span>
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
            <el-table-column label="Tổng thu - Tổng chi" align="right" min-width="140">
              <template slot-scope="scope">
                <span v-if="scope.row.moneyIn - scope.row.moneyOut == 0">0</span>
                <span v-else>{{
                    (scope.row.moneyIn - scope.row.moneyOut) | formatCurrency
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Số dư cuối kỳ" align="right" min-width="130">
              <template slot-scope="scope">
                <span v-if="
                  scope.row.moneyStart +
                  (scope.row.moneyIn - scope.row.moneyOut) ==
                  0
                ">0</span>
                <span v-else>{{
                    (scope.row.moneyStart +
                      (scope.row.moneyIn - scope.row.moneyOut))
                    | formatCurrency
                }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkPermission(['cashInternal_cashbook_history'])" label="Tác vụ" width="100"
              align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="cashBookHistoryDialogMethod(scope.row)">Chi
                  tiết</el-button>
              </template>
            </el-table-column>
          </el-table>
          <CashBookHistory :dialogVisible="showDetailDialog" @dialog-close="closeDetailDialogMethod()"
            ref="CashBookHistory" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import CashInternalService from "@/services/CashInternalService";
import CashBookHistory from "./CashBookHistory";

const valMonthList = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
export default {
  components: {
    CashBookHistory,
  },
  data() {
    return {
      activeName: "tab1",
      showAdd: false,
      showHistory: true,
      checkDisable: false,
      textTable: "",
      textTableHistory: "",
      loadingData: true,
      loadingDataHistory: true,
      responseList: "",
      showDetailDialog: false,
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      monthList: valMonthList,
      walletBalance: "",
      showMonth: true,
      showDate: false,
      dataInput: {
        category: "in",
      },
      imageUrl: "",
      responseData: "",
      loadingButton: false,
      dataSearch: {
        idCashBook: 1,
        type: "month",
        month: "",
        dateList: [],
        typeCashbook:""
      },
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
    tableRowStyleHistory({ row }) {
      if (row.category == "out") {
        return "color: #FD4803";
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "tab1") {
        this.showAdd = false;
        this.showHistory = true;
      } else if (tabNameClick == "tab2") {
        this.showAdd = true;
        this.showHistory = false;
      }
    },
    closeDetailDialogMethod() {
      this.showDetailDialog = false;
    },
    cashBookHistoryDialogMethod(row) {
      this.showDetailDialog = true;
      this.$refs.CashBookHistory.getDataHistoryInitial(row.id);
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.searchByPropertiesHistory();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchByPropertiesHistory();
    },
    changeTypeMethod() {
      if (this.dataSearch.type == "month") {
        this.showMonth = true;
        this.showDate = false;
      } else if (this.dataSearch.type == "date") {
        this.showMonth = false;
        this.showDate = true;
      }
      this.searchHeaderMethod();
    },
    changeDateMethod() {
      if (this.dataSearch.dateList == null) {
        this.dataSearch.dateList = "";
      }
      this.searchHeaderMethod();
    },
    searchByProperties() {
      this.loadingData = true;
      CashInternalService.findCashBook()
        .then((resp) => {
          this.responseList = resp.data.data;
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
          this.responseList = [];
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByPropertiesHistory();
    },
    searchByPropertiesHistory() {
      this.loadingDataHistory = true;
      CashInternalService.searchCashBookHistoryNow(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.idCashBook,
        this.dataSearch.type,
        this.dataSearch.month,
        this.dataSearch.dateList,
        this.dataSearch.typeCashbook
      )
        .then((resp) => {
          this.responseData = resp.data.data;
          this.pageTotal = resp.data.data.total;
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
          this.pageTotal = 1;
          this.responseData.dataList = [];
          this.responseData = "";
        })
        .finally(() => {
          if (
            this.responseData == "" ||
            this.responseData.dataList.length == 0
          ) {
            this.textTableHistory = this.$tableEmpty;
          }
          this.loadingDataHistory = false;
        });
    },
  },
  beforeMount() {
    this.searchByProperties();
    this.searchByPropertiesHistory();
  },
};
</script>

<style lang="scss" scoped>
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}

/deep/.el-tabs__nav-scroll {
  float: right;
}

/deep/[data-v-5ed4c166] .el-tabs--card>.el-tabs__header {
  border-bottom: none;
  margin-top: -8px;
}

/deep/.el-tabs__nav-wrap {
  margin-top: 0px;
  margin-bottom: -15px;
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

/deep/.el-tabs--card>.el-tabs__header {
  border-bottom: none;
}

/deep/.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}

/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}

/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}

/deep/.el-dialog__body {
  padding-bottom: 5px;
}

/deep/.el-table th>.cell {
  text-align: center !important;
}

.input-common {
  margin-right: 5px;
}

.el-row {
  margin-bottom: 5px;
  font-size: 16px;
  color: white;
  margin-left: 0px !important;
  margin-right: 0px !important;
}

.el-col {
  padding: 9px 5px;
}

/deep/.el-dialog__body {
  padding-top: 0px;
}
</style>
