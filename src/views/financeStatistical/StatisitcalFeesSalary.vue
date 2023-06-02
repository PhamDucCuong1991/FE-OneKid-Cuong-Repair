<template>
  <div>
    <div style="margin-top: 5px">
      <div style="margin-bottom: -20px; position: relative; z-index: 1">
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearch.startMonth"
          @change="changeMonthMethod()"
        >
          <el-option
            v-for="item in startMonthList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-select
          style="width: 120px; margin-right: 5px"
          v-model="dataSearch.endMonth"
          @change="changeMonthMethod()"
        >
          <el-option
            v-for="item in endMonthList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-date-picker
          style="width: 100px"
          class="input-common"
          :clearable="false"
          @change="changeYearMethod()"
          v-model="dataSearch.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
        ></el-date-picker>
        <el-input
          style="width: 300px"
          placeholder="Nhập tên nhóm"
          clearable
          v-model="dataSearch.name"
          @clear="changeNameMethod()"
          @keyup.enter.native="changeNameMethod()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="changeNameMethod()"
          ></el-button>
        </el-input>
      </div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- thiết lập khoản -->
        <el-tab-pane label="Nhóm học phí" name="tabName1">
          <el-table
            ref="multipleTable"
            highlight-current-row
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            :data="response1List"
            :cell-style="tableRowStyle"
            @selection-change="handleSelectionChange1"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="selection"
              align="center"
              width="55"
            ></el-table-column>
            <el-table-column
              fixed
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              fixed
              prop="name"
              label="Tên nhóm"
              min-width="150"
            ></el-table-column>
            <el-table-column
              prop="note"
              label="Mô tả"
              min-width="150"
            ></el-table-column>
            <el-table-column align="right" label="Tổng thu" min-width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.moneyTotalInOut | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
            <el-table-column align="right" label="Đã thu" min-width="150">
              <template slot-scope="scope">
                <span>{{
                  scope.row.moneyTotalInOutPaid | formatCurrencyNew
                }}</span>
              </template>
            </el-table-column>
            <el-table-column align="right" label="Còn lại" min-width="150">
              <template slot-scope="scope">
                <span>{{
                  scope.row.moneyTotalInOutRemain | formatCurrencyNew
                }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col
              :span="8"
              style="
                background: #909399;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
              "
            >
              Tổng thu:
              <span>
                <span>
                  {{
                    this.loda.sumBy(response1List, (x) => x.moneyTotalInOut)
                      | formatCurrency
                  }}</span
                >
              </span>
            </el-col>
            <el-col :span="8" style="background: #909399">
              Tổng đã thu:
              <span>
                <span>
                  {{
                    this.loda.sumBy(response1List, (x) => x.moneyTotalInOutPaid)
                      | formatCurrency
                  }}</span
                >
              </span>
            </el-col>
            <el-col
              :span="8"
              style="
                background: #909399;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              "
            >
              Tổng còn lại:
              <span>
                <span>
                  {{
                    this.loda.sumBy(
                      response1List,
                      (x) => x.moneyTotalInOutRemain
                    ) | formatCurrency
                  }}</span
                >
              </span>
            </el-col>
          </el-row>
          <el-button
            style="float: right; border-radius: 0"
            type="success"
            :loading="loadingButton1"
            @click="exportFeesMethod()"
            >Xuất học phí</el-button
          >
        </el-tab-pane>

        <!-- quản lý khoản -->
        <el-tab-pane label="Nhóm công lương" name="tabName2">
          <el-table
            ref="multipleTable"
            highlight-current-row
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            :data="response2List"
            :cell-style="tableRowStyle"
            @selection-change="handleSelectionChange2"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="selection"
              align="center"
              width="55"
            ></el-table-column>
            <el-table-column
              fixed
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              fixed
              prop="name"
              label="Tên nhóm"
              min-width="150"
            ></el-table-column>
            <el-table-column
              prop="note"
              label="Mô tả"
              min-width="150"
            ></el-table-column>
            <el-table-column align="right" label="Tổng chi" min-width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.moneyTotalInOut | formatCurrencyNew }}</span>
              </template>
            </el-table-column>
            <el-table-column align="right" label="Đã chi" min-width="150">
              <template slot-scope="scope">
                <span>{{
                  scope.row.moneyTotalInOutPaid | formatCurrencyNew
                }}</span>
              </template>
            </el-table-column>
            <el-table-column align="right" label="Còn lại" min-width="150">
              <template slot-scope="scope">
                <span>{{
                  scope.row.moneyTotalInOutRemain | formatCurrencyNew
                }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col
              :span="8"
              style="
                background: #909399;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
              "
            >
              Tổng chi:
              <span>
                <span>
                  {{
                    this.loda.sumBy(response2List, (x) => x.moneyTotalInOut)
                      | formatCurrency
                  }}</span
                >
              </span>
            </el-col>
            <el-col :span="8" style="background: #909399">
              Tổng đã chi:
              <span>
                <span>
                  {{
                    this.loda.sumBy(response2List, (x) => x.moneyTotalInOutPaid)
                      | formatCurrency
                  }}</span
                >
              </span>
            </el-col>
            <el-col
              :span="8"
              style="
                background: #909399;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              "
            >
              Tổng còn lại:
              <span>
                <span>
                  {{
                    this.loda.sumBy(
                      response2List,
                      (x) => x.moneyTotalInOutRemain
                    ) | formatCurrency
                  }}</span
                >
              </span>
            </el-col>
          </el-row>
          <el-button
            style="float: right; border-radius: 0"
            type="success"
            :loading="loadingButton2"
            @click="exportSalaryMethod()"
            >Xuất công lương</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import FinanceStatisticalService from "@/services/FinanceStatisticalService";

const valMonthList = [
  { key: "01", value: "Tháng 01" },
  { key: "02", value: "Tháng 02" },
  { key: "03", value: "Tháng 03" },
  { key: "04", value: "Tháng 04" },
  { key: "05", value: "Tháng 05" },
  { key: "06", value: "Tháng 06" },
  { key: "07", value: "Tháng 07" },
  { key: "08", value: "Tháng 08" },
  { key: "09", value: "Tháng 09" },
  { key: "10", value: "Tháng 10" },
  { key: "11", value: "Tháng 11" },
  { key: "12", value: "Tháng 12" },
];
export default {
  data() {
    return {
      textTable: "",
      loadingData: false,
      activeTabName: "tabName1",
      responseList: [],
      response1List: [],
      response2List: [],
      multipleSelection1: [],
      multipleSelection2: [],
      loaddingButton: false,
      showCreateDialog: false,
      showUpdateDialog: false,
      showAddDialog: false,
      loadingButton1: false,
      loadingButton2: false,
      startMonthList: valMonthList,
      endMonthList: valMonthList,
      monthList: valMonthList,
      dataSearch: {
        startMonth: "",
        endMonth: "",
        year: "",
        name: "",
      },
      className: "",
      //css excel
      styleCols1: [],
      styleCols2: [],
      nameCol: {
        name: "",
        style: "",
        numberMerges: 1,
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.category == "out") {
        return "color: #409EFF";
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "tabName1") {
        this.searchByProperties1();
      } else if (tabNameClick == "tabName2") {
        this.searchByProperties2();
      }
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val;
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    changeMonthMethod() {
      this.startMonthList = this.monthList.filter(
        (x) => x.key <= this.dataSearch.endMonth
      );
      this.endMonthList = this.monthList.filter(
        (x) => x.key >= this.dataSearch.startMonth
      );
      if (this.activeTabName == "tabName1") {
        this.searchByProperties1();
      } else if (this.activeTabName == "tabName2") {
        this.searchByProperties2();
      }
    },
    changeYearMethod() {
      if (this.activeTabName == "tabName1") {
        this.searchByProperties1();
      } else if (this.activeTabName == "tabName2") {
        this.searchByProperties2();
      }
    },
    changeNameMethod() {
      if (this.activeTabName == "tabName1") {
        this.searchByProperties1();
      } else if (this.activeTabName == "tabName2") {
        this.searchByProperties2();
      }
    },
    checkSellectRow(selectRowList) {
      if (selectRowList.length == 0) {
        this.$message({
          message: "Không có khoản nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    exportFeesMethod() {
      this.getStyleExcel();
      let selectRowList = this.multipleSelection1.map((x) => x.id);
      this.checkSellectRow(selectRowList);
      this.loadingButton1 = true;
      FinanceStatisticalService.exportExcelFees(
        selectRowList,
        this.dataSearch.startMonth,
        this.dataSearch.endMonth,
        this.moment(this.dataSearch.year).year()
      )
        .then((resp) => {
          import("@/services/ExportExcel")
            .then((excel) => {
              let dataList = resp.data.data;
              let fileName = "SO_LIEU_NHOM_HP";
              const tHeader = [
                "STT",
                "Nhóm học phí",
                "Tổng thu",
                "Đã thu",
                "Còn lại",
              ];
              const filterVal = ["pro1", "pro2", "pro3", "pro4", "pro5"];
              let columnList = [
                { col: 5 },
                { col: 35 },
                { col: 20 },
                { col: 20 },
                { col: 20 },
              ];
              excel.export_json_to_excel({
                header: tHeader,
                data: dataList,
                title: filterVal,
                filename: fileName,
                columnsWidth: columnList,
                styleCols1: this.styleCols1,
                styleCols2: this.styleCols2,
                nameCol: this.nameCol,
              });
            })
            .finally(() => {
              this.styleCols1 = [];
              this.styleCols2 = [];
              setTimeout(() => {
                this.loadingButton1 = false;
              }, 500);
            });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          setTimeout(() => {
            this.loadingButton1 = false;
          }, 500);
        });
    },
    getStyleExcel() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      this.nameCol.name = "Tổng cộng";
      this.nameCol.style = {
        fill: { fgColor: { rgb: "3399ff" } },
        font,
        border,
        alignment,
      };

      let style1 = {
        name: "A4:E4",
        style: {
          fill: { fgColor: { rgb: "0089cb" } },
          font,
          alignment,
          border,
        },
      };

      let styleCol01 = {
        name: ["A1"],
        style: {
          font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
        },
      };
      let styleCol02 = {
        name: ["A2", "A3"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };

      this.styleCols2.push(style1);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);
    },
    exportSalaryMethod() {
      this.getStyleExcel();
      let selectRowList = this.multipleSelection2.map((x) => x.id);
      this.checkSellectRow(selectRowList);
      this.loadingButton2 = true;
      FinanceStatisticalService.exportExcelSalary(
        selectRowList,
        this.dataSearch.startMonth,
        this.dataSearch.endMonth,
        this.moment(this.dataSearch.year).year()
      )
        .then((resp) => {
          import("@/services/ExportExcel")
            .then((excel) => {
              let dataList = resp.data.data;
              let fileName = "SO_LIEU_NHOM_CONG_LUONG";
              const tHeader = [
                "STT",
                "Nhóm công lương",
                "Tổng chi",
                "Đã chi",
                "Còn lại",
              ];
              const filterVal = ["pro1", "pro2", "pro3", "pro4", "pro5"];
              let columnList = [
                { col: 5 },
                { col: 35 },
                { col: 20 },
                { col: 20 },
                { col: 20 },
              ];
              excel.export_json_to_excel({
                header: tHeader,
                data: dataList,
                title: filterVal,
                filename: fileName,
                columnsWidth: columnList,
                styleCols1: this.styleCols1,
                styleCols2: this.styleCols2,
                nameCol: this.nameCol,
              });
            })
            .finally(() => {
              this.styleCols1 = [];
              this.styleCols2 = [];
              setTimeout(() => {
                this.loadingButton2 = false;
              }, 500);
            });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          setTimeout(() => {
            this.loadingButton2 = false;
          }, 500);
        });
    },
    searchByProperties2() {
      this.loadingData = true;
      FinanceStatisticalService.getStatisticalEmployee(
        this.dataSearch.startMonth,
        this.dataSearch.endMonth,
        this.moment(this.dataSearch.year).year(),
        this.dataSearch.name
      )
        .then((resp) => {
          this.response2List = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });

          this.response2List = [];
        })
        .finally(() => {
          if (this.response2List.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm tất cả các quyền cho người dùng
     */
    searchByProperties1() {
      this.loadingData = true;
      FinanceStatisticalService.getStatisticalKids(
        this.dataSearch.startMonth,
        this.dataSearch.endMonth,
        this.moment(this.dataSearch.year).year(),
        this.dataSearch.name
      )
        .then((resp) => {
          this.response1List = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });

          this.response1List = [];
        })
        .finally(() => {
          if (this.response1List.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.dataSearch.year = this.moment().format("YYYY-MM-DD");
    this.dataSearch.startMonth = "01";
    this.dataSearch.endMonth = "12";
    this.searchByProperties1();
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
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
// /deep/.el-table td {
//   padding: 8px 0;
// }
// /deep/.el-table th {
//   padding: 6px 0;
// }
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
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
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
// td {
//   padding: 12px;
// }
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
.el-row {
  margin-bottom: 5px;
  font-size: 17px;
  color: white;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.el-col {
  padding: 9px 5px;
}
</style>
