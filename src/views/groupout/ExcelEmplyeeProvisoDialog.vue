<template>
  <el-dialog
    title="Điều kiện xuất file excel"
    :visible.sync="dialogVisible"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    width="800px"
  >
    <div class="select-main">
      <el-date-picker
        style="width: 100px"
        class="button-left-status"
        :clearable="false"
        v-model="dataSearch.year"
        type="year"
        value-format="yyyy-MM-dd"
        format="yyyy"
      ></el-date-picker>
      <el-date-picker
        class="button-left-status"
        style="width: 300px"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        v-model="dataSearch.dateInList"
        type="daterange"
        unlink-panels
        range-separator="-"
        start-placeholder="Ngày vào"
        end-placeholder="Ngày kết thúc"
      >
      </el-date-picker>
      <el-date-picker
        class="button-left-status"
        style="width: 300px"
        value-format="yyyy-MM-dd"
        format="dd-MM-yyyy"
        v-model="dataSearch.birthdayList"
        type="daterange"
        unlink-panels
        range-separator="-"
        start-placeholder="Ngày sinh"
        end-placeholder="Ngày kết thúc"
      >
      </el-date-picker>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="exportExcelEmployee()"
      >
        <i class="el-icon-circle-check" />
        <span>Xuất file excel</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import GroupOutService from "@/services/GroupOutService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,
      dataSearch: {
        year: this.moment().format("YYYY-MM-DD"),
        dateInList: "",
        birthdayList: "",
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.dataSearch = {
          year: this.moment().format("YYYY-MM-DD"),
          dateInList: "",
          birthdayList: "",
        };
      }, 500);
    },
    //export employee group out
    exportExcelEmployee() {
      this.loadingButton = true;
      this.$confirm("Bạn có chắc chắn muốn xuất file excel?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      })
        .then(() => {
          if (this.dataSearch.dateInList == null) {
            this.dataSearch.dateInList = "";
          }
          if (this.dataSearch.birthdayList == null) {
            this.dataSearch.birthdayList = "";
          }
          this.getStyleExcel();
          GroupOutService.getExportExcelEmployeeGroupOutProviso(
            this.dataSearch.year,
            this.dataSearch.dateInList,
            this.dataSearch.birthdayList
          )
            .then((resp) => {
              import("@/services/ExportExcel")
                .then((excel) => {
                  let dataList = resp.data.data;
                  let fileName = "DANH_SACH_NHAN_SU_RA_TRUONG";
                  const tHeader = [
                    "STT",
                    "Mã Nhân sự",
                    "Họ và tên",
                    "Phòng ban",
                    "Ngày sinh",
                    "Giới tính",
                    "SĐT",
                    "Ngày vào",
                    "Ngày ra trường",
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
                    "pro9",
                  ];
                  let columnList = [
                    { col: 5 },
                    { col: 10 },
                    { col: 25 },
                    { col: 25 },
                    { col: 15 },
                    { col: 10 },
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
                  this.downloadLoading = false;
                })
                .finally(() => {
                  this.styleCols1 = [];
                  this.styleCols2 = [];
                  this.loadingButton = false;
                  this.closeDialog();
                });
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        })
        .catch(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    //Css Excel employee group out
    getStyleExcel() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let styleCol1 = {
        name: ["A2", "A3", "A4"],
        style: { font: { bold: true } },
      };
      let styleCol2 = {
        name: ["A1"],
        style: { font: { bold: true, color: { rgb: "ff0000" }, sz: 18 } },
      };
      let style1 = {
        name: "A5:I5",
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
  },
};
</script>

<style lang="scss" scoped>
.button-left-status {
  margin-right: 5px;
}
</style>
