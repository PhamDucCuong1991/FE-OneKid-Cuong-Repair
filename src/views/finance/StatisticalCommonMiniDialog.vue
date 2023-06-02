<template>
  <div>
    <el-dialog
      title="Số liệu thu học phí"
      :visible.sync="dialogVisible"
      width="900px"
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
          v-if="dataSearch.type == 'month'"
          style="width: 120px; margin-right: 5px"
          v-model="dataSearch.month"
          clearable
          placeholder="Chọn tháng"
          @change="searchHeaderMethod()"
        >
          <el-option
            v-for="item in this.$funcData.getMonthList()"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-date-picker
          v-if="dataSearch.type == 'date'"
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
        <el-date-picker
          style="width: 100px"
          class="input-common"
          :clearable="false"
          v-model="dataSearch.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
        ></el-date-picker>
        <!-- <el-form
          label-width="100px"
          :model="dataSearch"
          label-position="left"
          :rules="rules"
          ref="dataSearch"
        >
          <el-form-item label="Chọn tháng">
            <el-select
              style="width: 120px"
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
            -
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
              v-model="dataSearch.year"
              type="year"
              value-format="yyyy-MM-dd"
              format="yyyy"
            ></el-date-picker
          ></el-form-item>

          <el-form-item label="Chọn kiểu" style="width: 100%">
            <el-radio-group v-model="dataSearch.type">
              <el-radio :label="true">Toàn bộ trường</el-radio>
              <el-radio :label="false">Theo lớp</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="dataSearch.type == false" label="Chọn lớp">
            <el-select
              v-model="dataSearch.idClass"
              filterable
              clearable
              style="width: 50%"
              placeholder="Chọn lớp"
            >
              <el-option
                v-for="item in listClass"
                :key="item.id"
                :label="item.className"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Trạng thái">
            <el-select
              class="button-left-status"
              v-model="dataSearch.status"
              placeholder="Trạng thái"
              style="width: 50%"
              clearable
            >
              <el-option
                v-for="item in this.$funcData.getKidsStatusList()"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form> -->
        <br />
        <br />
        <div style="text-align: center">
          <el-button
            :loading="showSpinner"
            type="success"
            size="medium"
            @click="searchByProperties()"
            >Xem</el-button
          >
        </div>
        <br />
        <br />
        <spinner-custom v-if="showSpinner" />
        <div v-else style="margin: 0 auto">
          <div>
            <el-row :gutter="20">
              <el-col :span="4" style="padding: 10px 10px"><div></div></el-col>
              <el-col :span="6" class="row-header row3-background"
                ><div>Tổng thu</div></el-col
              >
              <el-col :span="6" class="row-header row3-background"
                ><div>Tổng chi</div></el-col
              >
              <el-col :span="6" class="row-header row3-background"
                ><div>Tổng thu - Tổng chi</div></el-col
              >
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6" class="row11 align-row">
                <div>
                  {{ responseData.moneyIn | formatCurrencyNew }}
                </div>
              </el-col>
              <el-col :span="6" class="row11">
                <div>
                  {{ responseData.moneyOut | formatCurrencyNew }}
                </div>
              </el-col>
              <el-col :span="6" class="row11">
                <div>
                  {{ responseData.moneyInOut | formatCurrencyNew }}
                </div>
              </el-col>
            </el-row>
          </div>
          <br />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>

    <ExportExcelKidPackage
      :dialogVisible="showExcelDialog"
      @dialog-close="dialogCloseExcelMethod()"
      ref="ExportExcelKidPackage"
    />

    <ExportExcelKidPackageOut
      :dialogVisible="showExcelOutDialog"
      @dialog-close="dialogCloseExceOutMethod()"
      ref="ExportExcelKidPackageOut"
    />

    <ExportExcelKidPackageInAndOut
      :dialogVisible="showExcelInOutDialog"
      @dialog-close="dialogCloseExceInOutMethod()"
      ref="ExportExcelKidPackageInAndOut"
    />

    <ExportExcelKidPackageOrderKids
      :checkExcel="this.checkExcel"
      :dialogVisible="showExcelOrderDialog"
      @dialog-close="dialogCloseExceOderMethod()"
      ref="ExportExcelKidPackageOrderKids
"
    />
  </div>
</template>

<script>
import CashInternalService from "@/services/CashInternalService";
import ExportExcelKidPackage from "./ExportExcelKidPackage.vue";
import ExportExcelKidPackageOut from "./ExportExcelKidPackageOut.vue";
import ExportExcelKidPackageInAndOut from "./ExportExcelKidPackageInAndOut.vue";
import ExportExcelKidPackageOrderKids from "./ExportExcelKidPackageOrderKids.vue";
import moment from "moment";
import {mapActions, mapState} from "vuex";
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
  props: {
    dialogVisible: null,
  },
  components: {
    ExportExcelKidPackage,
    ExportExcelKidPackageOut,
    ExportExcelKidPackageInAndOut,
    ExportExcelKidPackageOrderKids,
  },
  data() {
    return {
      checkExcel: "",
      textTable: "",
      idKid: "",
      fullName: "",
      showSpinner: false,
      startMonthList: valMonthList,
      endMonthList: valMonthList,
      monthList: valMonthList,
      listClass: [],
      dataSearch: {
        // year: "",
        // startMonth: "",
        // endMonth: "",
        // status: "",
        // idClass: "",
        // type: "",
        year: "",
        type: "",
        month: "",
        dateList: [],
      },
      responseData: {},
      showExcelDialog: false,
      showExcelOutDialog: false,
      showExcelInOutDialog: false,
      showExcelOrderDialog: false,
      loadingButton: false,
    };
  },
  computed: {
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.showSpinner = false;
        this.loadingButton = false;
        this.responseData = "";
      }, 300);
    },
    exportFileMethod(type) {
      if (type == "exIn") {
        this.showExcelDialog = true;
        this.$refs.ExportExcelKidPackage.getDataMonthFirst();
      } else if (type == "exOut") {
        this.showExcelOutDialog = true;
      } else if (type == "exOrder") {
        this.showExcelInOutDialog = true;
      } else if (type == "exInOut") {
        this.checkExcel = "false";
        this.showExcelOrderDialog = true;
      } else if (type == "exInOutTrue") {
        this.checkExcel = "true";
        this.showExcelOrderDialog = true;
      } else if (type == "exInOutTotal") {
        this.checkExcel = "total";
        this.showExcelOrderDialog = true;
      }
    },
    changeMonthMethod() {
      this.startMonthList = this.monthList.filter(
        (x) => x.key <= this.dataSearch.endMonth
      );
      this.endMonthList = this.monthList.filter(
        (x) => x.key >= this.dataSearch.startMonth
      );
    },

    searchByProperties() {
      this.showSpinner = true;
      CashInternalService.searchCashBookHistoryYear(
        moment(this.dataSearch.year).year(),
        this.dataSearch.type,
        this.dataSearch.month,
        this.dataSearch.dateList
      )
        .then((resp) => {
          this.responseData = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseData = "";
        })
        .finally(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 300);
        });
    },
    getClass() {

          this.listClass = mapState(['serverDataClass'])

    },
    getStatisticalCommonInitial() {
      this.dataSearch.year = moment(String(new Date())).format("YYYY-MM-DD");
      // this.dataSearch.startMonth = "01";
      // this.dataSearch.endMonth = "12";
      // this.dataSearch.status = "STUDYING";
      // this.dataSearch.type = true;
      // this.getClass();

      this.dataSearch.type = "month";
      this.dataSearch.month = "";
      this.dataSearch.dateList = [];
      // this.searchByProperties();
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
.input-common {
  margin-right: 5px;
}
.row-header {
  padding: 10px 0;
  margin-right: 1px;
  text-align: center;
  font-weight: bold;
  color: white;
  font-size: 16px;
}

.row11 {
  background: #cad8c4;
  padding: 10px 0;
  margin-right: 1px;
  text-align: center;
  font-weight: bold;
}
.row1-background {
  background: #67c23a;
}
.row2-background {
  background: #e6a23c;
}
.row3-background {
  background: #409eff;
}
.row4-background {
  background: #23b962;
}
.align-row {
  margin-left: 147px;
}
</style>
