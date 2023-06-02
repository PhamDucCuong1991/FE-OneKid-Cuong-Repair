<template>
  <div>
    <el-dialog
      title="Thống kê công lương nhân sự"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <spinner-custom v-if="showSpinner" />
      <div v-else style="margin-bottom: 15px; position: relative; z-index: 1">
        Chọn thời gian
        <el-select
          style="width: 120px; margin-left: 50px; margin-right: 5px"
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
          @change="searchByProperties()"
          v-model="dataSearch.year"
          type="year"
          value-format="yyyy-MM-dd"
          format="yyyy"
        ></el-date-picker>
        <br />
        <br />
        <div style="margin: 0 auto">
          <div>
            <el-row :gutter="20">
              <el-col :span="4" style="padding: 10px 10px"
                ><div>Khoản chi</div></el-col
              >
              <el-col :span="6" class="row-header row2-background"
                ><div>Tổng phải chi</div></el-col
              >
              <el-col :span="6" class="row-header row2-background"
                ><div>Tổng đã chi</div></el-col
              >
              <el-col :span="6" class="row-header row2-background"
                ><div>Còn lại phải chi</div></el-col
              >
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6" class="row11 align-row">
                <div>{{ responseData.moneyTotalOut | formatCurrencyNew }}</div>
              </el-col>
              <el-col :span="6" class="row11">
                <div>
                  {{ responseData.moneyTotalPaidOut | formatCurrencyNew }}
                </div>
              </el-col>
              <el-col :span="6" class="row11">
                <div>
                  {{ responseData.moneyTotalRemainOut | formatCurrencyNew }}
                </div>
              </el-col>
            </el-row>
          </div>
          <br />
          <div>
            <el-row :gutter="20">
              <el-col :span="4" style="padding: 10px 10px"
                ><div>Khoản thu</div></el-col
              >
              <el-col :span="6" class="row-header row1-background"
                ><div>Tổng phải thu</div></el-col
              >
              <el-col :span="6" class="row-header row1-background"
                ><div>Tổng đã thu</div></el-col
              >
              <el-col :span="6" class="row-header row1-background"
                ><div>Còn lại phải thu</div></el-col
              >
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6" class="row11 align-row">
                <div>
                  {{ responseData.moneyTotalIn | formatCurrencyNew }}
                </div>
              </el-col>
              <el-col :span="6" class="row11">
                <div>
                  {{ responseData.moneyTotalPaidIn | formatCurrencyNew }}
                </div>
              </el-col>
              <el-col :span="6" class="row11">
                <div>
                  {{ responseData.moneyTotalRemainIn | formatCurrencyNew }}
                </div>
              </el-col>
            </el-row>
          </div>
          <br />
          <div>
            <el-row :gutter="20">
              <el-col :span="4" style="padding: 10px 10px"
                ><div>Tổng hợp</div></el-col
              >
              <el-col :span="6" class="row-header row3-background"
                ><div>Tổng chi - Tổng thu</div></el-col
              >
              <el-col :span="6" class="row-header row3-background"
                ><div>Đã chi - Đã thu</div></el-col
              >
              <el-col :span="6" class="row-header row3-background"
                ><div>Còn lại phải chi</div></el-col
              >
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6" class="row11 align-row">
                <div>
                  {{ responseData.moneyTotalInOut | formatCurrencyNew }}
                </div>
              </el-col>
              <el-col :span="6" class="row11">
                <div>
                  {{ responseData.moneyTotalInOutPaid | formatCurrencyNew }}
                </div>
              </el-col>
              <el-col :span="6" class="row11">
                <div>
                  {{ responseData.moneyTotalInOutRemain | formatCurrencyNew }}
                </div>
              </el-col>
            </el-row>
          </div>
          <br />
          <div>
            <el-row :gutter="20">
              <el-col :span="4" style="padding: 10px 10px"
                ><div>Thống kê</div></el-col
              >
              <el-col
                :span="9"
                style="font-weight: normal"
                class="row-header row4-background"
                ><div>
                  Số nhân sự chưa hoàn thành hóa đơn:
                  {{ responseData.kidsNumber }}
                </div></el-col
              >
              <el-col
                :span="9"
                style="font-weight: normal"
                class="row-header row4-background"
                ><div>
                  Số hóa đơn chưa hoàn thành: {{ responseData.orderNumber }}
                </div></el-col
              >
            </el-row>
          </div>
          <br />
          <div>
            <el-row :gutter="20">
              <el-col :span="4" style="padding: 10px 10px">Xuất dữ liệu</el-col>
              <div>
                1. Xuất danh sách các nhân sự có hóa đơn chưa hoàn thành:
                <el-button
                  type="text"
                  style="text-decoration: underline"
                  @click="exportFileMethod('exOrder')"
                  >Xuất file</el-button
                >
              </div>
              <div class="align-row">
                2. Xuất danh sách các nhân sự chưa hoàn thành các khoản thu:
                <el-button
                  type="text"
                  style="text-decoration: underline"
                  @click="exportFileMethod('exIn')"
                  >Xuất file</el-button
                >
              </div>
              <div class="align-row">
                3. Xuất danh sách các nhân sự chưa hoàn thành các khoản chi:
                <el-button
                  type="text"
                  style="text-decoration: underline"
                  @click="exportFileMethod('exOut')"
                  >Xuất file</el-button
                >
              </div>
              <div class="align-row">
                4. Xuất danh sách thu chi tổng hợp của các nhân sự chưa hoàn
                thành:
                <el-button
                  type="text"
                  style="text-decoration: underline"
                  @click="exportFileMethod('exInOut')"
                  >Xuất file</el-button
                >
              </div>
              <div class="align-row">
                5. Xuất danh sách thu chi tổng hợp của các nhân sự đã hoàn
                thành:
                <el-button
                  type="text"
                  style="text-decoration: underline"
                  @click="exportFileMethod('exInOutTrue')"
                  >Xuất file</el-button
                >
              </div>
              <div class="align-row">
                6. Xuất danh sách thu chi tổng hợp của các nhân sự:
                <el-button
                  type="text"
                  style="text-decoration: underline"
                  @click="exportFileMethod('exInOutTotal')"
                  >Xuất file</el-button
                >
              </div>
            </el-row>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>

    <ExportExcelSalaryDialog
      :dialogVisible="showExcelDialog"
      @dialog-close="dialogCloseExcelMethod()"
      ref="ExportExcelSalaryDialog"
    />
  </div>
</template>

<script>
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
import ExportExcelSalaryDialog from "./ExportExcelSalaryDialog.vue";

import moment from "moment";
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
const titleEx = {
  exOrder: "Xuất danh sách các nhân sự có hóa đơn chưa hoàn thành",
  exIn: "Xuất danh sách các nhân sự chưa hoàn thành các khoản thu",
  exOut: "Xuất danh sách các nhân sự chưa hoàn thành các khoản chi",
  exInOut: "Xuất danh sách thu chi tổng hợp của các nhân sự chưa hoàn thành",
  exInOutTrue: "Xuất danh sách thu chi tổng hợp của các nhân sự đã hoàn thành",
  exInOutTotal: "Xuất danh sách thu chi tổng hợp của các nhân sự",
};

export default {
  props: {
    dialogVisible: null,
  },
  components: {
    ExportExcelSalaryDialog,
  },
  data() {
    return {
      textTable: "",
      idKid: "",
      fullName: "",
      showSpinner: true,
      startMonthList: valMonthList,
      endMonthList: valMonthList,
      monthList: valMonthList,

      dataSearch: {
        year: "",
        startMonth: "",
        endMonth: "",
      },
      responseData: {},
      showExcelDialog: false,
      loadingButton: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.showSpinner = true;
        this.loadingButton = false;
      }, 300);
    },
    exportFileMethod(type) {
      this.showExcelDialog = true;
      let titleDialog = "";
      if (type == "exIn") {
        titleDialog = titleEx.exIn;
      } else if (type == "exOut") {
        titleDialog = titleEx.exOut;
      } else if (type == "exOrder") {
        titleDialog = titleEx.exOrder;
      } else if (type == "exInOut") {
        titleDialog = titleEx.exInOut;
      } else if (type == "exInOutTrue") {
        titleDialog = titleEx.exInOutTrue;
      } else if (type == "exInOutTotal") {
        titleDialog = titleEx.exInOutTotal;
      }
      this.$refs.ExportExcelSalaryDialog.getDataInitial(type, titleDialog);
    },
    changeMonthMethod() {
      this.startMonthList = this.monthList.filter(
        (x) => x.key <= this.dataSearch.endMonth
      );
      this.endMonthList = this.monthList.filter(
        (x) => x.key >= this.dataSearch.startMonth
      );
      this.searchByProperties();
    },
    dialogCloseExcelMethod() {
      this.showExcelDialog = false;
      this.searchByProperties();
    },

    searchByProperties() {
      EmployeeSalaryService.statisticalCommon(
        moment(this.dataSearch.year).year(),
        this.dataSearch.startMonth,
        this.dataSearch.endMonth
      )
        .then((resp) => {
          this.responseData = resp.data.data;
          this.showSpinner = false;
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
        });
    },
    getStatisticalCommonInitial() {
      this.dataSearch.year = moment(String(new Date())).format("YYYY-MM-DD");
      this.dataSearch.startMonth = "01";
      this.dataSearch.endMonth = "12";
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
