<template>
  <div>
    <el-dialog
      :title="'Xuất file chi tiết điểm danh tháng'"
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
            :clearable="false"
            v-model="dataInput.dateStartEnd"
            type="daterange"
            unlink-panels
            style="width: 300px"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="Chọn kiểu" style="width: 100%" prop="type">
          <el-radio-group v-model="dataInput.type" @change="changeTypeMethod()">
            <el-radio :label="true">Toàn bộ trường</el-radio>
            <el-radio :label="false">Theo lớp</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataInput.type == false"
          label="Chọn lớp"
          prop="idClass"
        >
          <el-select
            v-model="dataInput.idClass"
            clearable
            placeholder="Chọn lớp"
            style="width: 300px"
          >
            <el-option
              v-for="item in listClass"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Trạng thái" prop="status">
          <!-- chọn trạng thái -->
          <el-select
            clearable
            style="width: 300px"
            class="button-left-status"
            v-model="dataInput.status"
            placeholder="Trạng thái"
          >
            <el-option
              v-for="item in kidStatusList"
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
import AttendanceService from "@/services/AttendanceService";
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
      kidStatusList: [
        { key: "STUDYING", value: "Đang học" },
        { key: "STUDY_WAIT", value: "Chờ học" },
        { key: "RESERVE", value: "Bảo lưu" },
        { key: "LEAVE_SCHOOL", value: "Nghỉ học" },
      ],
      listClass: [],
      value1: [],
      textarea: "",
      typeInternalList: [],
      pickerOptions: {},
      selectDate: "",
      dataInput: {
        type: true,
        dateStartEnd: "",
        idClass: "",
        status: "",
      },
      showCreateDialog: false,
      loadingButton: false,
      rules: {
        date: [
          {
            required: true,
            message: "Tháng không được để trống",
            trigger: "blur",
          },
        ],
        idClass: [
          {
            required: true,
            message: "Lớp không được để trống",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "Kiểu không được để trống",
            trigger: "blur",
          },
        ],
      },
      //css excel
      styleCols1: [],
      styleCols2: [],
      nameCol: {
        name: "",
        style: "",
        // numberMerges: 1,
      },
    };
  },

  computed: {
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    changeTypeMethod() {
      if (this.dataInput.type) {
        this.dataInput.idClass = "";
      }
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          this.$confirm(
            "Bạn có chắc chắn muốn xuất file không?",
            "Thông báo!",
            {
              distinguishCancelAndClose: true,
              closeOnClickModal: false,
              confirmButtonText: "Có",
              cancelButtonText: "Không",
            }
          ).then(() => {
            this.getStyleExcel();
            AttendanceService.getExportExcelMonthDetail(
              this.dataInput.dateStartEnd,
              this.dataInput.idClass,
              this.dataInput.status
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
                  this.loadingButton = false;
                }, 500);
              });
          });
        }
      });
    },
    //Style css Excel
    getStyleExcel() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      this.nameCol.name = "Tổng";
      this.nameCol.style = {
        fill: { fgColor: { rgb: "3399ff" } },
        font,
        border,
        alignment,
      };
      // let style1 = {
      //   name: "A6:V7",
      //   style: {
      //     fill: { fgColor: { rgb: "f8eb00" } },
      //     font: font,
      //     alignment,
      //     border,
      //   },
      // };
      // let styleCol1 = {
      //   name: "A5:B5",
      //   style: {
      //     fill: { fgColor: { rgb: "cfcfcf" } },
      //     font: { bold: true, sz: "11", color: { rgb: "f70000" } },
      //     alignment,
      //     border,
      //   },
      // };
      let styleCol2 = {
        name: "A5:D200",
        style: {
          fill: { fgColor: { rgb: "83a4c4" } },
          font,
          alignment,
          border,
        },
      };
      // let styleCol3 = {
      //   name: "F5:N50",
      //   style: {
      //     fill: { fgColor: { rgb: "95cb4a" } },
      //     font,
      //     alignment,
      //     border,
      //   },
      // };
      let styleCol4 = {
        name: "E5:BA50",
        style: {
          fill: { fgColor: { rgb: "d9d290" } },
          font,
          alignment,
          border,
        },
      };
      // let styleCol5 = {
      //   name: "O5:O50",
      //   style: {
      //     fill: { fgColor: { rgb: "b4c6e7" } },
      //     font,
      //     alignment,
      //     border,
      //   },
      // };
      // let styleCol6 = {
      //   name: "V5:V50",
      //   style: {
      //     fill: { fgColor: { rgb: "e0bf1c" } },
      //     font,
      //     alignment,
      //     border,
      //   },
      // };
      // let styleCol01 = {
      //   name: ["A1"],
      //   style: {
      //     font: { color: { rgb: "ff0000" }, bold: true, sz: "18" },
      //   },
      // };
      // let styleCol02 = {
      //   name: ["A2", "A3", "A4"],
      //   style: {
      //     font: { bold: true, sz: "11" },
      //   },
      // };

      // this.styleCols2.push(styleCol1);
      this.styleCols2.push(styleCol2);
      // this.styleCols2.push(styleCol3);
      this.styleCols2.push(styleCol4);
      // this.styleCols2.push(styleCol5);
      // this.styleCols2.push(styleCol6);
      // this.styleCols2.push(style1);
      // this.styleCols2.push(styleCol4);

      // this.styleCols1.push(styleCol01);
      // this.styleCols1.push(styleCol02);
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
        this.dataInput.status = "";
        this.dataInput.idClass = "";
        this.dataInput.type = true;
      }, 300);
    },
    getCurrentDate() {
      this.dataInput.date = moment(String(new Date())).format("YYYY-MM-DD");
    },
  },

  beforeMount() {
    this.getClass();
    this.getCurrentDate();
  },
};
</script>

<style lang="scss" scoped></style>
