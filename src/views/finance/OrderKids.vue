<template>
  <div>
    <div>
      <div style="margin-top: 5px">
        <div style="
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
            display: inline-block;
          ">
          <el-date-picker style="width: 115px" class="input-common" :clearable="false"
            @change="searchOrderKidsByProperties()" v-model="dataSearch.date" type="month" value-format="yyyy-MM-dd"
            format="MM-yyyy">
          </el-date-picker>
          <!-- chọn trạng thái -->
          <el-select style="width: 110px" class="input-common" v-model="dataSearch.status"
            @change="searchOrderKidsByProperties()" placeholder="Trạng thái">
            <el-option v-for="item in kidStatusList" :key="item.key" :value="item.key" :label="item.value"></el-option>
          </el-select>

          <!-- chọn khối -->
          <el-select class="input-common input-grade" style="width: 90px" v-model="dataSearch.idGrade"
            @change="changeGradeSearch()" placeholder="Chọn khối">
            <el-option v-for="item in gradeOfSchoolList" :key="item.id" :value="item.id"
              :label="item.gradeName"></el-option>
          </el-select>

          <!-- chọn lớp -->
          <el-select class="input-common input-class" style="width: 120px" v-model="dataSearch.idClass"
            placeholder="Chọn lớp" @change="searchOrderKidsByProperties()">
            <el-option v-for="item in classOfGradeList" :key="item.id" :value="item.id"
              :label="item.className"></el-option>
          </el-select>
          <!-- trạng thái -->
          <el-select class="input-common input-class" style="width: 145px" clearable v-model="dataSearch.statusOrder"
            placeholder="Chọn trạng thái" @change="filterChangeStatusMethod()">
            <el-option value="orderYet" label="Chưa có hóa đơn"></el-option>
            <el-option value="orderNo" label="Chưa có khoản"></el-option>
            <el-option value="completeNo" label="Chưa hoàn thành"></el-option>
            <el-option value="completeYes" label="Đã hoàn thành"></el-option>
            <el-option value="payPart" label="Đóng còn thiếu"></el-option>
            <el-option value="payFull" label="Đóng thiếu 100%"></el-option>
            <el-option value="orderInComplete" label="Còn tồn hóa đơn"></el-option>
          </el-select>
          <el-input class="input-common input-class" style="width: 220px" placeholder="Nhập tên học sinh" clearable
            v-model="dataSearch.fullName" @clear="searchOrderKidsByProperties()"
            @keyup.enter.native="searchOrderKidsByProperties()">
            <el-button slot="append" icon="el-icon-search" @click="searchOrderKidsByProperties()"></el-button>
          </el-input>
          <el-checkbox @change="searchOrderKidsByProperties()" v-model="dataSearch.walletStatus">Còn dư ví</el-checkbox>
        </div>
        <div style="float: right">
          <el-dropdown @command="handleStatisticalCommandMethod" v-if="checkPermission(['fees_order_statistical'])">
            <el-button type="success" class="button-bottom" icon="el-icon-s-data">
              Thống kê
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="statisticalMiniCommand">Số liệu học phí</el-dropdown-item>
              <el-dropdown-item command="statisticalAllCommand">Tổng hợp số liệu</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button v-if="checkPermission(['fees_order_statistical'])" style="border-radius: 0" type="success"
            @click="statisticalMethod()" icon="el-icon-s-data">
            Thống kê
          </el-button> -->
          <el-button style="border-radius: 0; margin-left: 5px" type="success" @click="kidsDialogMethod()"
            icon="el-icon-search">
            Tìm kiếm
          </el-button>
        </div>
      </div>
      <div class="table-content row-data">
        <!-- chi tiết khoản các học sinh -->
        <el-table ref="kidsPackageForKidsRef" :data="responseFilterList" :empty-text="textTable" v-loading="loadingData"
          :element-loading-text="$tableLoadding" element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255, 0)" :cell-style="tableRowStyle"
          :header-cell-style="tableHeaderColor" @selection-change="handleSelectionChange" :max-height="$tableMaxHeight"
          border>
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column type="index" fixed label="STT" width="50" align="center"></el-table-column>
          <el-table-column min-width="150" fixed label="Họ tên">
            <template slot-scope="scope">
              <el-button class="click-in-row" type="text" @click="detialApprovedKidsMethod(scope.row)">
                {{ scope.row.fullName }}</el-button>
            </template>
          </el-table-column>

          <el-table-column label="Ngày sinh" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.birthDay | formatDate }}</span>
            </template></el-table-column>
          <el-table-column width="125" align="center" label="Mã hóa đơn">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span>{{ scope.row.orderKids.code }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="70" label="Hiển thị">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <el-checkbox v-model="scope.row.orderKids.view" @change="viewOrderMethod(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" width="70" label="Khóa">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <el-checkbox :disabled="!checkPermission(['fees_order_locked'])" v-model="scope.row.orderKids.locked"
                @change="lockedOrderMethod(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="Tồn hóa đơn cũ">
            <template slot-scope="scope" v-if="scope.row.inCompleteOrderNumber > 0">
              <!-- <span>{{scope.row.inCompleteOrderNumber}}</span> -->
              <el-button type="text" size="mini" @click="orderKidsMonthNoMethod(scope.row)">{{scope.row.inCompleteOrderNumber}}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" width="125" label="Trạng thái">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span v-if="scope.row.orderKids.totalNumber == 0">Chưa có khoản</span>
              <span v-else-if="
                scope.row.orderKids.totalNumber != scope.row.orderKids.enoughNumber
              ">Chưa hoàn thành</span>
              <span v-else>Đã hoàn thành</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="150" label="Đủ-Thiếu-Chưa đóng">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span style="color: #606266">{{ scope.row.orderKids.enoughNumber }}</span>
              -
              <span style="color: orange">{{ scope.row.orderKids.partNumber }}</span>
              -
              <span style="color: red">{{ scope.row.orderKids.emptyNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" label="Còn lại thu">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span class="high-light">{{
                  scope.row.orderKids.totalMoneyRemainIn | formatCurrencyNew
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" label="Còn lại chi">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span class="high-light">{{
                  scope.row.orderKids.totalMoneyRemainOut | formatCurrencyNew
              }}</span>
            </template></el-table-column>
          <el-table-column align="right" width="120" label="T.Thu - T.Chi">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span>{{
                  (scope.row.orderKids.moneyTotalIn - scope.row.orderKids.moneyTotalOut)
                  | formatCurrencyNew
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" label="Tổng thu">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span>{{ scope.row.orderKids.moneyTotalIn | formatCurrencyNew }}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" label="Đã thu">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span>{{ scope.row.orderKids.moneyPaidIn | formatCurrencyNew }}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" label="Thu thiếu">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span>{{
                  (scope.row.orderKids.moneyTotalIn - scope.row.orderKids.moneyPaidIn)
                  | formatCurrencyNew
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" label="Tổng chi">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span>{{ scope.row.orderKids.moneyTotalOut | formatCurrencyNew }}</span>
            </template></el-table-column>
          <el-table-column align="right" width="120" label="Đã chi">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span>{{ scope.row.orderKids.moneyPaidOut | formatCurrencyNew }}</span>
            </template></el-table-column>
          <el-table-column align="right" width="120" label="Chi thiếu">
            <template slot-scope="scope" v-if="scope.row.orderKids != null">
              <span>{{
                  (scope.row.orderKids.moneyTotalOut - scope.row.orderKids.moneyPaidOut)
                  | formatCurrencyNew
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Tác vụ" fixed="right" :width="checkPermission(['fees_order_payment']) ? 330 : 230"
            align="center">
            <template slot-scope="scope">
              <el-button v-if="checkPermission(['fees_order_payment'])" :disabled="
                scope.row.orderKids == null ||
                scope.row.orderKids.totalNumber == 0 ||
                scope.row.orderKids.locked
              " size="mini" type="primary" @click="orderKidsCasherMethod(scope.row)">Thanh toán</el-button>
              <el-button :disabled="
                scope.row.orderKids == null || scope.row.orderKids.totalNumber == 0
              " type="success" size="mini" @click="orderKidsDetailMethod(scope.row)">
                Chi tiết</el-button>
              <el-button :disabled="
                scope.row.orderKids == null || scope.row.orderKids.totalNumber == 0
              " size="mini" type="warning" @click="orderKidsHistoryMethod(scope.row)">
                Lịch sử</el-button>
              <el-button :disabled="
                scope.row.orderKids == null || scope.row.orderKids.totalNumber == 0
              " type="success" size="mini" @click="orderKidsMonthMethod(scope.row)"><i
                  class="el-icon-circle-plus"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="float: right; margin: 15px 0">
          <el-button :loading="loaddingButtonGenerate" type="success" class="button-bottom"
            @click="gengerateOrderMethod()">
            Khởi tạo hóa đơn
          </el-button>

          <el-dropdown @command="handlePrintCommandMethod">
            <el-button :loading="loaddingButtonPrint" type="success" class="button-bottom">
              In hóa đơn
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="allPrintCommand">Tổng hợp</el-dropdown-item>
              <el-dropdown-item command="inPrintCommand">Thu</el-dropdown-item>
              <el-dropdown-item command="outPrintCommand">Chi</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown @command="handleCommandMethod">
            <el-button type="success" class="button-bottom" :loading="loaddingButtonAction">
              Tác vụ
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="viewCommand">Hiển thị</el-dropdown-item>
              <el-dropdown-item command="unViewCommand">Bỏ hiển thị</el-dropdown-item>
              <el-dropdown-item v-if="checkPermission(['fees_order_locked'])"
                command="lockedCommand">Khóa</el-dropdown-item>
              <el-dropdown-item v-if="checkPermission(['fees_order_locked'])" command="unLockedCommand">Bỏ
                khóa</el-dropdown-item>
              <el-dropdown-item command="viewDetailAll">Xem tổng hợp</el-dropdown-item>
              <el-dropdown-item command="exportExcelNowCommand">Xuất Excel hiện tại</el-dropdown-item>
              <el-dropdown-item command="exportExcelCommand">Xuất Excel học phí</el-dropdown-item>
              <el-dropdown-item command="sendNotifyFees">Báo học phí qua SMS</el-dropdown-item>
              <el-dropdown-item command="sendNotifyFeesApp">Báo học phí qua App</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- <el-button @click="reloadPage()">OK</el-button> -->
    </div>
    <OrderKidsCasher :dialogVisible="showOrderKidsCasherDialog" @dialog-close="closeOrderKidsCasherDialog()"
      ref="OrderKidsCasher" />
    <OrderKidsHistoryDialog :dialogVisible="showOrderKidsHistoryDialog" @dialog-close="closeOrderKidsHistoryDialog()"
      ref="OrderKidsHistoryDialog" />
    <OrderKidsMonthDialog :dialogVisible="showOrderKidsMonthDialog" @dialog-close="closeOrderKidsMonthDialog()"
      ref="OrderKidsMonthDialog" />
    <OrderKidsDetailDialog :dialogVisible="showOrderKidsDetailDialog" @dialog-close="closeOrderKidsDetailDialog()"
      ref="OrderKidsDetailDialog" />
    <KidsInfoData :dialogVisible="showKidsDialog" @dialog-close="closeKidsDialog()" />
    <StatisticalCommonDialog :dialogVisible="showStatisticalCommonDialog" @dialog-close="closeStatisticalCommonDialog()"
      ref="StatisticalCommonDialog" />
    <StatisticalCommonMiniDialog :dialogVisible="showStatisticalCommonMiniDialog" @dialog-close="closeStatisticalCommonMiniDialog()"
      ref="StatisticalCommonMiniDialog" />
    <ViewAllDataClassDialog :dataList="responseFilterList" :classNameData="classNameData"
      :dialogVisible="showDialogViewAll" @dialog-close="closeViewAllDialog()" ref="ViewAllDataClassDialog" />
    <OrderPrintManyKidDialog :dialogVisible="showPrintOrderDialog" @dialog-close="closePrintOrderDialog()"
      ref="OrderPrintManyKidDialog" />
    <PackageKidsApprovedKidDialog :dialogVisible="showDetialApprovedDialog" @dialog-close="closeDetialApprovedDialog()"
      ref="PackageKidsApprovedKidDialog" />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import checkPermission from "@/utils/permission.js";

import moment from "moment";
import OrderKidsCasher from "./OrderKidsCasher.vue";
import OrderKidsHistoryDialog from "./OrderKidsHistoryDialog.vue";
import OrderKidsMonthDialog from "./OrderKidsMonthDialog.vue";
import OrderKidsDetailDialog from "./OrderKidsDetailDialog.vue";
import ViewAllDataClassDialog from "./ViewAllDataClassDialog.vue";
import KidsInfoData from "./KidsInfoData.vue";
import StatisticalCommonDialog from "./StatisticalCommonDialog.vue";
import StatisticalCommonMiniDialog from "./StatisticalCommonMiniDialog.vue";
import OrderPrintManyKidDialog from "./OrderPrintManyKidDialog.vue";
import PackageKidsApprovedKidDialog from "./PackageKidsApprovedKidDialog.vue";
import {mapActions, mapState} from "vuex";
const valkidStatusList = [
  { key: "STUDYING", value: "Đang học" },
  { key: "STUDY_WAIT", value: "Chờ học" },
  { key: "RESERVE", value: "Bảo lưu" },
  { key: "LEAVE_SCHOOL", value: "Nghỉ học" },
];
export default {
  components: {
    OrderKidsCasher,
    OrderKidsHistoryDialog,
    OrderKidsMonthDialog,
    OrderKidsDetailDialog,
    KidsInfoData,
    StatisticalCommonDialog,
    StatisticalCommonMiniDialog,
    ViewAllDataClassDialog,
    OrderPrintManyKidDialog,
    PackageKidsApprovedKidDialog,
  },
  data() {
    return {
      textTable: "",
      loadingData: true,
      multipleSelection: [],
      loaddingButtonTab1: false,
      loaddingButtonTab2: false,
      loaddingButtonNofify: false,
      loaddingButtonGenerate: false,
      loaddingButtonPrint: false,
      showPrintOrderDialog: false,
      showDetialApprovedDialog: false,
      loaddingButtonAction: false,
      responseDataList: [],
      responseFilterList: [],
      responseTab2DataList: "",
      headerTab2List: [],
      responseTab1DataList: "",
      headerTab1List: [],
      responseClassList: [],
      responsePackageKidList: [],
      loaddingButton: false,
      showOrderKidsCasherDialog: false,
      showOrderKidsHistoryDialog: false,
      showOrderKidsMonthDialog: false,
      showOrderKidsDetailDialog: false,
      showDialogViewAll: false,
      showKidsDialog: false,
      showStatisticalCommonDialog: false,
      showStatisticalCommonMiniDialog: false,
      gradeOfSchoolList: [],
      classOfGradeList: [],
      kidStatusList: valkidStatusList,
      pastDate: moment(new Date()).add(-2, "M").format("YYYY-MM-DD"),
      futureDate: moment(new Date()).add(1, "M").format("YYYY-MM-DD"),
      category: "",
      dataSearch: {
        date: "",
        status: "STUDYING",
        idClass: "",
        fullName: "",
        walletStatus: false,
        statusOrder: "",
      },
      classNameData: "",
      styleCols1: [],
      styleCols2: [],
    };
  },
  computed:{
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    checkPermission,
    // reloadPage() {
    //   this.$router.go();
    // },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.orderKids == null) {
        return "color: #409EFF";
      } else if (row.orderKids.totalNumber == 0) {
        return "color: #FB9A00";
      } else if (row.orderKids.totalNumber != row.orderKids.enoughNumber) {
        return "color: #FD4803";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    closeOrderKidsCasherDialog() {
      this.showOrderKidsCasherDialog = false;
      this.searchOrderKidsByProperties();
    },
    closeOrderKidsHistoryDialog() {
      this.showOrderKidsHistoryDialog = false;
      this.searchOrderKidsByProperties();
    },
    closeOrderKidsMonthDialog() {
      this.showOrderKidsMonthDialog = false;
      this.searchOrderKidsByProperties();
    },
    closeDetialApprovedDialog() {
      this.showDetialApprovedDialog = false;
      this.searchOrderKidsByProperties();
    },
    closeOrderKidsDetailDialog() {
      this.showOrderKidsDetailDialog = false;
      this.searchOrderKidsByProperties();
    },
    closeKidsDialog() {
      this.showKidsDialog = false;
    },
    closeStatisticalCommonDialog() {
      this.showStatisticalCommonDialog = false;
    },
    closeStatisticalCommonMiniDialog() {
      this.showStatisticalCommonMiniDialog = false;
    },
    closePrintOrderDialog() {
      this.showPrintOrderDialog = false;
      this.loaddingButtonPrint = false;
      this.$refs.kidsPackageForKidsRef.clearSelection();
      // location.reload();
    },
    closeViewAllDialog() {
      this.showDialogViewAll = false;
    },
    handleCommandMethod(command) {
      if (command == "viewCommand") {
        this.setViewOrderManyMethod("hiển thị", true);
      } else if (command == "unViewCommand") {
        this.setViewOrderManyMethod("bỏ hiển thị", false);
      } else if (command == "lockedCommand") {
        this.setLockedOrderManyMethod("khóa", true);
      } else if (command == "unLockedCommand") {
        this.setLockedOrderManyMethod("bỏ khóa", false);
      } else if (command == "viewDetailAll") {
        this.showDetailDataClass();
      } else if (command == "sendNotifyFees") {
        this.notifyOrderMethod();
      } else if (command == "sendNotifyFeesApp") {
        this.sendViewOrderManyNoSMSMethod();
      } else if (command == "exportExcelCommand") {
        this.exportExcelOrderMethod();
      } else if (command == "exportExcelNowCommand") {
        this.exportExcelOrderNowMethod();
      }
    },
    handlePrintCommandMethod(command) {
      if (command == "allPrintCommand") {
        this.category = "both";
      } else if (command == "inPrintCommand") {
        this.category = "in";
      } else if (command == "outPrintCommand") {
        this.category = "out";
      }
      this.printOrderManyKidMethod();
    },
    handleStatisticalCommandMethod(command) {
      if (command == "statisticalMiniCommand") {
        this.statisticalMiniMethod()
      } else if (command == "statisticalAllCommand") {
        this.statisticalMethod()
      }
    },
    orderKidsCasherMethod(row) {
      let idKid = row.id;
      let kidName = row.fullName;
      let idOrder = row.orderKids.id;
      let orderCode = row.orderKids.code;
      let month = row.orderKids.month;
      let year = row.orderKids.year;
      this.showOrderKidsCasherDialog = true;
      this.$refs.OrderKidsCasher.getDataCasherInitial(
        idKid,
        idOrder,
        orderCode,
        month,
        year,
        kidName
      );
    },
    orderKidsHistoryMethod(row) {
      this.showOrderKidsHistoryDialog = true;
      this.$refs.OrderKidsHistoryDialog.getOrderHistoryInitial(row);
    },
    orderKidsMonthMethod(row) {
      this.showOrderKidsMonthDialog = true;
      this.$refs.OrderKidsMonthDialog.getOrderKidsDetailInitial(row);
    },
    orderKidsMonthNoMethod(row) {
      this.showOrderKidsMonthDialog = true;
      this.$refs.OrderKidsMonthDialog.getOrderKidsDetailInitialNo(row);
    },
    orderKidsDetailMethod(row) {
      this.showOrderKidsDetailDialog = true;
      this.$refs.OrderKidsDetailDialog.getOrderKidsDetailInitial(row.orderKids.id);
    },
    detialApprovedKidsMethod(row) {
      this.showDetialApprovedDialog = true;
      this.$refs.PackageKidsApprovedKidDialog.getApprovedDetailInitial(
        row.id,
        this.dataSearch.date,
        row.fullName
      );
    },
    kidsDialogMethod() {
      this.showKidsDialog = true;
    },
    statisticalMethod() {
      this.showStatisticalCommonDialog = true;
      this.$refs.StatisticalCommonDialog.getStatisticalCommonInitial();
    },
    statisticalMiniMethod() {
      this.showStatisticalCommonMiniDialog = true;
      this.$refs.StatisticalCommonMiniDialog.getStatisticalCommonInitial();
    },
    exportExcelOrderMethod() {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      this.checkButtomBefore(selectRowList, "");
      this.loaddingButtonAction = true;
      FnFeesService.exportExcelOrderService(
        this.dataSearch.idClass,
        this.dataSearch.date,
        selectRowList
      )
        .then((resp) => {
          import("@/services/ExportExcel").then((excel) => {
            let dataResponse = resp.data.data;
            let dataList = dataResponse.dataList;
            let fileName = dataResponse.fileName;
            const tHeader = dataResponse.titleHeaderList;
            const filterVal = dataResponse.proList;
            let columnList = [];
            dataResponse.sizeColumnList.forEach((x) => {
              let objectInput = {
                col: x,
              };
              columnList.push(objectInput);
            });
            let charList = this.$funcData.getRoleListExcel();
            let style = {
              font: { bold: true },
              fill: { fgColor: { rgb: "67C23A" } },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              },
            };
            let styleColData1 = [];
            let i = 0;
            tHeader.forEach((x) => {
              console.log(x);
              styleColData1.push(charList[i] + "5");
              i++;
            });
            let styleCol1 = {
              name: styleColData1,
              style,
            };
            let styleCol2 = {
              name: ["A1", "A2", "A3", "A4"],
              style: { font: { bold: true, color: { rgb: "black" } } },
            };
            this.styleCols1.push(styleCol1);
            this.styleCols1.push(styleCol2);
            excel
              .export_json_to_excel({
                header: tHeader,
                data: dataList,
                title: filterVal,
                filename: fileName,
                columnsWidth: columnList,
                styleCols1: this.styleCols1,
                styleCols2: this.styleCols2,
              })
              .finally(() => {
                this.styleCols1 = [];
                this.styleCols2 = [];
              });
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
            this.loaddingButtonAction = false;
          }, 1000);
        });
    },
    exportExcelOrderNowMethod() {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      this.checkButtomBefore(selectRowList, "");
      this.loaddingButtonAction = true;
      FnFeesService.exportExcelOrderNowService(
        this.dataSearch.idClass,
        this.dataSearch.date,
        selectRowList
      )
        .then((resp) => {
          import("@/services/ExportExcel").then((excel) => {
            let dataResponse = resp.data.data;
            let dataList = dataResponse.dataList;
            let fileName = dataResponse.fileName;
            const tHeader = dataResponse.titleHeaderList;
            const filterVal = dataResponse.proList;
            let columnList = [];
            dataResponse.sizeColumnList.forEach((x) => {
              let objectInput = {
                col: x,
              };
              columnList.push(objectInput);
            });
            let charList = this.$funcData.getRoleListExcel();
            let style = {
              font: { bold: true },
              fill: { fgColor: { rgb: "67C23A" } },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              },
            };
            let styleColData1 = [];
            let i = 0;
            tHeader.forEach((x) => {
              console.log(x);
              styleColData1.push(charList[i] + "5");
              i++;
            });
            let styleCol1 = {
              name: styleColData1,
              style,
            };
            let styleCol2 = {
              name: ["A1", "A2", "A3", "A4"],
              style: { font: { bold: true, color: { rgb: "black" } } },
            };
            this.styleCols1.push(styleCol1);
            this.styleCols1.push(styleCol2);
            excel
              .export_json_to_excel({
                header: tHeader,
                data: dataList,
                title: filterVal,
                filename: fileName,
                columnsWidth: columnList,
                styleCols1: this.styleCols1,
                styleCols2: this.styleCols2,
              })
              .finally(() => {
                this.styleCols1 = [];
                this.styleCols2 = [];
              });
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
            this.loaddingButtonAction = false;
          }, 1000);
        });
    },
    printOrderManyKidMethod() {
      let selectRowList = this.multipleSelection.filter((x) => x.orderKids != null);
      this.checkButtomBefore(selectRowList, "có hóa đơn");
      this.loaddingButtonPrint = true;
      this.showPrintOrderDialog = true;
      let dataInputList = [];
      selectRowList.forEach((x) => {
        let dataInput = {
          idKid: x.id,
          idOrder: x.orderKids.id,
          category: this.category,
        };
        dataInputList.push(dataInput);
      });
      this.$refs.OrderPrintManyKidDialog.getDataInitialManyPrint(dataInputList);
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
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
          setTimeout(() => {
            row.orderKids.locked = !row.orderKids.locked;
          }, 200);
        });
    },
    /**
     * duyệt/hủy duyệt các khoản của các học sinh
     */
    setViewOrderManyMethod(text, status) {
      let selectRowList = this.multipleSelection.filter(
        (x) => x.orderKids != null && x.orderKids.view != status
      );
      let textAlert = status ? "chưa hiển thị" : "đã hiển thị";
      this.checkButtomBefore(selectRowList, "ở trạng thái " + textAlert);
      this.$confirm(
        "Bạn có chắc chắn muốn " +
        text +
        " cho " +
        selectRowList.length +
        " học sinh không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingData = true;
        let dataInput = {
          status: status,
          idList: selectRowList.map((x) => x.orderKids.id),
        };
        FnFeesService.setViewOrderMany(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchOrderKidsByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            this.loadingData = false;
          });
      });
    },
    /**
     * khóa/bỏ khóa các hóa đơn của các học sinh
     */
    setLockedOrderManyMethod(text, status) {
      let selectRowList = this.multipleSelection.filter(
        (x) => x.orderKids != null && x.orderKids.locked != status
      );
      let textAlert = status ? "chưa khóa" : "đã khóa";
      this.checkButtomBefore(selectRowList, "ở trạng thái " + textAlert);
      this.$confirm(
        "Bạn có chắc chắn muốn " +
        text +
        " cho " +
        selectRowList.length +
        " học sinh không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingData = true;
        let dataInput = {
          status: status,
          idList: selectRowList.map((x) => x.orderKids.id),
        };
        FnFeesService.setLockedOrderMany(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchOrderKidsByProperties();
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
            this.loadingData = false;
          });
      });
    },
    sendViewOrderManyNoSMSMethod() {
      let selectRowList = this.multipleSelection.filter(
        (x) => x.orderKids != null && x.orderKids.view
      );
      this.checkButtomBefore(selectRowList, "ở trạng thái chưa hiển thị");
      this.$confirm(
        "Bạn có chắc chắn muốn gửi thông báo cho " +
        selectRowList.length +
        " học sinh không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingData = true;
        let dataInput = {
          status: true,
          idList: selectRowList.map((x) => x.orderKids.id),
        };
        FnFeesService.setViewOrderManyNoSMS(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchOrderKidsByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            this.loadingData = false;
          });
      });
    },
    /**
     * lọc trạng thái hóa đơn ở frontend
     */
    filterChangeStatusMethod() {
      let dataLocalList = this.responseDataList;
      let orderStatusLocal = this.dataSearch.statusOrder;
      if (orderStatusLocal != "") {
        if (orderStatusLocal == "orderYet") {
          this.responseFilterList = dataLocalList.filter((x) => x.orderKids == null);
        } else if (orderStatusLocal == "orderNo") {
          this.responseFilterList = dataLocalList.filter(
            (x) => x.orderKids != null && x.orderKids.totalNumber == 0
          );
        } else if (orderStatusLocal == "completeNo") {
          this.responseFilterList = dataLocalList.filter(
            (x) =>
              x.orderKids != null &&
              x.orderKids.totalNumber > 0 &&
              x.orderKids.totalNumber != x.orderKids.enoughNumber
          );
        } else if (orderStatusLocal == "completeYes") {
          this.responseFilterList = dataLocalList.filter(
            (x) =>
              x.orderKids != null &&
              x.orderKids.totalNumber > 0 &&
              x.orderKids.totalNumber == x.orderKids.enoughNumber
          );
        } else if (orderStatusLocal == "payPart") {
          this.responseFilterList = dataLocalList.filter(
            (x) =>
              x.orderKids != null &&
              x.orderKids.totalNumber > 0 &&
              (x.orderKids.moneyPaidIn>0||x.orderKids.moneyPaidOut >0)&&
              ((x.orderKids.moneyTotalIn - x.orderKids.moneyPaidIn)>0||(x.orderKids.moneyTotalOut - x.orderKids.moneyPaidOut)>0)
          );
        } else if (orderStatusLocal == "payFull") {
          this.responseFilterList = dataLocalList.filter(
            (x) =>
              x.orderKids != null &&
              x.orderKids.totalNumber > 0 &&
              (x.orderKids.moneyPaidIn==0&&x.orderKids.moneyPaidOut ==0)
          );
        } else if (orderStatusLocal == "orderInComplete") {
          this.responseFilterList = dataLocalList.filter(
            (x) =>
              x.inCompleteOrderNumber>0
          );
        }
        if (this.responseFilterList.length == 0) {
          this.textTable = this.$tableEmpty;
        }
      } else {
        this.responseFilterList = dataLocalList;
      }
    },
    /**
     * Xem tổng hợp
     */
    showDetailDataClass() {
      this.showDialogViewAll = true;
    },
    getCurrentDate() {
      let date = moment(String(new Date())).format("YYYY-MM-DD");
      this.dataSearch.date = date;
    },
    checkButtomBefore(selectList, text) {
      if (selectList.length == 0) {
        this.$message({
          message: "Không có học sinh nào " + text + " được chọn",
          type: "error",
        });
        throw null;
      }
    },
    gengerateOrderMethod() {
      let selectRowList = this.multipleSelection.filter((x) => x.orderKids == null);
      this.checkButtomBefore(selectRowList, "chưa có hóa đơn");
      this.$confirm(
        "Bạn có chắc chắn muốn khởi tạo hóa đơn cho " +
        selectRowList.length +
        " học sinh không?",
        "Khởi tạo hóa đơn tháng " + moment(this.dataSearch.date).format("MM/yyyy") + "!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loadingData = true;
        this.loaddingButtonGenerate = true;
        let dataInput = {
          date: this.dataSearch.date,
          idKidList: selectRowList,
        };
        FnFeesService.generateOrderKids(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchOrderKidsByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            this.loadingData = false;
            this.loaddingButtonGenerate = false;
          });
      });
    },
    /**
     * thông báo học phí
     */
    notifyOrderMethod() {
      let selectRowList = this.multipleSelection.filter((x) => x.orderKids != null);
      this.checkButtomBefore(selectRowList, "có hóa đơn");
      this.$confirm(
        "Bạn có chắc chắn muốn gửi thông báo học phí cho " +
        selectRowList.length +
        " học sinh không?",
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
          idKidList: selectRowList,
        };
        FnFeesService.sendNotifyFees(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchOrderKidsByProperties();
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
    /**
     * đối khối
     */
    async changeGradeSearch() {
      await this.getClassInGrade();
      this.searchOrderKidsByProperties();
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
    searchOrderKidsByProperties() {
      this.textTable = "";
      this.loadingData = true;
      FnFeesService.searchOrderKids(
        this.dataSearch.date,
        this.dataSearch.status,
        this.dataSearch.idClass,
        this.dataSearch.fullName,
        this.dataSearch.walletStatus
      )
        .then((resp) => {
          this.responseDataList = resp.data.data;
          this.responseFilterList = this.responseDataList;
          this.classNameData = this.classOfGradeList.filter(
            (x) => x.id == this.dataSearch.idClass
          )[0].className;
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
          this.responseFilterList = [];
        })
        .finally(() => {
          if (this.responseFilterList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
          this.filterChangeStatusMethod();
        });
    },

    async fetchDataMany() {
      this.getCurrentDate();
      await Promise.all([this.getAllGrade()]);
      await this.getClassInGrade();
      this.searchOrderKidsByProperties();
    },
  },

  beforeMount() {
    this.fetchDataMany();
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

/deep/.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}

/deep/.el-tabs--card>.el-tabs__header {
  border-bottom: none;
}

// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 14px;
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
/deep/.el-icon-arrow-right:before {
  content: "";
}

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

  // display: inline-block;
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

.high-light {
  color: blue;
  font-weight: bold;
}

.click-in-row {
  border: none;
  padding: 0;
  color: #3a3ace;
}

.click-in-row:hover {
  color: #fa03d9;
}
</style>
