<template>
  <!-- <div class="content">
    <el-dialog
      :visible.sync="dialogVisibleExStudent"
      width="50%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="THÊM HỌC SINH TỪ EXCEL"
    >
      <div style="display: flex; justify-content: space-between">
        <el-upload
          ref="upload"
          class="upload-demo"
          action
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :auto-upload="false"
          :on-change="importFile"
          :limit="1"
          :on-exceed="handleExceed"
          :on-preview="handleFileRequest"
        >
          <el-button
            @change="importFile()"
            size="mini"
            type="primary"
            style="width: 100px"
            >Nhập file</el-button
          >
        </el-upload>
        <el-button
          @click="dowloadFile()"
          size="mini"
          type="primary"
          style="width: 100px; max-height: 30px"
        >
          <a
            href="https://upload.onekids.edu.vn/sysfiles/other/MAU_QUAN_LY_HOC_SINH.xlsx"
            style="text-decoration: none; color: white"
          >
            Mẫu File</a
          ></el-button
        >
      </div>
      <div style="margin-top: 50px" v-if="this.file != ''">
        <div style="margin-top: 10px">
          <el-button
            @click="handleChange()"
            v-loading.fullscreen.lock="fullscreenLoading"
            size="mini"
            type="primary"
            style="width: 100px"
            >Tải lên
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div> -->
  <el-dialog
    title="Thêm học sinh từ excel"
    :visible.sync="dialogVisibleExStudent"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="5vh"
  >
    <div style="margin: 20px 0; display: flex; justify-content: space-between">
      <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
      <el-button
        @click="dowloadFile()"
        size="mini"
        type="primary"
        style="width: 100px; max-height: 30px"
      >
        <a
          href="https://upload.onekids.edu.vn/sysfiles/other/MAU_QUAN_LY_HOC_SINH.xlsx"
          style="text-decoration: none; color: white"
        >
          Mẫu File</a
        ></el-button
      >
    </div>

    <div>
      <el-table
        :data="tableData"
        border
        max-height="600"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        style="font-size: 12px"
      >
        <el-table-column
          v-for="item of tableHeader"
          :key="item"
          :prop="item"
          :label="item"
          style="font-size: 10px"
        />
      </el-table>
    </div>
    <span slot="footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        :disabled="tableData.length == 0"
        type="success"
        size="medium"
        :loading="loadingExcelButton"
        mini
        @click="handleCreateStudent()"
      >
        <i class="el-icon-circle-check" />
        <span>Thêm dữ liệu</span>
      </el-button>
    </span>
    {{ listClass }}
  </el-dialog>
</template>

<script>
import StudentService from "../../services/StudentService";
// import moment from "moment";
// import http from "../../http-download";

export default {
  props: {
    dialogVisibleExStudent: null,
  },
  data() {
    return {
      classList: [],
      dataList: {
        bodyList: [],
      },
      tableData: [],
      tableHeader: [],
      loadingExcelButton: false,
      file: "",
      url: "http://upload.onekids.edu.vn/sysfiles/other/MAU_QUAN_LY_HOC_SINH.xlsx",
      fullscreenLoading: false,
      loading: "",
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.tableData = [];
        this.tableHeader = [];
      }, 300);
    },
    //check size file
    beforeUpload(file) {
      return this.$funcCommon.checkUploadExcelZize(file);
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      this.dataList.bodyList = [];
      // debugger;
      results.forEach((item) => {
        let i = 0;
        this.dataList.bodyList.push(
          this.loda.mapKeys(item, () => {
            i++;
            return "pro" + i;
          })
        );
      });
    },
    handleCreateStudent() {
      let check = true;
      let mess = "";
      let regex_phone = /^0[0-9]{9}$/;
      let regex_date = /^(0[1-9]|[1-2][0-9]|3[0-1])[/](0[1-9]|1[0-2])[/][0-9]{4}$/;
      let a = 1;
      this.dataList.bodyList.forEach((i) => {
        if (i.pro2 != "") {
          if (this.checkDataGrade(this.$attrs.gradeList, i.pro2) == 0) {
            mess += `${a++}. Khối học có STT ${i.pro1} không thuộc trường này.<br/>`;
            check = false;
          }
        } else {
          if (i.pro2.length == 0) {
            mess += `${a++}. Khối học có STT ${i.pro1} không được để trống.<br/>`;
            check = false;
          }
        }
        if (i.pro3 != "") {
          if (this.checkDataClass(i.pro3, i.pro2) == 0) {
            mess += `${a++}. Lớp học có STT ${i.pro1} không thuộc khối đã đã nhập.<br/>`;
            check = false;
          }
        } else {
          if (i.pro3.length == 0) {
            mess += `${a++}. Lớp học có STT ${i.pro1} không được để trống.<br/>`;
            check = false;
          }
        }
        if (i.pro5.length == 0) {
          mess += `${a++}. Ngày sinh có STT ${i.pro1} không được để trống.<br/>`;
          check = false;
        } else if (!regex_date.test(i.pro5)) {
          mess += `${a++}. Ngày sinh có STT ${
            i.pro1
          } chưa đúng định dạng DD/MM/YYYY.<br/>`;
          check = false;
        }
        if (i.pro6 != "Nữ" && i.pro6 != "Nam") {
          mess += `${a++}. Giới tính có STT ${i.pro1} nhập chưa đúng 'Nam/Nữ'.<br/>`;
          check = false;
        }
        if (i.pro11 != "Bố" && i.pro11 != "Mẹ") {
          mess += `${a++}. Người đại diện có STT ${i.pro1} nhập chưa đúng 'Bố/Mẹ'.<br/>`;
          check = false;
        }
        if (i.pro12.length == 0) {
          mess += `${a++}. Ngày nhập học có STT ${i.pro1} không được để trống.<br/>`;
          check = false;
        } else if (!regex_date.test(i.pro12)) {
          mess += `${a++}. Ngày nhập học có STT ${
            i.pro1
          } chưa đúng định dạng DD/MM/YYYY.<br/>`;
          check = false;
        }
        if (!regex_phone.test(i.pro15) && i.pro15 != "") {
          mess += `${a++}. Số điện thoại mẹ có STT ${
            i.pro1
          } phải có 10 chữ số (0xxx).<br/>`;
          check = false;
        }
        if (i.pro13 == "" && i.pro15 != "") {
          mess += `${a++}. Họ tên mẹ có STT ${i.pro1} không được để trống.<br/>`;
          check = false;
        }
        if (!regex_phone.test(i.pro20) && i.pro20 != "") {
          mess += `${a++}. Số điện thoại bố có STT ${
            i.pro1
          } phải có 10 chữ số (0xxx).<br/>`;
          check = false;
        }
        if (i.pro18 == "" && i.pro20 != "") {
          mess += `${a++}. Họ tên bố có STT ${i.pro1} không được để trống.<br/>`;
          check = false;
        }
        i.pro14 = this.setDateFormat(i.pro14);
        i.pro19 = this.setDateFormat(i.pro19);
      });
      if (check) {
        this.loadingExcelButton = true;
        StudentService.createStudentExcel(this.dataList)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.closeDialog();
            }, 500);
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingExcelButton = false;
            }, 500);
          });
      } else {
        this.validateDialog(mess);
      }
    },
    validateDialog(mess) {
      this.$confirm(mess, "Thông báo", {
        type: "warning",
        customClass: "messageBox_class",
        dangerouslyUseHTMLString: true,
        showCancelButton: false,
      });
    },
    setDateFormat(date) {
      let regex_date = /^(0[1-9]|[1-2][0-9]|3[0-1])[/](0[1-9]|1[0-2])[/][0-9]{4}$/;
      if (!regex_date.test(date)) {
        return "";
      } else {
        return date;
      }
    },
    checkDataGrade(dataProp, pro) {
      let d = 0;
      dataProp.forEach((i) => {
        if (pro === i.gradeName) {
          d++;
        }
      });
      return d;
    },
    checkDataClass(proClass, proGrade) {
      let d = 0;
      this.classList.forEach((i) => {
        if (proClass === i.className && proGrade === i.gradeName) {
          d++;
        }
      });
      return d;
    },
    dowloadFile() {
      const url = this.url;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "MAU_QUAN_LY_HOC_SINH.xlsx"); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    getDataImportExcelInitial() {
      StudentService.getAllClassCommonNew().then((resp) => {
        this.classList = resp.data.data;
      });
    },
  },
  // mounted() {
  //   alert("gg");
  //   this.getClassAll();
  // },
};
</script>
<style lang="scss" scoped>
/deep/.el-table th > .cell {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  text-align: center !important;
}
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  white-space: pre-line;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
  max-height: 50px;
  text-overflow: ellipsis;
}
.table-content {
  .el-table {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid #78a5e7;
  }
}
</style>
