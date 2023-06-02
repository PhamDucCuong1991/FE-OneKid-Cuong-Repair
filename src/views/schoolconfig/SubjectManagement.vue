<template>
  <div style="margin-top: 5px">
    <div
      v-if="showDataSearch"
      style="margin-bottom: -20px; position: relative; z-index: 1"
    >
      <!-- chọn khối -->
      <el-select
        class="input-common"
        style="width: 140px"
        clearable
        v-model="dataSearch.idGrade"
        @change="changeGradeMethod()"
        placeholder="Chọn khối"
      >
        <el-option
          v-for="item in gradeList"
          :key="item.id"
          :value="item.id"
          :label="item.gradeName"
        ></el-option>
      </el-select>

      <!-- chọn lớp -->
      <el-select
        class="input-common"
        style="width: 140px"
        filterable
        clearable
        v-model="dataSearch.idClass"
        placeholder="Chọn lớp"
        @change="searchByProperties()"
      >
        <el-option
          v-for="item in classList"
          :key="item.id"
          :value="item.id"
          :label="item.className"
        ></el-option>
      </el-select>

      <el-input
        style="width: 280px"
        placeholder="Nhập tên lớp"
        clearable
        v-model="dataSearch.className"
        @clear="searchByProperties()"
        @keyup.enter.native="searchByProperties()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchByProperties()"
        ></el-button>
      </el-input>
    </div>
    <div v-else style="margin-bottom: -20px; position: relative; z-index: 1">
      <el-input
        style="width: 300px"
        placeholder="Nhập tên môn học"
        clearable
        v-model="dataSearchSubject.subjectName"
        @clear="searchSubjectMethod()"
        @keyup.enter.native="searchSubjectMethod()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchSubjectMethod()"
        ></el-button>
      </el-input>
    </div>

    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- subject management -->
        <el-tab-pane label="Phân môn học" name="subjectManegeTab">
          <el-table
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            ref="multipleTable"
            highlight-current-row
            :data="subjectManegeList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="className"
              label="Tên lớp"
              width="200"
            ></el-table-column>
            <el-table-column label="Danh sách áp dụng">
              <template slot-scope="scope">
                <el-tag
                  style="margin-right: 8px"
                  v-for="item in scope.row.subjectList"
                  :key="item.id"
                  type
                  effect="plain"
                  >{{ item.subjectName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_subject_update'])"
              label="Tác vụ"
              width="152"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="addMediaForClassMethod(scope.row)"
                  >Thêm môn học</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- subject list -->
        <el-tab-pane label="Danh sách môn học" name="subjectListTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableSub"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="subjectList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeSubject"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="subjectName"
              label="Tên môn"
              width="250"
            ></el-table-column>
            <el-table-column prop="note" label="Mô tả"></el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_subject_update'])"
              label="Tác vụ"
              width="152"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateSubjectMethod(scope.row)"
                  >{{ $t("button.update") }}</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteSubjectOneMethod(scope.row)"
                  >{{ $t("button.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="checkPermission(['schoolConfig_subject_update'])"
            style="float: right; margin: 15px 0"
          >
            <el-button
              type="success"
              style="border-radius: 0"
              @click="addSubjectMethod()"
              >Thêm môn</el-button
            >
            <el-button
              type="danger"
              style="border-radius: 0"
              @click="deleteSubjectManyMethod()"
              >Xóa môn</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <SubjectUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="SubjectUpdateDialog"
    />
    <SubjectCreateDialog
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
    <AddSubjectForClassDialog
      :dialogVisible="showAddSubjectDialog"
      @dialog-close="dialogCloseAddSubjectMethod()"
      ref="AddSubjectForClassDialog"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";

import SubjectUpdateDialog from "./SubjectUpdateDialog.vue";
import SubjectCreateDialog from "./SubjectCreateDialog.vue";
import AddSubjectForClassDialog from "./AddSubjectForClassDialog.vue";
import {mapActions, mapState} from "vuex";

export default {
  components: {
    SubjectUpdateDialog,
    SubjectCreateDialog,
    AddSubjectForClassDialog,
  },
  data() {
    return {
      activeTabName: "subjectManegeTab",
      showDataSearch: true,
      subjectList: [],
      subjectManegeList: [],
      noSelect: "",
      multipleSelectionSubject: [],
      albumRadio: false,

      loaddingButton: false,
      loadingData: true,
      textTable: "",
      textTableSub: "",

      showUpdateDialog: false,
      showAddSubjectDialog: false,
      showCreateDialog: false,
      loaddingButtonClass: false,

      gradeList: [],
      classList: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        className: "",
      },
      dataSearchSubject: {
        subjectName: "",
      },
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
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyleDetail({ row }) {
      if (
        row.absentStatus == "Nghỉ có phép" ||
        row.absentStatus == "Nghỉ không phép"
      ) {
        return "color: red";
      } else if (row.absentStatus == "Chưa điểm danh") {
        return "color: #409EFF";
      }
    },
    handleSelectionChangeSubject(val) {
      this.multipleSelectionSubject = val;
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "subjectManegeTab") {
        this.showDataSearch = true;
        this.searchByProperties();
      } else if (tabNameClick == "subjectListTab") {
        this.showDataSearch = false;
        this.searchSubjectMethod();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchSubjectMethod();
    },
    dialogCloseAddSubjectMethod() {
      this.showAddSubjectDialog = false;
      this.searchByProperties();
    },
    updateSubjectMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.SubjectUpdateDialog.getDataInitial(row);
    },
    addMediaForClassMethod(row) {
      setTimeout(() => {
        this.showAddSubjectDialog = true;
      }, 100);
      this.$refs.AddSubjectForClassDialog.getSubjectForClassInitial(row.id);
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchSubjectMethod();
    },
    /**
     * thêm môn học
     */
    addSubjectMethod() {
      this.showCreateDialog = true;
    },
    /**
     * xóa nhiều môn học
     */
    deleteSubjectManyMethod() {
      let dataList = this.multipleSelectionSubject;
      if (dataList.length == 0) {
        this.$message({
          message: "Không có môn học nào được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm(
        "Bạn có chắc chắn muốn xóa " + dataList.length + " môn học đã chọn?",
        "Xóa nhiều môn học",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteSubjectMany(dataList)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: resp.data.data == 0 ? "warning" : "success",
            });
            this.searchSubjectMethod();
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
      });
    },
    /**
     * xóa 1 môn học
     */
    deleteSubjectOneMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa môn học này không?",
        "Xóa môn học",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteSubjectOne(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchSubjectMethod();
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
      });
    },

    /**
     * tìm kiếm tất cả môn học
     */
    searchSubjectMethod() {
      this.loadingData = true;
      SchoolConfigService.searchSubject(this.dataSearchSubject.subjectName)
        .then((resp) => {
          this.subjectList = resp.data.data;
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
        })
        .finally(() => {
          if (this.subjectList.length == 0) {
            this.textTableSub = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm thông tin của tab phân môn học
     */
    searchByProperties() {
      this.loadingData = true;
      let data = this.dataSearch;
      SchoolConfigService.findAllSubjectManege(
        data.idGrade,
        data.idClass,
        data.className
      )
        .then((resp) => {
          this.subjectManegeList = resp.data.data;
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
        })
        .finally(() => {
          if (this.subjectManegeList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
      // .finally(() => {
      //   this.getClassFirstGrade(this.dataSearch.idGrade);
      // });
    },
    /**
     * thay đổi khối
     */
    changeGradeMethod() {
      this.dataSearch.idClass = "";
      this.getClassOfGrade();
      this.searchByProperties();
    },
    /**
     * tìm tất cả các khối trong một trường
     */
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
          if (this.gradeList.length > 0) {
            this.dataSearch.idGrade = this.gradeList[0].id;
          }
    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassOfGrade() {
      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])

    },
    async fetchDataMany() {
      await this.getAllGrade();
      this.getClassOfGrade();
      this.searchByProperties();
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
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 10px 0;
// }
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
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
// .wrapper-table {
//   height: 600px;
//   // overflow-y: scroll;
//   border-bottom: 1px solid #ebeef5;
// }
// .table-header {
//   position: sticky;
// }
// table{

// }
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
  // display: block;
  // width: 90%;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  // height: 600px;
  font-family: Arial, Helvetica, sans-serif;
  // display: block;
  // width: 90%;
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
</style>
