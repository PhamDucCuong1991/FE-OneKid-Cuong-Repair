<template>
  <div>
    <el-dialog
      :title="'Xuất file tổng hợp điểm danh'"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="10vh"
    >
      <el-form
        label-width="100px"
        :model="dataInput"
        label-position="left"
        :rules="rules"
        ref="dataInput"
      >
        <el-form-item label="Chọn ngày">
          <el-date-picker
            v-model="dateStartEnd"
            type="daterange"
            unlink-panels
            style="width: 300px"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="Trạng thái" prop="status">
          <!-- chọn trạng thái -->
          <el-select
            class="button-left-status"
            v-model="dataInput.status"
            placeholder="Trạng thái"
            style="width: 300px"
          >
            <el-option
              v-for="item in employyeeStatusList"
              :key="item.key"
              :value="item.key"
              :label="item.value"
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
          v-if="this.dateStartEnd.length == 0 || this.dataInput.status == null"
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
    <PeopleTypeCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
  </div>
</template>

<script>
import AttendanceEmployeeService from "../../services/AttendanceEmployeeService";
// import http from "../../http-download";
import moment from "moment";
import {mapActions, mapState} from "vuex";
export default {
  components: {},
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      employyeeStatusList: [
        { key: "Đang làm", value: "Đang làm" },
        { key: "Tạm nghỉ", value: "Tạm nghỉ" },
        { key: "Nghỉ làm", value: "Nghỉ làm" },
      ],
      listClass: [],
      dateStartEnd: [],
      value1: [],
      textarea: "",
      typeInternalList: [],
      pickerOptions: {},
      selectDate: "",
      dataInput: {
        status: "",
      },
      showCreateDialog: false,
      loadingButton: false,
      rules: {},
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

  computed: {},
  ...mapState(['serverDataGrade']),
  ...mapState(['serverDataClass']),
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    submitForm() {
      this.$confirm("Bạn có chắc chắn muốn xuất file không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        this.getStyleExcelDate();
        let myDate = moment().format("DD-MM-YYYY hh:mm:ss");
        AttendanceEmployeeService.getExportExcelEmployeeTotal(
          this.dateStartEnd,
          this.dataInput.status
        )
          .then((resp) => {
            import("@/services/ExportExcel")
              .then((excel) => {
                let dataList = resp.data.data;
                let fileName = `THONG_KE_DIEM_DANH_${myDate}`;
                const merges = [
                  "A5:B5",
                  "C5:E5",
                  "F5:N5",
                  "P5:R5",
                  "A6:A7",
                  "B6:B7",
                  "C6:C7",
                  "D6:D7",
                  "E6:E7",
                  "O6:O7",
                  "P6:P7",
                  "Q6:Q7",
                  "R6:R7",
                  "S6:S7",
                  "T6:T7",
                  "F6:H6",
                  "I6:K6",
                  "L6:N6",
                ];
                const tHeader = [
                  "",
                  "",
                  "",
                  "",
                  "",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "Có phép",
                  "Không phép",
                  "Đi làm",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
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
                  "pro10",
                  "pro11",
                  "pro12",
                  "pro13",
                  "pro14",
                  "pro15",
                  "pro16",
                  "pro17",
                  "pro18",
                  "pro19",
                  "pro20",
                ];
                let columnList = [
                  { col: 4 },
                  { col: 25 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 10 },
                  { col: 6 },
                  { col: 6 },
                  { col: 6 },
                  { col: 10 },
                  { col: 10 },
                ];
                excel.export_json_to_excel({
                  header: tHeader,
                  merges,
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
              });
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Thất bại",
              type: "error",
            });
          });
      });
    },
    //Style css Excel Date
    getStyleExcelDate() {
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
        name: "A6:T7",
        style: {
          fill: { fgColor: { rgb: "f8eb00" } },
          font: { sz: 10 },
          alignment,
          border,
        },
      };
      //style1
      let styleCol1 = {
        name: "A5:B5",
        style: {
          fill: { fgColor: { rgb: "cfcfcf" } },
          font: { bold: true, sz: "11", color: { rgb: "f70000" } },
          alignment,
          border,
        },
      };
      let styleCol2 = {
        name: "C5:E50",
        style: {
          fill: { fgColor: { rgb: "83a4c4" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol3 = {
        name: "F5:N50",
        style: {
          fill: { fgColor: { rgb: "95cb4a" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol4 = {
        name: "P5:R50",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol5 = {
        name: "O5:O50",
        style: {
          fill: { fgColor: { rgb: "b4c6e7" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol6 = {
        name: "T5:T50",
        style: {
          fill: { fgColor: { rgb: "e0bf1c" } },
          font,
          alignment,
          border,
        },
      };
      let styleCol7 = {
        name: "S5:S50",
        style: {
          fill: { fgColor: { rgb: "ffc000" } },
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
        name: ["A2", "A3", "A4"],
        style: {
          font: { bold: true, sz: "11" },
        },
      };

      this.styleCols2.push(styleCol1);
      this.styleCols2.push(styleCol2);
      this.styleCols2.push(styleCol3);
      this.styleCols2.push(styleCol4);
      this.styleCols2.push(styleCol5);
      this.styleCols2.push(styleCol6);
      this.styleCols2.push(styleCol7);
      this.styleCols2.push(style1);
      // this.styleCols2.push(styleCol4);
      // this.styleCols2.push(styleCol5);
      // this.styleCols2.push(styleCol6);

      this.styleCols1.push(styleCol01);
      this.styleCols1.push(styleCol02);
    },
    getClass() {

          this.listClass = mapState(['serverDataClass'])

    },
    createDialogMethod() {
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
    },

    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
  },

  beforeMount() {
    this.getClass();
    this.getCurrentDate();
  },
};
</script>

<style lang="scss" scoped></style>
