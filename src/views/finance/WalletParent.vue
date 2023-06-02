<template>
  <div>
    <div>
      <div style="margin-top: 5px">
        <div
          style="
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
            display: inline-block;
          "
        >
          <!-- chọn trạng thái -->
          <el-select
            style="width: 140px"
            class="input-common"
            v-model="dataSearch.status"
            @change="searchWalletParentByProperties()"
            placeholder="Trạng thái"
          >
            <el-option
              v-for="item in kidStatusList"
              :key="item.key"
              :value="item.key"
              :label="item.value"
            ></el-option>
          </el-select>

          <!-- chọn khối -->
          <el-select
            class="input-common"
            style="width: 140px"
            v-model="dataSearch.idGrade"
            @change="changeGradeSearch()"
            placeholder="Chọn khối"
          >
            <el-option
              v-for="item in gradeOfSchoolList"
              :key="item.id"
              :value="item.id"
              :label="item.gradeName"
            ></el-option>
          </el-select>

          <!-- chọn lớp -->
          <el-select
            class="input-common input-class"
            style="width: 140px"
            v-model="dataSearch.idClass"
            placeholder="Chọn lớp"
            @change="searchWalletParentByProperties()"
          >
            <el-option
              v-for="item in classOfGradeList"
              :key="item.id"
              :value="item.id"
              :label="item.className"
            ></el-option>
          </el-select>
          <el-input
            style="width: 300px"
            placeholder="Nhập tên học sinh"
            clearable
            v-model="dataSearch.fullName"
            @clear="searchWalletParentByProperties()"
            @keyup.enter.native="searchWalletParentByProperties()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchWalletParentByProperties()"
            ></el-button>
          </el-input>
        </div>
        <div style="float: right">
          <el-dropdown @command="handleCommandAction">
            <el-button class="button-over" type="success">
              Tác vụ
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu>
              <el-dropdown-item command="excelWallet"
                >Xuất File Excel</el-dropdown-item
              >
              <el-dropdown-item command="excelProviso"
                >Xuất Excel chọn lọc</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-if="checkPermission(['fees_wallet_statistical'])"
            class="button-over"
            type="success"
            @click="WalletParentStatisticalMethod()"
          >
            <i class="el-icon-s-data" />
            Thống kê
          </el-button>
          <el-button
            class="button-over"
            type="success"
            @click="viewWalletParentUnconfimDialog()"
          >
            Chưa xác nhận
          </el-button>
        </div>
      </div>
      <!-- chi tiết khoản các học sinh -->
      <el-table
        :data="responseDataList"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="selection"
          fixed
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          type="index"
          fixed
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          width="110"
          fixed
          align="center"
          prop="walletParent.code"
          label="Mã ví"
        >
        </el-table-column>
        <el-table-column
          width="150"
          fixed
          prop="fullName"
          label="Tên học sinh"
        ></el-table-column>
        <el-table-column label="Ngày sinh" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template></el-table-column
        >
        <el-table-column min-width="140" align="right" label="Tiền nạp">
          <template slot-scope="scope">
            <span v-if="scope.row.walletParent.moneyIn == 0">0</span>
            <span v-else>{{
              scope.row.walletParent.moneyIn | formatCurrency
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="140" align="right" label="Tiền rút">
          <template slot-scope="scope">
            <span v-if="scope.row.walletParent.moneyOut == 0">0</span>
            <span v-else>{{
              scope.row.walletParent.moneyOut | formatCurrency
            }}</span>
          </template></el-table-column
        >
        <el-table-column min-width="140" align="right" label="Số dư ví">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.walletParent.moneyIn -
                  scope.row.walletParent.moneyOut ==
                0
              "
              >0</span
            >
            <span v-else>{{
              (scope.row.walletParent.moneyIn - scope.row.walletParent.moneyOut)
                | formatCurrency
            }}</span>
          </template></el-table-column
        >
        <el-table-column min-width="60" align="center" label="Chưa xác nhận">
          <template slot-scope="scope">
            <span>{{ scope.row.numberStatus }}</span>
            <el-button
              class="click-in-row"
              v-if="scope.row.numberStatus != 0"
              type="text"
              style="text-decoration: underline; margin-left: 4px"
              @click="handleHistoryFalse(scope.row)"
              >(Xem)</el-button
            >
          </template></el-table-column
        >
        <el-table-column
          label="Tác vụ"
          fixed="right"
          width="240"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission(['fees_wallet_create'])"
              type="success"
              size="mini"
              @click="inOutMoneyMethod(scope.row)"
              >Nạp/rút tiền</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="viewWalletParentHistoryMethod(scope.row)"
              >Xem lịch sử</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right; margin: 15px 0"></div>
    </div>
    <WalletParentDialog
      :dialogVisible="showWalletParentDialog"
      @dialog-close="closeCreateWalletParentHistoryMethod()"
      ref="WalletParentDialog"
    />
    <WalletParentHistoryDialog
      :dialogVisible="showWalletParentHistoryDialog"
      @dialog-close="closeViewWalletParentHistoryMethod()"
      ref="WalletParentHistoryDialog"
    />
    <WalletParentHistoryFalseDialog
      :dialogVisible="showHistoryFalse"
      @dialog-close="closeViewHistoryFalseMethod()"
      ref="WalletParentHistoryFalseDialog"
    />
    <WalletParentStatisticalDialog
      :dialogVisible="showWalletParentStatisticalDialog"
      @dialog-close="closeWalletParentStatisticalMethod()"
      ref="WalletParentStatisticalDialog"
    />
    <WalletParentUnconfimDialog
      :dialogVisible="showWalletParentUnconfimDialog"
      @dialog-close="closeWalletParentUnconfimDialogMethod()"
      ref="WalletParentUnconfimDialog"
    />
    <ExcelWalletProvisoDialog
      :dialogVisible="showDialogExcelProviso"
      @dialog-close="dialogCloseExcelProviso()"
      ref="ExcelWalletProvisoDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";

import WalletParentDialog from "./WalletParentDialog.vue";
import WalletParentHistoryDialog from "./WalletParentHistoryDialog.vue";
import WalletParentHistoryFalseDialog from "./WalletParentHistoryFalseDialog.vue";
import WalletParentStatisticalDialog from "./WalletParentStatisticalDialog.vue";
import WalletParentUnconfimDialog from "./WalletParentUnconfimDialog.vue";
import ExcelWalletProvisoDialog from "./ExcelWalletProvisoDialog.vue";
import checkPermission from "@/utils/permission.js";
import {mapActions, mapState} from "vuex";
const valkidStatusList = [
  { key: "STUDYING", value: "Đang học" },
  { key: "STUDY_WAIT", value: "Chờ học" },
  { key: "RESERVE", value: "Bảo lưu" },
  { key: "LEAVE_SCHOOL", value: "Nghỉ học" },
];
export default {
  components: {
    WalletParentDialog,
    WalletParentHistoryDialog,
    WalletParentStatisticalDialog,
    WalletParentHistoryFalseDialog,
    WalletParentUnconfimDialog,
    ExcelWalletProvisoDialog,
  },
  data() {
    return {
      textTable: "",
      loadingData: true,
      multipleSelection: [],
      loaddingButtonTab1: false,
      loaddingButtonTab2: false,
      responseDataList: [],
      responseTab2DataList: "",
      headerTab2List: [],
      responseTab1DataList: "",
      headerTab1List: [],
      responseClassList: [],
      responsePackageKidList: [],
      loaddingButton: false,
      showWalletParentDialog: false,
      showWalletParentHistoryDialog: false,
      showWalletParentStatisticalDialog: false,
      showWalletParentUnconfimDialog: false,
      showHistoryFalse: false,
      showDialogExcelProviso: false,
      gradeOfSchoolList: [],
      classOfGradeList: [],
      kidStatusList: valkidStatusList,
      dataSearch: {
        status: "STUDYING",
        idClass: "",
        fullName: "",
      },

      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  computed:{
    getPermissionComputed() {
      return this.$store.state.auth.user.apiSet;
    },
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeCreateWalletParentHistoryMethod() {
      this.showWalletParentDialog = false;
      this.searchWalletParentByProperties();
    },
    closeViewWalletParentHistoryMethod() {
      this.showWalletParentHistoryDialog = false;
      this.searchWalletParentByProperties();
    },
    closeViewHistoryFalseMethod() {
      this.showHistoryFalse = false;
      this.searchWalletParentByProperties();
    },
    closeWalletParentStatisticalMethod() {
      this.showWalletParentStatisticalDialog = false;
      this.searchWalletParentByProperties();
    },
    closeWalletParentUnconfimDialogMethod() {
      this.showWalletParentUnconfimDialog = false;
      this.searchWalletParentByProperties();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    inOutMoneyMethod(row) {
      this.showWalletParentDialog = true;
      this.$refs.WalletParentDialog.getDataInitial(row);
    },
    viewWalletParentHistoryMethod(row) {
      this.showWalletParentHistoryDialog = true;
      this.$refs.WalletParentHistoryDialog.getDataHistoryInitial(
        row.walletParent.id
      );
    },
    WalletParentStatisticalMethod() {
      this.showWalletParentStatisticalDialog = true;
      this.$refs.WalletParentStatisticalDialog.walletParentStatisticalInitial();
    },
    viewWalletParentUnconfimDialog() {
      this.showWalletParentUnconfimDialog = true;
      this.$refs.WalletParentUnconfimDialog.searchWalletParentByProperties();
    },
    handleHistoryFalse(row) {
      this.showHistoryFalse = true;
      this.$refs.WalletParentHistoryFalseDialog.getDataHistoryInitial(
        row.walletParent.id
      );
    },

    dialogCloseExcelProviso() {
      this.showDialogExcelProviso = false;
      this.searchByProperties();
    },
    handleExcelProviso() {
      this.$refs.ExcelWalletProvisoDialog.getAllGrade();
      this.$refs.ExcelWalletProvisoDialog.getClassInGrade();
      this.showDialogExcelProviso = true;
    },

    checkSelectRowList(rowList) {
      if (rowList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    handleCommandAction(command) {
      if (command == "excelProviso") {
        this.handleExcelProviso();
      } else {
        let wallet = this.multipleSelection;
        this.checkSelectRowList(wallet);
        if (command == "excelWallet") {
          this.exportExcelWallet();
        }
      }
    },
    exportExcelWallet() {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      this.getStyleExcel();
      FnFeesService.exportWalletExcel(selectRowList)
        .then((resp) => {
          import("@/services/ExportExcel")
            .then((excel) => {
              let dataList = resp.data.data;
              let fileName = "DANH_SACH_HOC_SINH_CO_VI";
              const tHeader = [
                "STT",
                "Mã Ví",
                "Họ và tên",
                "Ngày sinh",
                "Tiền nạp",
                "Tiền rút",
                "Số dư ví",
                "Chưa xác nhận",
              ];
              const filterVal = [
                "pro1",
                "pro2",
                "pro3",
                "pro4",
                "pro5",
                "pro6",
                "pro7",
                "pro8",
              ];
              let columnList = [
                { col: 5 },
                { col: 10 },
                { col: 25 },
                { col: 15 },
                { col: 15 },
                { col: 15 },
                { col: 15 },
                { col: 15 },
              ];
              excel.export_json_to_excel({
                header: tHeader,
                data: dataList,
                title: filterVal,
                filename: fileName,
                columnsWidth: columnList,
                styleCols1: this.styleCols1,
                styleCols2: this.styleCols2,
              });
            })
            .finally(() => {
              this.styleCols1 = [];
              this.styleCols2 = [];
            });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    //Css Excel kids group out
    getStyleExcel() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let styleCol1 = {
        name: ["A2", "A3"],
        style: { font: { bold: true } },
      };
      let styleCol2 = {
        name: ["A1"],
        style: { font: { bold: true, color: { rgb: "ff0000" }, sz: 18 } },
      };
      let style1 = {
        name: "A4:H4",
        style: {
          fill: { fgColor: { rgb: "00b0f0" } },
          font,
          alignment,
          border,
        },
      };
      this.styleCols1.push(styleCol1);
      this.styleCols1.push(styleCol2);
      this.styleCols2.push(style1);
    },
    /**
     * hiển thị/bỏ hiển thị một hóa đơn
     */
    viewOrderMethod(row) {
      let dataInput = {
        id: row.orderKids.id,
        status: row.orderKids.view,
      };
      FnFeesService.setViewOrder(dataInput)
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
        });
    },

    /**
     * khóa/bỏ khóa một hóa đơn
     */
    lockedOrderMethod(row) {
      let dataInput = {
        id: row.orderKids.id,
        status: row.orderKids.locked,
      };
      FnFeesService.setLockedOrder(dataInput)
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
        });
    },
    /**
     * duyệt/bỏ khóa 1 khoản
     */
    lockedKidsPackageMethod(row) {
      FnFeesService.lockedKidsPackage(row)
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
        });
    },
    checkButtomBefore() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        throw null;
      }
    },

    /**
     * lưu số lượng sử dụng thực tế
     */
    saveUsedNumberMethod(row) {
      FnFeesService.usedNumberKidsPackage(row)
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
        });
    },
    /**
     * đối khối
     */
    async changeGradeSearch() {
      await this.getClassInGrade();
      this.searchWalletParentByProperties();
    },

    /**
     * tìm tất cả các khối trong một trường
     */
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
          if (this.gradeOfSchoolList.length > 0) {
            this.dataSearch.idGrade = this.gradeOfSchoolList[0].id;
          }

    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassInGrade() {
      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])
      if (this.classOfGradeList.length > 0) {
        this.dataSearch.idClass = this.classOfGradeList[0].id;
      } else {
        this.dataSearch.idClass = "";
      }
    },
    /**
     * tìm kiếm tất cả khoản của các học sinh
     */
    searchWalletParentByProperties() {
      this.textTable = "";
      this.loadingData = true;
      FnFeesService.searchWalletParent(
        this.dataSearch.status,
        this.dataSearch.idClass,
        this.dataSearch.fullName
      )
        .then((resp) => {
          this.responseDataList = resp.data.data;
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
          this.responseDataList = [];
        })
        .finally(() => {
          if (this.responseDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    async fetchDataMany() {
      await Promise.all([this.getAllGrade()]);
      await this.getClassInGrade();

      this.searchWalletParentByProperties();
    },
  },

  beforeMount() {
    this.fetchDataMany();
  },
};
</script>

<style lang="scss" scoped>
.click-in-row {
  border: none;
  padding: 0;
  color: #67c23a;
}
.click-in-row:hover {
  color: #fa03d9;
  // background: none;
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
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
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
//   padding: 12px 0;
// }
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 5px;
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
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
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
</style>
