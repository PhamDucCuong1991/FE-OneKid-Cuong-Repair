<template>
  <div>
    <el-dialog
      :title="titleDialog"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="10vh"
    >
      <el-form
        label-width="130px"
        :model="dataInput"
        label-position="left"
        :rules="rules"
        ref="dataInput"
      >
        <el-form-item label="Chọn tháng">
          <el-select
            style="width: 120px"
            v-model="dataInput.startMonth"
            @change="changeStartMonth()"
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
            v-model="dataInput.endMonth"
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
            v-model="dataInput.year"
            type="year"
            value-format="yyyy-MM-dd"
            format="yyyy"
          ></el-date-picker
        ></el-form-item>
        <el-form-item label="Trạng thái">
          <el-select
            class="button-left-status"
            v-model="dataInput.status"
            placeholder="Trạng thái"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in statusList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>

        <el-button
          v-if="this.dataInput.status == null"
          type="success"
          size="medium"
          disabled
          :loading="loadingButton"
          mini
        >
          <i class="el-icon-circle-check" />
          <span>Xuất file</span>
        </el-button>

        <el-button
          v-else
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>Xuất file</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DepartmentDataService from "@/services/DepartmentDataService";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
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
  components: {},
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      titleDialog: "",
      statusList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      departmentList: [],
      startMonthList: valMonthList,
      endMonthList: valMonthList,
      dataInput: {
        type: "",
        startMonth: "",
        endMonth: "",
        year: "",
        status: "",
        idDepartment: "",
      },
      showCreateDialog: false,
      loadingButton: false,
      rules: {
        idDepartment: [
          {
            required: true,
            message: "Phòng ban không được để trống",
            trigger: "blur",
          },
        ],
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
    };
  },
  computed: {},
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    exportExcelOrderMethod(dataList) {
      this.getStyleExcel();
      import("@/services/ExportExcel").then((excel) => {
        let fileName =
          "HD_CHUA_HOAN_THANH_NS_" + this.$funcCommon.formarDDMMYYYY();
        const tHeader = [
          "STT",
          "Tên nhân sự",
          "Số điện thoại",
          "Danh sách mã hóa đơn",
        ];
        const filterVal = ["pro1", "pro2", "pro3", "pro4"];
        let columnList = [{ col: 5 }, { col: 25 }, { col: 15 }, { col: 100 }];
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
      });
    },
    //Style css Excel
    getStyleExcel() {
      let typeLocal = this.dataInput.type;
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let style1 = {
        name: "",
        style: {
          fill: { fgColor: { rgb: "0089cb" } },
          font,
          alignment,
          border,
        },
      };
      if (typeLocal == "exOrder") {
        style1.name = "A4:D4";
      } else if (typeLocal == "exIn") {
        style1.name = "A4:G4";
      } else if (typeLocal == "exOut") {
        style1.name = "A4:G4";
      } else if (typeLocal == "exInOut" || typeLocal == "exInOutTotal") {
        style1.name = "A4:H4";
      } else if (typeLocal == "exInOutTrue") {
        style1.name = "A4:E4";
      }

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
    exportExcelInMethod(dataList) {
      this.getStyleExcel();
      import("@/services/ExportExcel").then((excel) => {
        let fileName =
          "KT_CHUA_HOAN_THANH_NS_" + this.$funcCommon.formarDDMMYYYY();
        const tHeader = [
          "STT",
          "Tên nhân sự",
          "Số điện thoại",
          "Danh sách mã hóa đơn",
          "Tổng phải thu",
          "Tổng đã thu",
          "Còn lại phải thu",
        ];
        const filterVal = [
          "pro1",
          "pro2",
          "pro3",
          "pro4",
          "pro5",
          "pro6",
          "pro7",
        ];
        let columnList = [
          { col: 5 },
          { col: 25 },
          { col: 15 },
          { col: 60 },
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
      });
    },
    exportExcelOutMethod(dataList) {
      this.getStyleExcel();
      import("@/services/ExportExcel").then((excel) => {
        let fileName =
          "KC_CHUA_HOAN_THANH_NS" + this.$funcCommon.formarDDMMYYYY();
        const tHeader = [
          "STT",
          "Tên nhân sự",
          "Số điện thoại",
          "Danh sách mã hóa đơn",
          "Tổng phải chi",
          "Tổng đã chi",
          "Còn lại phải chi",
        ];
        const filterVal = [
          "pro1",
          "pro2",
          "pro3",
          "pro4",
          "pro5",
          "pro6",
          "pro7",
        ];
        let columnList = [
          { col: 5 },
          { col: 25 },
          { col: 15 },
          { col: 60 },
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
      });
    },
    exportExcelInOutMethod(dataList) {
      this.getStyleExcel();
      import("@/services/ExportExcel").then((excel) => {
        let fileName =
          "HD_TONG_HOP_NS_CHUA_HOAN_THANH" + this.$funcCommon.formarDDMMYYYY();
        const tHeader = [
          "STT",
          "Tên nhân sự",
          "Số điện thoại",
          "Danh sách mã hóa đơn",
          "Phải thu - Phải chi",
          "Đã thu - Đã chi",
          "Chi thêm",
          "Thu thêm",
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
          { col: 25 },
          { col: 15 },
          { col: 60 },
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
        this.downloadLoading = false;
      });
    },
    exportExcelInOutTrueMethod(dataList) {
      this.getStyleExcel();
      import("@/services/ExportExcel").then((excel) => {
        let fileName =
          "HD_TONG_HOP_NS_DA_HOAN_THANH" + this.$funcCommon.formarDDMMYYYY();
        const tHeader = [
          "STT",
          "Tên nhân sự",
          "Số điện thoại",
          "Danh sách mã hóa đơn",
          "Đã chi - Đã thu",
        ];
        const filterVal = ["pro1", "pro2", "pro3", "pro4", "pro5"];
        let columnList = [
          { col: 5 },
          { col: 25 },
          { col: 15 },
          { col: 60 },
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
      });
    },
    exportExcelInOutTotalMethod(dataList) {
      this.getStyleExcel();
      import("@/services/ExportExcel").then((excel) => {
        let fileName = "HD_TONG_HOP_NS_" + this.$funcCommon.formarDDMMYYYY();
        const tHeader = [
          "STT",
          "Tên nhân sự",
          "Số điện thoại",
          "Danh sách mã hóa đơn",
          "Phải thu - Phải chi",
          "Đã thu - Đã chi",
          "Chi thêm",
          "Thu thêm",
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
          { col: 25 },
          { col: 15 },
          { col: 60 },
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
        this.downloadLoading = false;
      });
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          EmployeeSalaryService.exportStatisticalCommon(
            this.dataInput.type,
            this.dataInput.startMonth,
            this.dataInput.endMonth,
            this.moment(this.dataInput.year).year(),
            this.dataInput.status,
            this.dataInput.idDepartment
          )
            .then((resp) => {
              let typeLocal = this.dataInput.type;
              if (typeLocal == "exOrder") {
                this.exportExcelOrderMethod(resp.data.data);
              } else if (typeLocal == "exIn") {
                this.exportExcelInMethod(resp.data.data);
              } else if (typeLocal == "exOut") {
                this.exportExcelOutMethod(resp.data.data);
              } else if (typeLocal == "exInOut") {
                this.exportExcelInOutMethod(resp.data.data);
              } else if (typeLocal == "exInOutTrue") {
                this.exportExcelInOutTrueMethod(resp.data.data);
              } else if (typeLocal == "exInOutTotal") {
                this.exportExcelInOutTotalMethod(resp.data.data);
              }
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
                this.loadingButton = false;
              }, 500);
            });
        }
      });
    },
    changeStartMonth() {
      if (this.dataInput.startMonth > this.dataInput.endMonth) {
        this.dataInput.endMonth = "";
      }
      this.endMonthList = this.startMonthList.filter(
        (x) => x.key >= this.dataInput.startMonth
      );
    },
    getAllDepartment() {
      DepartmentDataService.getAllCommon()
        .then((res) => {
          this.departmentList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDataMonthFirst() {
      this.dataInput.year = this.moment().format("YYYY-MM-DD");
      this.dataInput.startMonth = "01";
      this.dataInput.endMonth = "12";
      this.dataInput.status = "";
    },
    getDataInitial(type, titleDialog) {
      this.dataInput.type = type;
      this.titleDialog = titleDialog;
      this.getDataMonthFirst();
      this.getAllDepartment();
    },
  },
};
</script>

<style lang="scss" scoped></style>
