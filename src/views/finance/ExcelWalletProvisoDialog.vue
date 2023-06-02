<template>
  <el-dialog
      title="Điều kiện xuất file excel"
      :visible.sync="dialogVisible"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      width="800px"
  >
    <div class="select-main">
      <!-- chọn trạng thái -->
      <el-select
          style="width: 140px"
          class="button-left-status"
          v-model="dataSearch.status"
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
          :clearable="true"
          class="button-left-status"
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
          :clearable="true"
          class="button-left-status"
          style="width: 140px"
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
      >
        <el-option
            v-for="item in classOfGradeList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
        ></el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close"/>
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="exportExcelWallet()"
      >
        <i class="el-icon-circle-check"/>
        <span>Xuất file excel</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {mapActions, mapState} from "vuex";

const valkidStatusList = [
  {key: "STUDYING", value: "Đang học"},
  {key: "STUDY_WAIT", value: "Chờ học"},
  {key: "RESERVE", value: "Bảo lưu"},
  {key: "LEAVE_SCHOOL", value: "Nghỉ học"},
];
import FnFeesService from "@/services/FnFeesService";

export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      loadingButton: false,
      gradeOfSchoolList: [],
      classOfGradeList: [],
      kidStatusList: valkidStatusList,
      dataSearch: {
        status: "STUDYING",
        idClass: "",
        idGrade: "",
      },
      //css excel
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
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.dataSearch = {
          idClass: "",
        };
      }, 500);
    },
    //export kids group out
    exportExcelWallet() {
      this.loadingButton = true;
      this.$confirm("Bạn có chắc chắn muốn xuất file excel?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      })
          .then(() => {
            this.getStyleExcel();
            FnFeesService.exportWalletExcelPro(
                this.dataSearch.status,
                this.dataSearch.idClass
            )
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
                          {col: 5},
                          {col: 10},
                          {col: 25},
                          {col: 15},
                          {col: 15},
                          {col: 15},
                          {col: 15},
                          {col: 15},
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
    //Css Excel kids group out
    getStyleExcel() {
      let font = this.$styleExcel.fontTitle();
      let alignment = this.$styleExcel.alignmentTitle();
      let border = this.$styleExcel.borderTitle();
      let styleCol1 = {
        name: ["A2", "A3"],
        style: {font: {bold: true}},
      };
      let styleCol2 = {
        name: ["A1"],
        style: {font: {bold: true, color: {rgb: "ff0000"}, sz: 18}},
      };
      let style1 = {
        name: "A4:H4",
        style: {
          fill: {fgColor: {rgb: "00b0f0"}},
          font,
          alignment,
          border,
        },
      };
      this.styleCols1.push(styleCol1);
      this.styleCols1.push(styleCol2);
      this.styleCols2.push(style1);
    },

    async getAllGrade() {

      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
      if (this.gradeOfSchoolList.length > 0) {
        this.dataSearch.idGrade = this.gradeOfSchoolList[0].id;
      }
      await this.changeGradeSearch();


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
    async changeGradeSearch() {
      await this.getClassInGrade();
    },
  },
};
</script>

<style lang="scss" scoped>
.button-left-status {
  margin-right: 5px;
}
</style>
