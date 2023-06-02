<template>
  <div style="visibility: hidden">
    <el-dialog
      class="andanh"
      title="In phiếu thu phí"
      :visible.sync="dialogVisible"
      width="550px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <span ref="documentPrint">
        <br />
        <div>
          <div>
            <el-row :gutter="10">
              <el-col style="text-align: right; width: 18%">
                <img
                  :src="responseData.avatar"
                  alt="Girl in a jacket"
                  width="70"
                  height="70"
                />
              </el-col>
              <el-col style="width: 82%">
                <div style="text-align: center;  width: 360px">
                  <div style="font-weight: bold">
                    {{ responseData.schoolName }}
                  </div>
                  <div style="font-size: 12px; margin-bottom: 4px">
                    {{ responseData.schoolAddress }}
                  </div>
                  <div style="font-weight: bold">
                    PHIẾU THU PHÍ THÁNG
                    {{ this.moment(this.date).format("MM/YYYY") }}
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <div style="float: left; font-size: 12px">
              <div>Họ tên: {{ responseData.fullName }}</div>
              <div>Lớp: {{ responseData.className }}</div>
              <div>SĐT: {{ responseData.phone }}</div>
              <div
                style="font-size: 12px; font-style: italic; margin-bottom: 3px"
              >
                Ngày {{ this.moment().format("DD") }} tháng
                {{ this.moment().format("MM") }} năm
                {{ this.moment().format("YYYY") }}
              </div>
            </div>
            <div style="float: right; font-size: 12px">
              <div style="text-align: right">Mã: ..........</div>
              <div style="text-align: right">Quyển số: ..........</div>
              <div style="text-align: right">Số: ..........</div>
              <div style="margin-bottom: 3px; text-align: right">
                Đơn vị: VNĐ
              </div>
            </div>
          </div>
          <br />
          <br />
          <el-table
            class="incainay"
            ref="multipleTable"
            :empty-text="textTable"
            :data="responseData.dataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            :span-method="arraySpanMethod"
            @selection-change="handleSelectionChange"
            border
          >
            <el-table-column
              type="index"
              label="TT"
              width="36"
              align="center"
            ></el-table-column>
            <el-table-column label="Tên loại phí" width="140">
              <template slot-scope="scope">
                <div
                  :style="
                    scope.row.name == 'Tổng cộng' ||
                    scope.row.name == 'Số dư trong ví' ||
                    scope.row.name == 'Số tiền đã trả' ||
                    scope.row.name == 'Số tiền còn thiếu'
                      ? 'text-align: right'
                      : ''
                  "
                >
                  {{ scope.row.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="SL"
              align="center"
              width="40"
            ></el-table-column>
            <el-table-column label="Đơn giá" align="right" width="76">
              <template slot-scope="scope">
                <span v-if="scope.row.price == 0">0</span>
                <span v-else>{{ scope.row.price | formatNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Thành tiền" align="right" width="76">
              <template slot-scope="scope">
                <span v-if="scope.row.money == 0">0</span>
                <span v-else>{{ scope.row.money | formatNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Đã thu" align="right" width="76">
              <template slot-scope="scope">
                <span v-if="scope.row.paid == 0">0</span>
                <span v-else>{{ scope.row.paid | formatNumber }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Thiếu" align="right" width="76">
              <template slot-scope="scope">
                <span v-if="scope.row.remain == 0">0</span>
                <span v-else>{{ scope.row.remain | formatNumber }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div
            style="
              margin-top: 4px;
              font-size: 12px;
              font-style: italic;
              margin-bottom: 3px;
            "
          >
            {{ responseData.bankInfo }}
          </div>
          <div style="font-size: 13px">
            Ngân hàng: {{ responseData.bankNameBank }}
          </div>
          <div style="font-size: 13px">
            Số tài khoản: {{ responseData.accountNumberBank }}
          </div>
          <div style="font-size: 13px">
            Chủ tài khoản: {{ responseData.fullNameBank }}
          </div>
          <div style="margin-top: 3px">
            <strong style="margin-left: 50px">Người nộp tiền</strong>
            <div
              style="margin-left: 320px; text-align: center; font-weight: bold"
            >
              <div>Người lập phiếu</div>
              <br />
              <br />
              <br />
              <div>
                {{ responseData.userCreate }}
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 80px">{{ description }}</div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="success"
          size="medium"
          :loading="loadingPdfButton"
          @click="exportToPDFMethod()"
        >
          <i class="el-icon-printer" />
          <span>In hóa đơn </span>
        </el-button>
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import html2pdf from "html2pdf.js";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: this.$tableEmpty,
      responseList: [],
      responseData: {},
      loadingButton: false,
      showOrderKidsAllDialog: false,
      date: "",
      description: "",
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #b3b3b3;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (
        row.name == "Tổng cộng" ||
        row.name == "Số dư trong ví" ||
        row.name == "Số tiền đã trả" ||
        row.name == "Số tiền còn thiếu" ||
        row.identify == "moneyString"
      ) {
        if (row.name === "Tổng cộng") {
          return "font-weight: bold; background: #b3b3b3";
        } else if (row.identify === "moneyString") {
          return "font-style: italic";
        } else {
          return "font-weight: bold";
        }
      }
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {}, 300);
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex);
      if (row.name == "Tổng cộng") {
        if (columnIndex === 0) {
          return [0, 0];
        } else if (columnIndex === 1) {
          return [1, 4];
        } else if (columnIndex === 2) {
          return [0, 0];
        } else if (columnIndex === 3) {
          return [0, 0];
        }
      } else if (
        row.name == "Số dư trong ví" ||
        row.name == "Số tiền đã trả" ||
        row.name == "Số tiền còn thiếu"
      ) {
        if (columnIndex === 1) {
          return [1, 4];
        } else if (columnIndex === 4) {
          return [1, 3];
        } else {
          return [0, 0];
        }
      } else if (row.identify == "moneyString") {
        if (columnIndex === 1) {
          return [1, 7];
        } else {
          return [0, 0];
        }
      }
    },
    exportToPDFMethod() {
      let element = this.$refs.documentPrint;
      var opt = {
        margin: 0.2,
        filename:
          "PHIEU_THU_PHI_THANG_" +
          this.moment(this.date).format("MM_YYYY") +
          ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, y: 0, scrollY: 0, removeContainer: false },
        jsPDF: { unit: "in", format: "A5", orientation: "portrait" },
      };
      html2pdf()
        .from(element)
        .set(opt)
        .save();
      this.$emit("dialog-close");
    },
    async convertMoneyToString() {
      let rowData = this.responseData.dataList.filter(
        (x) => x.name == "Số tiền còn thiếu"
      )[0];
      await import("@/services/ConvertMoneyToString").then((x) => {
        let moneyString = x.ConvertMoneyToString(rowData.money);
        let rowInput = {
          identify: "moneyString",
          name: moneyString,
        };
        this.responseData.dataList.push(rowInput);
      });
    },
    async printMethod(idKid, date, category, idList, description) {
      this.date = date;
      this.description = description;
      await FnFeesService.OrderPrintIn(idKid, category, idList)
        .then((resp) => {
          this.responseData = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    async getDataInitialPrint(idKid, date, category, idList, description) {
      await this.printMethod(idKid, date, category, idList, description);
      await this.convertMoneyToString();
      this.exportToPDFMethod();
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
/deep/.el-table td > .cell {
  word-break: break-word;
  font-family: arial;
  font-size: 10px;
  color: black;
  padding: 0px 4px !important;
}
/deep/.el-table th > .cell {
  word-break: break-word;
  font-size: 11px !important;
  color: black;
}
/deep/.el-dialog__body {
  padding: 0;
}
/deep/.el-table td {
  padding: 0px 0 !important;
  border-bottom: 1px solid #989ba0;
  border-right: 1px solid #989ba0;
}
/deep/.el-table th {
  padding: 0px 0 !important;
  border-right: 1px solid #909399;
}
.el-table {
  border: 1px solid #909399;
  border-radius: 0;
}
.input-common {
  margin-right: 5px;
}
</style>
