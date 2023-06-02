<template>
  <el-dialog
    title="Chi tiết quỹ"
    :visible.sync="dialogVisible"
    width="1200px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <div style="margin-bottom: 15px; position: relative; z-index: 1">
      <el-radio-group
        style="margin-right: 20px"
        v-model="dataSearch.type"
        @change="changeTypeMethod()"
      >
        <el-radio label="month">Xem theo tháng</el-radio>
        <el-radio label="date">Xem theo ngày</el-radio>
      </el-radio-group>
      <el-select
        v-if="showMonth"
        style="width: 120px; margin-right: 5px"
        v-model="dataSearch.month"
        clearable
        placeholder="Chọn tháng"
        @change="searchHeaderMethod()"
      >
        <el-option
          v-for="item in monthList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-date-picker
        v-if="showDate"
        class="input-common"
        style="width: 265px"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        v-model="dataSearch.dateList"
        type="daterange"
        unlink-panels
        range-separator="-"
        @change="changeDateMethod()"
        start-placeholder="Ngày bắt đầu"
        end-placeholder="Ngày kết thúc"
      >
      </el-date-picker>
    </div>
    <el-row>
      <el-col
        :span="5"
        style="
          background: #409eff;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        "
      >
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
            (responseData.moneyIn - responseData.moneyOut) | formatCurrencyNew
          }}
        </span>
      </el-col>
      <el-col
        :span="5"
        style="
          background: #409eff;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        "
      >
        Số dư cuối kỳ:
        <span>{{ responseData.moneyEnd | formatCurrencyNew }}</span>
      </el-col>
    </el-row>
    <div style="margin-bottom: 10px; font-weight: bold; font-size: 17px"></div>
    <el-table
      ref="multipleTable"
      :empty-text="textTable"
      v-loading="loadingData"
      :element-loading-text="$tableLoadding"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255, 0)"
      highlight-current-row
      :data="responseData.dataList"
      :cell-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      :max-height="$tableMaxHeightSmall"
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
          <span v-if="scope.row.type == 'KID'">Học sinh</span>
          <span v-else-if="scope.row.type == 'EMP'">Nhân sự</span>
          <span v-else-if="scope.row.type == 'SCH'">Nhà trường</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Mã hóa đơn"
        align="center"
        prop="code"
        min-width="125"
      >
      </el-table-column>
      <el-table-column label="Số tiền" align="right" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.money == 0">0</span>
          <span v-else>{{ scope.row.money | formatCurrencyNew }}</span>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-pagination
        style="float: left"
        background
        :current-page="pageNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultNew"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import CashInternalService from "@/services/CashInternalService";
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
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      loadingData: true,
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
        idCashBook: "",
        type: "month",
        month: "",
        dateList: [],
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.category == "out") {
        return "color: #FD4803";
      }
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.resetData();
      }, 300);
    },
    resetData() {
      this.loadingButton = false;
      this.responseData = "";
      this.showDate = false;
      this.showMonth = true;
      this.dataSearch.type = "month";
      this.dataSearch.month = "";
      this.dataSearch.dataList = [];
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.searchByProperties();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchByProperties();
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
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      // this.textTable = this.$tableLoadding;
      this.loadingData = true;
      CashInternalService.searchCashBookHistory(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.idCashBook,
        this.dataSearch.type,
        this.dataSearch.month,
        this.dataSearch.dateList
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
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getDataHistoryInitial(id) {
      this.dataSearch.idCashBook = id;
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
